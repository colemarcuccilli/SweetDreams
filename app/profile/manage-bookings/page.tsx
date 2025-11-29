'use client';

import { useState, useEffect } from 'react';
import styles from './manage-bookings.module.css';

interface Booking {
  id: string;
  firstName: string;
  lastName: string;
  artistName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  startTime: number;
  duration: number;
  depositAmount: number;
  totalAmount: number;
  remainderAmount: number;
  status: 'pending_approval' | 'pending_deposit' | 'approved' | 'confirmed' | 'completed' | 'cancelled' | 'rejected' | 'deleted';
  stripeCustomerId: string;
  stripePaymentIntentId: string;
  couponCode?: string;
  discountAmount?: number;
  actualDepositPaid?: number;
  createdAt?: string;
  // New fields for admin approval workflow
  sameDayFee?: boolean;
  afterHoursFee?: boolean;
  afterHoursFeeAmount?: number;
  sameDayFeeAmount?: number;
  approvedAt?: string;
  rejectedAt?: string;
  rejectedReason?: string;
  deletedAt?: string;
  adminNotes?: string;
  cancellationEmailSentAt?: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [chargingBookingId, setChargingBookingId] = useState<string | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [notifyingBookingId, setNotifyingBookingId] = useState<string | null>(null);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [confirmingBookingId, setConfirmingBookingId] = useState<string | null>(null);
  const [editingRemainderBookingId, setEditingRemainderBookingId] = useState<string | null>(null);
  const [customRemainderAmount, setCustomRemainderAmount] = useState<string>('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [approvingBookingId, setApprovingBookingId] = useState<string | null>(null);
  const [rejectingBookingId, setRejectingBookingId] = useState<string | null>(null);
  const [softDeletingBookingId, setSoftDeletingBookingId] = useState<string | null>(null);
  const [expandedDebugBookingId, setExpandedDebugBookingId] = useState<string | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState<Record<string, boolean>>({});

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/admin/bookings');
      const data = await response.json();

      if (data.bookings) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleConfirmBooking = async (booking: Booking) => {
    if (!confirm(`Manually confirm this booking for ${booking.firstName} ${booking.lastName}? This should only be done if payment was actually received.`)) {
      return;
    }

    setConfirmingBookingId(booking.id);

    try {
      const response = await fetch('/api/admin/confirm-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Booking confirmed and payment data updated!');
        // Refetch all bookings to get fresh data from database
        await fetchBookings();
      } else {
        alert('Error confirming booking: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to confirm booking');
    } finally {
      setConfirmingBookingId(null);
    }
  };

  const handleEditRemainderClick = (booking: Booking) => {
    setEditingRemainderBookingId(booking.id);
    setCustomRemainderAmount((booking.remainderAmount / 100).toFixed(2));
  };

  const handleCancelRemainderEdit = () => {
    setEditingRemainderBookingId(null);
    setCustomRemainderAmount('');
  };

  const handleChargeRemainder = async (booking: Booking, customAmount?: number) => {
    const amountToCharge = customAmount || booking.remainderAmount;
    const amountInDollars = (amountToCharge / 100).toFixed(2);

    if (!confirm(`Charge $${amountInDollars} for ${booking.firstName} ${booking.lastName} (${booking.artistName})?`)) {
      return;
    }

    setChargingBookingId(booking.id);

    try {
      const response = await fetch('/api/admin/charge-remainder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          customerId: booking.stripeCustomerId,
          amount: amountToCharge,
          duration: booking.duration
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Remainder charged successfully and email sent!');
        // Update booking status
        setBookings(bookings.map(b =>
          b.id === booking.id ? { ...b, status: 'completed', remainderAmount: 0 } : b
        ));
        handleCancelRemainderEdit();
      } else {
        alert('Error charging remainder: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to charge remainder');
    } finally {
      setChargingBookingId(null);
    }
  };

  const handleSaveRemainderAmount = (booking: Booking) => {
    const amountInCents = Math.round(parseFloat(customRemainderAmount) * 100);
    if (isNaN(amountInCents) || amountInCents <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    handleChargeRemainder(booking, amountInCents);
  };

  const handleApproveBooking = async (booking: Booking) => {
    // Calculate actual amount to capture (deposit minus any discount)
    const discountAmount = booking.discountAmount || 0;
    const amountToCapture = booking.depositAmount - discountAmount;

    if (!confirm(`APPROVE booking for ${booking.firstName} ${booking.lastName}?\n\nThis will CAPTURE the authorized payment of $${(amountToCapture / 100).toFixed(2)}${discountAmount > 0 ? ` (${booking.couponCode} applied: -$${(discountAmount / 100).toFixed(2)})` : ''} and send confirmation email to customer.`)) {
      return;
    }

    setApprovingBookingId(booking.id);

    try {
      const response = await fetch('/api/admin/approve-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Booking approved! Payment of $${(data.amountCaptured / 100).toFixed(2)} captured successfully.`);
        await fetchBookings();
      } else {
        alert('Error approving booking: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to approve booking');
    } finally {
      setApprovingBookingId(null);
    }
  };

  const handleRejectBooking = async (booking: Booking) => {
    const reason = prompt(`REJECT booking for ${booking.firstName} ${booking.lastName}?\n\nThis will CANCEL the authorization and notify the customer.\n\nOptional reason for rejection:`);

    if (reason === null) {
      return; // User clicked cancel
    }

    setRejectingBookingId(booking.id);

    try {
      const response = await fetch('/api/admin/reject-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          reason: reason || undefined
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Booking rejected and customer notified.');
        await fetchBookings();
      } else {
        alert('Error rejecting booking: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to reject booking');
    } finally {
      setRejectingBookingId(null);
    }
  };

  const handleSoftDelete = async (booking: Booking) => {
    if (!confirm(`SOFT DELETE booking for ${booking.firstName} ${booking.lastName}?\n\n⚠️ This will:\n- Mark booking as deleted\n- NOT send cancellation email\n- Keep record in database for audit\n\nUse this for duplicate bookings or test bookings.`)) {
      return;
    }

    setSoftDeletingBookingId(booking.id);

    try {
      const response = await fetch('/api/admin/soft-delete-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id })
      });

      const data = await response.json();

      if (data.success) {
        alert('Booking soft-deleted (no email sent).');
        await fetchBookings();
      } else {
        alert('Error soft-deleting booking: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to soft-delete booking');
    } finally {
      setSoftDeletingBookingId(null);
    }
  };

  const handleCancelBooking = async (booking: Booking) => {
    // Parse date in local timezone
    const [year, month, day] = booking.date.split('-').map(Number);
    const bookingDate = new Date(year, month - 1, day, booking.startTime);
    const isFuture = bookingDate > new Date();

    // Check if actual money was paid (not just deposit amount, which could be before coupon)
    const actualPaid = booking.actualDepositPaid !== undefined && booking.actualDepositPaid !== null
      ? booking.actualDepositPaid
      : booking.depositAmount;
    const hasPayment = actualPaid > 0 && booking.stripePaymentIntentId;

    let confirmMessage = `Cancel booking for ${booking.firstName} ${booking.lastName}?\n\n`;

    if (isFuture && hasPayment) {
      confirmMessage += `This will refund the deposit: $${(actualPaid / 100).toFixed(2)}`;
    } else if (isFuture && !hasPayment) {
      confirmMessage += 'No refund will be issued (100% coupon was used or no payment made).';
    } else {
      confirmMessage += 'No refund will be issued (booking is in the past).';
    }

    if (!confirm(confirmMessage)) {
      return;
    }

    setCancellingBookingId(booking.id);

    try {
      const response = await fetch('/api/admin/cancel-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          stripePaymentIntentId: booking.stripePaymentIntentId
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message || 'Booking cancelled successfully');
        // Remove booking from list
        setBookings(bookings.filter(b => b.id !== booking.id));
      } else {
        alert('Error cancelling booking: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to cancel booking');
    } finally {
      setCancellingBookingId(null);
    }
  };

  const handleNotifyCustomer = async (booking: Booking) => {
    if (!confirm(`Send reminder email to ${booking.customerEmail}?`)) {
      return;
    }

    setNotifyingBookingId(booking.id);

    try {
      const response = await fetch('/api/admin/notify-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Reminder email sent successfully!');
      } else {
        alert('Error sending email: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send reminder email');
    } finally {
      setNotifyingBookingId(null);
    }
  };

  const handleEditClick = (booking: Booking) => {
    setEditingBookingId(booking.id);
    setEditDate(booking.date);
    setEditTime(booking.startTime.toString().padStart(2, '0') + ':00');
  };

  const handleCancelEdit = () => {
    setEditingBookingId(null);
    setEditDate('');
    setEditTime('');
  };

  const handleSaveEdit = async (bookingId: string) => {
    if (!editDate || !editTime) {
      alert('Please select both date and time');
      return;
    }

    setSavingEdit(true);

    try {
      const [hours, minutes] = editTime.split(':').map(Number);

      const response = await fetch('/api/admin/update-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          date: editDate,
          startTime: hours
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Booking time updated successfully!');
        // Update the booking in state
        setBookings(bookings.map(b =>
          b.id === bookingId ? { ...b, date: editDate, startTime: hours } : b
        ));
        handleCancelEdit();
      } else {
        alert('Error updating booking: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update booking');
    } finally {
      setSavingEdit(false);
    }
  };

  const formatDate = (dateStr: string, startTime: number) => {
    // Parse date in local timezone to avoid off-by-one day errors
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed

    const timeStr = new Date().setHours(startTime, 0);
    return `${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at ${new Date(timeStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  };

  const getStatusBadge = (status: Booking['status']) => {
    const statusConfig: Record<Booking['status'], { label: string; color: string }> = {
      pending_approval: { label: 'Needs Approval', color: '#ff9800' },  // Orange
      pending_deposit: { label: 'Pending Deposit', color: '#ffa726' },  // Light Orange
      approved: { label: 'Approved', color: '#66bb6a' },  // Light Green
      confirmed: { label: 'Confirmed', color: '#4caf50' },  // Green
      completed: { label: 'Completed', color: '#2196f3' },   // Blue
      cancelled: { label: 'Cancelled', color: '#f44336' },    // Red
      rejected: { label: 'Rejected', color: '#e91e63' },      // Pink
      deleted: { label: 'Deleted', color: '#9e9e9e' }         // Gray
    };

    const config = statusConfig[status];
    return (
      <span className={styles.statusBadge} style={{ background: config.color }}>
        {config.label}
      </span>
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Separate bookings into three categories
  const pendingApprovalBookings = bookings.filter(b => b.status === 'pending_approval' || b.status === 'pending_deposit');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'approved');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Studio Bookings</h1>
        <p className={styles.subtitle}>Manage bookings and charge remainder payments</p>

        {completedBookings.length > 0 && (
          <div className={styles.filterControls}>
            <button
              className={styles.toggleButton}
              onClick={() => setShowCompleted(!showCompleted)}
            >
              {showCompleted ? 'Hide' : 'Show'} Completed ({completedBookings.length})
            </button>
          </div>
        )}
      </div>

      {bookings.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No bookings found</p>
        </div>
      ) : (
        <>
          {pendingApprovalBookings.length > 0 && (
            <>
              <h2 className={styles.sectionTitle}>Pending Approval</h2>
              <div className={styles.bookingsList}>
                {pendingApprovalBookings.map((booking) => (
            <div key={booking.id} className={styles.bookingRow}>
              <div className={styles.bookingInfo}>
                <div className={styles.profilePhoto}>
                  {getInitials(booking.firstName, booking.lastName)}
                </div>
                <div className={styles.bookingText}>
                  <div className={styles.bookingName}>
                    {booking.firstName} {booking.lastName}
                  </div>
                  <div className={styles.bookingArtist}>{booking.artistName}</div>

                  {editingBookingId === booking.id ? (
                    <div className={styles.editForm}>
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className={styles.editInput}
                      />
                      <input
                        type="time"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        className={styles.editInput}
                      />
                      <button
                        onClick={() => handleSaveEdit(booking.id)}
                        disabled={savingEdit}
                        className={styles.saveEditButton}
                      >
                        {savingEdit ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className={styles.cancelEditButton}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className={styles.bookingDateTime}>
                      📅 {formatDate(booking.date, booking.startTime)} • ⏱️ {booking.duration}h
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.bookingDetails}>
                <div className={styles.bookingMoney}>
                  {booking.couponCode && (
                    <div className={styles.moneyRow}>
                      <span className={styles.moneyLabel}>Coupon:</span>
                      <span className={styles.couponValue}>
                        {booking.couponCode}
                        {booking.discountAmount && booking.discountAmount > 0 && (
                          <> (-${(booking.discountAmount / 100).toFixed(2)})</>
                        )}
                      </span>
                    </div>
                  )}
                  <div className={styles.moneyRow}>
                    <span className={styles.moneyLabel}>Deposit:</span>
                    <span className={styles.moneyValue}>
                      ${(booking.depositAmount / 100).toFixed(2)}
                      {booking.depositAmount === 0 && <span className={styles.freeTag}> FREE</span>}
                    </span>
                  </div>
                  {booking.couponCode && booking.discountAmount && booking.discountAmount > 0 && (
                    <div className={styles.moneyRow}>
                      <span className={styles.moneyLabel}>Coupon ({booking.couponCode}):</span>
                      <span className={`${styles.moneyValue} ${styles.discountAmount}`}>
                        -${(booking.discountAmount / 100).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {booking.status !== 'pending_deposit' && (
                    <div className={styles.moneyRow}>
                      <span className={styles.moneyLabel}>Paid:</span>
                      <span className={`${styles.moneyValue} ${styles.paidAmount}`}>
                        {booking.actualDepositPaid !== undefined && booking.actualDepositPaid !== null ? (
                          <>
                            ${(booking.actualDepositPaid / 100).toFixed(2)}
                            {booking.actualDepositPaid === 0 && <span className={styles.freeTag}> FREE</span>}
                          </>
                        ) : (
                          <span style={{ opacity: 0.6 }}>Pending...</span>
                        )}
                      </span>
                    </div>
                  )}
                  <div className={styles.moneyRow}>
                    <span className={styles.moneyLabel}>Total:</span>
                    <span className={styles.moneyValue}>
                      ${(booking.totalAmount / 100).toFixed(2)}
                      {booking.totalAmount === 0 && <span className={styles.freeTag}> FREE</span>}
                    </span>
                  </div>
                  {booking.remainderAmount > 0 && (
                    <div className={styles.moneyRow}>
                      <span className={styles.moneyLabel}>Due:</span>
                      <span className={`${styles.moneyValue} ${styles.remainderAmount}`}>
                        ${(booking.remainderAmount / 100).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.bookingActions}>
                {getStatusBadge(booking.status)}

                <div className={styles.actionButtons}>
                  {booking.status === 'pending_approval' && (
                    <>
                      <button
                        className={styles.approveButton}
                        onClick={() => handleApproveBooking(booking)}
                        disabled={approvingBookingId === booking.id}
                        title="Approve booking and capture payment"
                      >
                        {approvingBookingId === booking.id ? 'Approving...' : 'Approve'}
                      </button>
                      <button
                        className={styles.rejectButton}
                        onClick={() => handleRejectBooking(booking)}
                        disabled={rejectingBookingId === booking.id}
                        title="Reject booking and release payment hold"
                      >
                        {rejectingBookingId === booking.id ? 'Rejecting...' : 'Reject'}
                      </button>
                    </>
                  )}

                  {booking.status === 'pending_deposit' && (
                    <button
                      className={styles.confirmButton}
                      onClick={() => handleConfirmBooking(booking)}
                      disabled={confirmingBookingId === booking.id}
                      title="Manually confirm this booking (use if webhook failed)"
                    >
                      {confirmingBookingId === booking.id ? 'Confirming...' : 'Confirm'}
                    </button>
                  )}

                  {booking.status === 'confirmed' && (booking.actualDepositPaid === undefined || booking.actualDepositPaid === null) && (
                    <button
                      className={styles.confirmButton}
                      onClick={() => handleConfirmBooking(booking)}
                      disabled={confirmingBookingId === booking.id}
                      title="Fetch payment data from Stripe"
                    >
                      {confirmingBookingId === booking.id ? 'Fetching...' : 'Refresh Payment Data'}
                    </button>
                  )}

                  {booking.status === 'confirmed' && booking.remainderAmount > 0 && (
                    <>
                      {editingRemainderBookingId === booking.id ? (
                        <div className={styles.remainderEditForm}>
                          <span className={styles.dollarSign}>$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={customRemainderAmount}
                            onChange={(e) => setCustomRemainderAmount(e.target.value)}
                            className={styles.remainderInput}
                            placeholder="Amount"
                          />
                          <button
                            onClick={() => handleSaveRemainderAmount(booking)}
                            disabled={chargingBookingId === booking.id}
                            className={styles.chargeButton}
                          >
                            {chargingBookingId === booking.id ? 'Processing...' : 'Charge'}
                          </button>
                          <button
                            onClick={handleCancelRemainderEdit}
                            className={styles.cancelEditButton}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className={styles.chargeButton}
                          onClick={() => handleEditRemainderClick(booking)}
                          disabled={chargingBookingId === booking.id || editingRemainderBookingId !== null}
                        >
                          Charge Remainder
                        </button>
                      )}
                    </>
                  )}

                  <button
                    className={styles.editButton}
                    onClick={() => handleEditClick(booking)}
                    disabled={editingBookingId !== null}
                    title="Edit booking time"
                  >
                    Edit
                  </button>

                  <button
                    className={styles.notifyButton}
                    onClick={() => handleNotifyCustomer(booking)}
                    disabled={notifyingBookingId === booking.id}
                    title="Send reminder email"
                  >
                    {notifyingBookingId === booking.id ? 'Sending...' : 'Notify'}
                  </button>

                  <button
                    className={styles.cancelButton}
                    onClick={() => handleCancelBooking(booking)}
                    disabled={cancellingBookingId === booking.id}
                    title="Cancel booking and refund if future"
                  >
                    {cancellingBookingId === booking.id ? 'Cancelling...' : 'Cancel'}
                  </button>

                  {booking.status !== 'completed' && booking.status !== 'cancelled' && booking.status !== 'deleted' && (
                    <button
                      className={styles.softDeleteButton}
                      onClick={() => handleSoftDelete(booking)}
                      disabled={softDeletingBookingId === booking.id}
                      title="Soft delete (mark as deleted without sending cancellation email)"
                    >
                      {softDeletingBookingId === booking.id ? 'Deleting...' : 'Soft Delete'}
                    </button>
                  )}
                </div>
              </div>

              {/* Admin Debug/Monitoring Panel */}
              <div className={styles.debugPanel}>
                <button
                  className={styles.debugToggle}
                  onClick={() => setExpandedDebugBookingId(expandedDebugBookingId === booking.id ? null : booking.id)}
                >
                  {expandedDebugBookingId === booking.id ? '▼' : '▶'} Debug Info & Flow Events
                </button>

                {expandedDebugBookingId === booking.id && (
                  <div className={styles.debugContent}>
                    <div className={styles.debugSection}>
                      <h4>Booking Flow Timeline</h4>
                      <div className={styles.timeline}>
                        {booking.createdAt && (
                          <div className={styles.timelineItem}>
                            <span className={styles.timelineIcon}>✓</span>
                            <div>
                              <strong>Created:</strong> {new Date(booking.createdAt).toLocaleString()}
                            </div>
                          </div>
                        )}
                        {booking.approvedAt && (
                          <div className={styles.timelineItem}>
                            <span className={styles.timelineIcon}>✓</span>
                            <div>
                              <strong>Approved & Captured:</strong> {new Date(booking.approvedAt).toLocaleString()}
                            </div>
                          </div>
                        )}
                        {booking.rejectedAt && (
                          <div className={styles.timelineItem}>
                            <span className={styles.timelineIcon}>✗</span>
                            <div>
                              <strong>Rejected:</strong> {new Date(booking.rejectedAt).toLocaleString()}
                              {booking.rejectedReason && (
                                <div style={{ marginTop: '0.25rem', opacity: 0.8 }}>
                                  Reason: {booking.rejectedReason}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {booking.deletedAt && (
                          <div className={styles.timelineItem}>
                            <span className={styles.timelineIcon}>🗑</span>
                            <div>
                              <strong>Soft Deleted:</strong> {new Date(booking.deletedAt).toLocaleString()}
                            </div>
                          </div>
                        )}
                        {booking.cancellationEmailSentAt && (
                          <div className={styles.timelineItem}>
                            <span className={styles.timelineIcon}>📧</span>
                            <div>
                              <strong>Cancellation Email Sent:</strong> {new Date(booking.cancellationEmailSentAt).toLocaleString()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.debugSection}>
                      <h4>Fee Breakdown</h4>
                      <div className={styles.debugGrid}>
                        <div className={styles.debugItem}>
                          <span className={styles.debugLabel}>Base Total:</span>
                          <span>${(booking.totalAmount / 100).toFixed(2)}</span>
                        </div>
                        {booking.afterHoursFeeAmount !== undefined && booking.afterHoursFeeAmount > 0 && (
                          <div className={styles.debugItem}>
                            <span className={styles.debugLabel}>After-Hours Fee:</span>
                            <span className={styles.warningText}>${(booking.afterHoursFeeAmount / 100).toFixed(2)}</span>
                          </div>
                        )}
                        {booking.sameDayFeeAmount !== undefined && booking.sameDayFeeAmount > 0 && (
                          <div className={styles.debugItem}>
                            <span className={styles.debugLabel}>Same-Day Fee:</span>
                            <span className={styles.warningText}>${(booking.sameDayFeeAmount / 100).toFixed(2)}</span>
                          </div>
                        )}
                        {booking.discountAmount !== undefined && booking.discountAmount > 0 && (
                          <div className={styles.debugItem}>
                            <span className={styles.debugLabel}>Discount Applied:</span>
                            <span className={styles.successText}>-${(booking.discountAmount / 100).toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.debugSection}>
                      <h4>Payment Information</h4>
                      <div className={styles.debugGrid}>
                        <div className={styles.debugItem}>
                          <span className={styles.debugLabel}>Stripe Customer ID:</span>
                          <code className={styles.debugCode}>{booking.stripeCustomerId || 'N/A'}</code>
                        </div>
                        <div className={styles.debugItem}>
                          <span className={styles.debugLabel}>Payment Intent ID:</span>
                          <code className={styles.debugCode}>{booking.stripePaymentIntentId || 'N/A'}</code>
                        </div>
                        <div className={styles.debugItem}>
                          <span className={styles.debugLabel}>Deposit Expected:</span>
                          <span>${(booking.depositAmount / 100).toFixed(2)}</span>
                        </div>
                        <div className={styles.debugItem}>
                          <span className={styles.debugLabel}>Deposit Actually Paid:</span>
                          <span className={booking.actualDepositPaid !== booking.depositAmount ? styles.warningText : styles.successText}>
                            ${booking.actualDepositPaid !== undefined && booking.actualDepositPaid !== null ? (booking.actualDepositPaid / 100).toFixed(2) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {booking.adminNotes && (
                      <div className={styles.debugSection}>
                        <h4>Admin Notes</h4>
                        <div className={styles.adminNotesBox}>
                          {booking.adminNotes}
                        </div>
                      </div>
                    )}

                    <div className={styles.debugSection}>
                      <h4>Contact Information</h4>
                      <div className={styles.debugGrid}>
                        <div className={styles.debugItem}>
                          <span className={styles.debugLabel}>Email:</span>
                          <a href={`mailto:${booking.customerEmail}`}>{booking.customerEmail}</a>
                        </div>
                        <div className={styles.debugItem}>
                          <span className={styles.debugLabel}>Phone:</span>
                          <a href={`tel:${booking.customerPhone}`}>{booking.customerPhone}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
                ))}
              </div>
            </>
          )}

          {confirmedBookings.length > 0 && (
            <>
              <h2 className={styles.sectionTitle}>Confirmed (Deposit Paid)</h2>
              <div className={styles.bookingsList}>
                {confirmedBookings.map((booking) => (
            <div key={booking.id} className={styles.bookingRow}>
              <div className={styles.bookingInfo}>
                <div className={styles.profilePhoto}>
                  {getInitials(booking.firstName, booking.lastName)}
                </div>
                <div className={styles.bookingText}>
                  <div className={styles.bookingName}>
                    {booking.firstName} {booking.lastName}
                  </div>
                  <div className={styles.bookingArtist}>{booking.artistName}</div>

                  {editingBookingId === booking.id ? (
                    <div className={styles.editForm}>
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className={styles.editInput}
                      />
                      <input
                        type="time"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        className={styles.editInput}
                      />
                      <button
                        onClick={() => handleSaveEdit(booking.id)}
                        disabled={savingEdit}
                        className={styles.saveEditButton}
                      >
                        {savingEdit ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className={styles.cancelEditButton}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className={styles.bookingDateTime}>
                      📅 {formatDate(booking.date, booking.startTime)} • ⏱️ {booking.duration}h
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.bookingDetails}>
                <div className={styles.bookingMoney}>
                  {booking.sameDayFee && booking.sameDayFeeAmount !== undefined && booking.sameDayFeeAmount > 0 && (
                    <div className={styles.moneyRow}>
                      <span className={styles.moneyLabel}>Same-Day Fee:</span>
                      <span className={styles.moneyValue}>
                        ${(booking.sameDayFeeAmount / 100).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {booking.afterHoursFee && booking.afterHoursFeeAmount !== undefined && booking.afterHoursFeeAmount > 0 && (
                    <div className={styles.moneyRow}>
                      <span className={styles.moneyLabel}>After-Hours Fee:</span>
                      <span className={styles.moneyValue}>
                        ${(booking.afterHoursFeeAmount / 100).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className={styles.moneyRow}>
                    <span className={styles.moneyLabel}>Deposit:</span>
                    <span className={styles.moneyValue}>
                      ${(booking.depositAmount / 100).toFixed(2)}
                      {booking.depositAmount === 0 && <span className={styles.freeTag}> FREE</span>}
                    </span>
                  </div>
                  {booking.couponCode && booking.discountAmount && booking.discountAmount > 0 && (
                    <div className={styles.moneyRow}>
                      <span className={styles.moneyLabel}>Coupon ({booking.couponCode}):</span>
                      <span className={`${styles.moneyValue} ${styles.discountAmount}`}>
                        -${(booking.discountAmount / 100).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {booking.status !== 'pending_deposit' && (
                    <div className={styles.moneyRow}>
                      <span className={styles.moneyLabel}>Paid:</span>
                      <span className={`${styles.moneyValue} ${styles.paidAmount}`}>
                        {booking.actualDepositPaid !== undefined && booking.actualDepositPaid !== null ? (
                          <>
                            ${(booking.actualDepositPaid / 100).toFixed(2)}
                            {booking.actualDepositPaid === 0 && <span className={styles.freeTag}> FREE</span>}
                          </>
                        ) : (
                          <span style={{ opacity: 0.6 }}>Pending...</span>
                        )}
                      </span>
                    </div>
                  )}
                  <div className={styles.moneyRow}>
                    <span className={styles.moneyLabel}>Total:</span>
                    <span className={styles.moneyValue}>
                      ${(booking.totalAmount / 100).toFixed(2)}
                      {booking.totalAmount === 0 && <span className={styles.freeTag}> FREE</span>}
                    </span>
                  </div>
                  {booking.remainderAmount > 0 && (
                    <div className={styles.moneyRow}>
                      <span className={styles.moneyLabel}>Due:</span>
                      <span className={`${styles.moneyValue} ${styles.dueAmount}`}>
                        ${(booking.remainderAmount / 100).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.bookingActions}>
                  {getStatusBadge(booking.status)}

                  {booking.status === 'confirmed' && booking.remainderAmount > 0 && (
                    <>
                      {editingRemainderBookingId === booking.id ? (
                        <div className={styles.remainderEditForm}>
                          <span className={styles.dollarSign}>$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={customRemainderAmount}
                            onChange={(e) => setCustomRemainderAmount(e.target.value)}
                            className={styles.remainderInput}
                            placeholder="Amount"
                          />
                          <button
                            onClick={() => handleSaveRemainderAmount(booking)}
                            disabled={chargingBookingId === booking.id}
                            className={styles.chargeButton}
                          >
                            {chargingBookingId === booking.id ? 'Processing...' : 'Charge'}
                          </button>
                          <button
                            onClick={handleCancelRemainderEdit}
                            className={styles.cancelEditButton}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className={styles.chargeButton}
                          onClick={() => handleEditRemainderClick(booking)}
                          disabled={chargingBookingId === booking.id || editingRemainderBookingId !== null}
                        >
                          Charge Remainder
                        </button>
                      )}
                    </>
                  )}

                  <button
                    className={styles.editButton}
                    onClick={() => handleEditClick(booking)}
                    disabled={editingBookingId !== null}
                    title="Edit booking time"
                  >
                    Edit
                  </button>

                  <button
                    className={styles.notifyButton}
                    onClick={() => alert('Notify feature coming soon')}
                    title="Send notification to customer"
                  >
                    Notify
                  </button>

                  <button
                    className={styles.cancelButton}
                    onClick={() => handleCancelBooking(booking)}
                    disabled={cancellingBookingId === booking.id}
                    title="Cancel booking and send cancellation email"
                  >
                    {cancellingBookingId === booking.id ? 'Cancelling...' : 'Cancel'}
                  </button>

                  <button
                    className={styles.softDeleteButton}
                    onClick={() => handleSoftDelete(booking)}
                    disabled={softDeletingBookingId === booking.id}
                    title="Soft delete (no email sent)"
                  >
                    {softDeletingBookingId === booking.id ? 'Deleting...' : 'Soft Delete'}
                  </button>
                </div>
              </div>

              {showDebugInfo[booking.id] && (
                <div className={styles.debugPanel}>
                  <div className={styles.debugHeader}>
                    <h4>Debug Info & Flow Events</h4>
                  </div>
                  <div className={styles.debugContent}>
                    <div className={styles.debugSection}>
                      <h5>Booking Flow Timeline</h5>
                      <div className={styles.timeline}>
                        <div className={styles.timelineItem}>
                          <span className={styles.timelineIcon}>✓</span>
                          <span className={styles.timelineText}>
                            Created: {new Date(booking.createdAt!).toLocaleString()}
                          </span>
                        </div>
                        {booking.approvedAt && (
                          <div className={styles.timelineItem}>
                            <span className={styles.timelineIcon}>✓</span>
                            <span className={styles.timelineText}>
                              Approved & Captured: {new Date(booking.approvedAt).toLocaleString()}
                            </span>
                          </div>
                        )}
                        {booking.rejectedAt && (
                          <div className={styles.timelineItem}>
                            <span className={styles.timelineIcon}>✗</span>
                            <span className={styles.timelineText}>
                              Rejected: {new Date(booking.rejectedAt).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.debugSection}>
                      <h5>Fee Breakdown</h5>
                      <div className={styles.debugItem}>
                        <span className={styles.debugLabel}>Base Total:</span>
                        <span>${(booking.totalAmount / 100).toFixed(2)}</span>
                      </div>
                      {booking.sameDayFeeAmount !== undefined && booking.sameDayFeeAmount > 0 && (
                        <div className={styles.debugItem}>
                          <span className={styles.debugLabel}>Same-Day Fee:</span>
                          <span className={styles.warningText}>+${(booking.sameDayFeeAmount / 100).toFixed(2)}</span>
                        </div>
                      )}
                      {booking.afterHoursFeeAmount !== undefined && booking.afterHoursFeeAmount > 0 && (
                        <div className={styles.debugItem}>
                          <span className={styles.debugLabel}>After-Hours Fee:</span>
                          <span className={styles.warningText}>+${(booking.afterHoursFeeAmount / 100).toFixed(2)}</span>
                        </div>
                      )}
                      {booking.discountAmount !== undefined && booking.discountAmount > 0 && (
                        <div className={styles.debugItem}>
                          <span className={styles.debugLabel}>Discount Applied:</span>
                          <span className={styles.successText}>-${(booking.discountAmount / 100).toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.debugSection}>
                      <h5>Payment Information</h5>
                      <div className={styles.debugItem}>
                        <span className={styles.debugLabel}>Stripe Customer ID:</span>
                        <span className={styles.debugValue}>{booking.stripeCustomerId || 'N/A'}</span>
                      </div>
                      <div className={styles.debugItem}>
                        <span className={styles.debugLabel}>Payment Intent ID:</span>
                        <span className={styles.debugValue}>{booking.stripePaymentIntentId || 'N/A'}</span>
                      </div>
                      <div className={styles.debugItem}>
                        <span className={styles.debugLabel}>Deposit Expected:</span>
                        <span>${(booking.depositAmount / 100).toFixed(2)}</span>
                      </div>
                      <div className={styles.debugItem}>
                        <span className={styles.debugLabel}>Deposit Actually Paid:</span>
                        <span className={booking.actualDepositPaid !== booking.depositAmount ? styles.warningText : styles.successText}>
                          ${booking.actualDepositPaid !== undefined && booking.actualDepositPaid !== null ? (booking.actualDepositPaid / 100).toFixed(2) : 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className={styles.debugSection}>
                      <h5>Contact Information</h5>
                      <div className={styles.debugItem}>
                        <span className={styles.debugLabel}>Email:</span>
                        <span className={styles.debugValue}>{booking.customerEmail}</span>
                      </div>
                      <div className={styles.debugItem}>
                        <span className={styles.debugLabel}>Phone:</span>
                        <span className={styles.debugValue}>{booking.customerPhone || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                className={styles.debugToggle}
                onClick={() => setShowDebugInfo(prev => ({
                  ...prev,
                  [booking.id]: !prev[booking.id]
                }))}
              >
                {showDebugInfo[booking.id] ? '▲ Hide' : '▼ Debug Info'}
              </button>
            </div>
                ))}
              </div>
            </>
          )}

          {showCompleted && completedBookings.length > 0 && (
            <>
              <h2 className={styles.sectionTitle}>Completed Bookings</h2>
              <div className={styles.bookingsList}>
                {completedBookings.map((booking) => (
                  <div key={booking.id} className={`${styles.bookingRow} ${styles.completedRow}`}>
                    <div className={styles.bookingInfo}>
                      <div className={styles.profilePhoto}>
                        {getInitials(booking.firstName, booking.lastName)}
                      </div>
                      <div className={styles.bookingText}>
                        <div className={styles.bookingName}>
                          {booking.firstName} {booking.lastName}
                        </div>
                        <div className={styles.bookingArtist}>{booking.artistName}</div>
                        <div className={styles.bookingDateTime}>
                          📅 {formatDate(booking.date, booking.startTime)} • ⏱️ {booking.duration}h
                        </div>
                      </div>
                    </div>
                    <div className={styles.bookingDetails}>
                      <div className={styles.bookingMoney}>
                        {booking.couponCode && (
                          <div className={styles.moneyRow}>
                            <span className={styles.moneyLabel}>Coupon:</span>
                            <span className={styles.couponValue}>
                              {booking.couponCode}
                              {booking.discountAmount && booking.discountAmount > 0 && (
                                <> (-${(booking.discountAmount / 100).toFixed(2)})</>
                              )}
                            </span>
                          </div>
                        )}
                        <div className={styles.moneyRow}>
                          <span className={styles.moneyLabel}>Total Paid:</span>
                          <span className={styles.moneyValue}>
                            ${(booking.totalAmount / 100).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.bookingActions}>
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
