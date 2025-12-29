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
  status: 'pending_payment' | 'pending_approval' | 'pending_deposit' | 'approved' | 'confirmed' | 'completed' | 'cancelled' | 'rejected' | 'deleted';
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
  const [refreshingPaymentId, setRefreshingPaymentId] = useState<string | null>(null);
  const [refreshingAll, setRefreshingAll] = useState(false);
  const [investigatingBookingId, setInvestigatingBookingId] = useState<string | null>(null);
  const [viewingProfileEmail, setViewingProfileEmail] = useState<string | null>(null);

  // Create Session Modal States
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [clients, setClients] = useState<Array<{id: string; email: string; firstName: string; lastName: string}>>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [clientSearch, setClientSearch] = useState('');
  const [newSessionDate, setNewSessionDate] = useState('');
  const [newSessionTime, setNewSessionTime] = useState('11');
  const [newSessionDuration, setNewSessionDuration] = useState('1');
  const [newSessionNotes, setNewSessionNotes] = useState('');
  const [creatingSession, setCreatingSession] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);

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

  // Fetch clients for the Create Session modal
  const fetchClients = async () => {
    setLoadingClients(true);
    try {
      const response = await fetch('/api/admin/library/clients');
      const data = await response.json();
      if (data.success && data.clients) {
        setClients(data.clients);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      alert('Failed to load clients');
    } finally {
      setLoadingClients(false);
    }
  };

  const handleOpenCreateSession = () => {
    setShowCreateSession(true);
    if (clients.length === 0) {
      fetchClients();
    }
    // Set default date to today
    const today = new Date();
    setNewSessionDate(today.toISOString().split('T')[0]);
  };

  const handleCloseCreateSession = () => {
    setShowCreateSession(false);
    setSelectedClient('');
    setClientSearch('');
    setNewSessionDate('');
    setNewSessionTime('11');
    setNewSessionDuration('1');
    setNewSessionNotes('');
  };

  // Filter clients based on search
  const filteredClients = clients.filter(client => {
    if (!clientSearch.trim()) return true;
    const search = clientSearch.toLowerCase();
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    return fullName.includes(search) || client.email.toLowerCase().includes(search);
  });

  const handleCreateSession = async () => {
    if (!selectedClient) {
      alert('Please select a client');
      return;
    }
    if (!newSessionDate) {
      alert('Please select a date');
      return;
    }

    const client = clients.find(c => c.id === selectedClient);
    if (!client) {
      alert('Client not found');
      return;
    }

    setCreatingSession(true);

    try {
      const response = await fetch('/api/admin/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedClient,
          email: client.email,
          firstName: client.firstName,
          lastName: client.lastName,
          date: newSessionDate,
          startTime: parseInt(newSessionTime),
          duration: parseInt(newSessionDuration),
          notes: newSessionNotes
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Session created successfully for ${client.firstName} ${client.lastName}!`);
        handleCloseCreateSession();
        await fetchBookings();
      } else {
        alert('Error creating session: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session');
    } finally {
      setCreatingSession(false);
    }
  };

  const handleConfirmBooking = async (booking: Booking) => {
    if (!confirm(`Manually confirm this booking for ${booking.firstName} ${booking.lastName}? If payment is authorized but uncaptured, this will attempt to CAPTURE it.`)) {
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

    // Build detailed confirmation message
    let message = `CHARGE REMAINDER for ${booking.firstName} ${booking.lastName}?\n\n`;
    message += `PAYMENT BREAKDOWN:\n`;

    // Calculate base remainder (total - deposit - discount - same-day fee)
    const baseTotal = booking.totalAmount;
    const depositPaid = booking.actualDepositPaid || booking.depositAmount;
    const baseRemainder = baseTotal - depositPaid;

    message += `• Session Total: $${(baseTotal / 100).toFixed(2)}\n`;
    message += `• Deposit Already Paid: -$${(depositPaid / 100).toFixed(2)}\n`;

    // Show after-hours fee if applicable
    if (booking.afterHoursFee && booking.afterHoursFeeAmount && booking.afterHoursFeeAmount > 0) {
      message += `• After-Hours Fee: $${(booking.afterHoursFeeAmount / 100).toFixed(2)}\n`;
    }

    message += `• TOTAL TO CHARGE: $${amountInDollars}\n\n`;

    if (customAmount) {
      message += `⚠️ CUSTOM AMOUNT (modified by admin)\n\n`;
    }

    message += `This will charge the customer's saved card and mark session as COMPLETED.`;

    if (!confirm(message)) {
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
    // Calculate EXACT amount that will be captured by Stripe
    // Formula: (Base Deposit + Same-Day Fee) - Coupon Discount = Actual Charge
    const baseDeposit = booking.depositAmount;
    const sameDayFee = booking.sameDayFeeAmount || 0;
    const discount = booking.discountAmount || 0;
    const actualAmountToCapture = (baseDeposit + sameDayFee) - discount;

    // Build detailed confirmation message
    let message = `APPROVE booking for ${booking.firstName} ${booking.lastName}?\n\n`;
    message += `PAYMENT BREAKDOWN:\n`;
    message += `• Base Deposit: $${(baseDeposit / 100).toFixed(2)}\n`;
    if (sameDayFee > 0) {
      message += `• Same-Day Fee: $${(sameDayFee / 100).toFixed(2)}\n`;
    }
    if (discount > 0) {
      message += `• Discount (${booking.couponCode}): -$${(discount / 100).toFixed(2)}\n`;
    }
    message += `• TOTAL TO CAPTURE: $${(actualAmountToCapture / 100).toFixed(2)}\n\n`;
    message += `This will capture the payment and send confirmation email to customer.`;

    if (!confirm(message)) {
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

  const handleRefreshPaymentData = async (booking: Booking) => {
    const message = `REFRESH payment data for ${booking.firstName} ${booking.lastName}?\n\nThis will:\n- Query Stripe for the actual payment status\n- Update payment intent ID if missing\n- Update amount captured\n\nUse this if payment shows incorrectly after manual actions in Stripe Dashboard.`;

    if (!confirm(message)) return;

    setRefreshingPaymentId(booking.id);

    try {
      const response = await fetch('/api/admin/refresh-payment-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Payment data refreshed successfully!\n\nPayment Intent ID: ${data.data.payment_intent_id || 'None ($0 booking)'}\nAmount Captured: $${(data.data.amount_captured / 100).toFixed(2)}`);
        await fetchBookings();
      } else {
        alert('Error refreshing payment data: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to refresh payment data');
    } finally {
      setRefreshingPaymentId(null);
    }
  };

  const handleRefreshAllPaymentData = async () => {
    const confirmedAndCompletedBookings = bookings.filter(b =>
      b.status === 'confirmed' || b.status === 'completed'
    );

    if (confirmedAndCompletedBookings.length === 0) {
      alert('No confirmed or completed bookings to refresh.');
      return;
    }

    const message = `Refresh payment data for ALL ${confirmedAndCompletedBookings.length} confirmed/completed bookings?\n\nThis will query Stripe for each booking and update:\n- Payment Intent IDs\n- Actual amounts captured\n\nUse this to sync all payment data after manual actions in Stripe Dashboard.`;

    if (!confirm(message)) return;

    setRefreshingAll(true);

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const booking of confirmedAndCompletedBookings) {
      try {
        const response = await fetch('/api/admin/refresh-payment-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId: booking.id })
        });

        const data = await response.json();

        if (data.success) {
          successCount++;
          console.log(`✅ Refreshed: ${booking.firstName} ${booking.lastName}`);
        } else {
          errorCount++;
          errors.push(`${booking.firstName} ${booking.lastName}: ${data.error || 'Unknown error'}`);
        }
      } catch (error) {
        errorCount++;
        errors.push(`${booking.firstName} ${booking.lastName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    setRefreshingAll(false);

    // Refresh the bookings list to show updated data
    await fetchBookings();

    let summaryMessage = `Refresh Complete!\n\n✅ Success: ${successCount}\n❌ Errors: ${errorCount}`;
    if (errors.length > 0) {
      summaryMessage += `\n\nError Details:\n${errors.join('\n')}`;
    }

    alert(summaryMessage);
  };

  const handleInvestigateBooking = async (booking: Booking) => {
    setInvestigatingBookingId(booking.id);

    try {
      const response = await fetch('/api/admin/investigate-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id })
      });

      const data = await response.json();

      if (data.success) {
        const inv = data.investigation;

        let message = `🔍 BOOKING INVESTIGATION\n\n`;
        message += `Status: ${inv.status}\n`;
        message += `Session ID: ${inv.stripe_session_id || 'N/A'}\n`;
        message += `Payment Intent ID: ${inv.stripe_payment_intent_id || 'N/A'}\n\n`;

        if (inv.stripe_session_data) {
          message += `📊 STRIPE SESSION:\n`;
          message += `  Status: ${inv.stripe_session_data.status}\n`;
          message += `  Payment Status: ${inv.stripe_session_data.payment_status}\n`;
          message += `  Amount Total: $${(inv.stripe_session_data.amount_total / 100).toFixed(2)}\n`;
          message += `  Payment Intent: ${inv.stripe_session_data.payment_intent_id || 'NONE'}\n\n`;
        }

        if (inv.payment_intent_data) {
          message += `💳 PAYMENT INTENT:\n`;
          message += `  Status: ${inv.payment_intent_data.status}\n`;
          message += `  Amount: $${(inv.payment_intent_data.amount / 100).toFixed(2)}\n`;
          message += `  Capturable: $${(inv.payment_intent_data.amount_capturable / 100).toFixed(2)}\n`;
          message += `  Received: $${(inv.payment_intent_data.amount_received / 100).toFixed(2)}\n\n`;
        }

        if (inv.webhook_failures && inv.webhook_failures.length > 0) {
          message += `⚠️ WEBHOOK FAILURES (${inv.webhook_failures.length}):\n`;
          inv.webhook_failures.forEach((f: any, i: number) => {
            message += `  ${i + 1}. ${f.webhook_type}: ${f.error_message}\n`;
          });
        }

        console.log('Investigation results:', inv);
        alert(message);
      } else {
        alert('Error investigating booking: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to investigate booking');
    } finally {
      setInvestigatingBookingId(null);
    }
  };

  const handleViewProfile = async (email: string) => {
    setViewingProfileEmail(email);

    try {
      const response = await fetch('/api/admin/get-user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        const profile = data.profile;

        let message = `👤 USER PROFILE\n\n`;
        message += `Name: ${profile.displayName}\n`;
        message += `Email: ${profile.email}\n`;
        message += `User ID: ${profile.userId}\n\n`;

        message += `📊 ACCOUNT INFO:\n`;
        message += `Created: ${new Date(profile.createdAt).toLocaleDateString()}\n`;
        if (profile.lastSignInAt) {
          message += `Last Sign In: ${new Date(profile.lastSignInAt).toLocaleDateString()}\n`;
        }
        if (profile.emailConfirmedAt) {
          message += `Email Confirmed: ${new Date(profile.emailConfirmedAt).toLocaleDateString()}\n`;
        } else {
          message += `Email Confirmed: ❌ NOT CONFIRMED\n`;
        }
        message += `\n`;

        message += `📁 LIBRARY:\n`;
        message += `Bookings: ${profile.bookingsCount}\n`;
        message += `Files: ${profile.filesCount}\n`;
        message += `Notes: ${profile.notesCount}\n\n`;

        if (profile.bookings && profile.bookings.length > 0) {
          message += `📅 BOOKING HISTORY (${profile.bookings.length}):\n`;
          profile.bookings.slice(0, 5).forEach((booking: any, i: number) => {
            const date = new Date(booking.start_time || booking.created_at);
            message += `  ${i + 1}. ${booking.status} - ${booking.artist_name || 'N/A'} - ${date.toLocaleDateString()}\n`;
          });
          if (profile.bookings.length > 5) {
            message += `  ... and ${profile.bookings.length - 5} more\n`;
          }
        }

        console.log('User profile:', profile);
        alert(message);
      } else {
        alert('Error fetching profile: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch user profile');
    } finally {
      setViewingProfileEmail(null);
    }
  };

  const handleNotifyCustomer = async (booking: Booking) => {
    const message = `Send reminder email to ${booking.firstName} ${booking.lastName}?\n\nThis will send a booking reminder email to ${booking.customerEmail}.`;

    if (!confirm(message)) return;

    setNotifyingBookingId(booking.id);

    try {
      const response = await fetch('/api/admin/notify-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id })
      });

      const data = await response.json();

      if (data.success) {
        alert('Reminder email sent successfully!');
      } else {
        alert('Error sending email: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send notification');
    } finally {
      setNotifyingBookingId(null);
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
      pending_payment: { label: 'Pending Payment', color: '#ffb74d' },  // Light Orange
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

  // Separate bookings into ALL categories - admin needs to see everything
  const pendingPaymentBookings = bookings.filter(b => b.status === 'pending_payment');
  const pendingApprovalBookings = bookings.filter(b => b.status === 'pending_approval' || b.status === 'pending_deposit');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'approved');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');
  const rejectedBookings = bookings.filter(b => b.status === 'rejected');
  const deletedBookings = bookings.filter(b => b.status === 'deleted');

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

        <div className={styles.filterControls}>
          <button
            className={styles.createSessionButton}
            onClick={handleOpenCreateSession}
            title="Create a new session for a client"
          >
            + Create Session
          </button>

          <button
            className={styles.refreshAllButton}
            onClick={handleRefreshAllPaymentData}
            disabled={refreshingAll || bookings.length === 0}
            title="Refresh payment data from Stripe for all confirmed/completed bookings"
          >
            {refreshingAll ? 'Refreshing All...' : 'Refresh All Payment Data'}
          </button>

          {completedBookings.length > 0 && (
            <button
              className={styles.toggleButton}
              onClick={() => setShowCompleted(!showCompleted)}
            >
              {showCompleted ? 'Hide' : 'Show'} Completed ({completedBookings.length})
            </button>
          )}
        </div>
      </div>

      {/* Create Session Modal */}
      {showCreateSession && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Create New Session</h2>
              <button onClick={handleCloseCreateSession} className={styles.modalClose}>×</button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Search & Select Client</label>
                {loadingClients ? (
                  <p>Loading clients...</p>
                ) : (
                  <>
                    <input
                      type="text"
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      placeholder="Type to search by name or email..."
                      className={styles.editInput}
                    />
                    <select
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                      className={styles.clientSelect}
                    >
                      <option value="">-- Select a client ({filteredClients.length} found) --</option>
                      {filteredClients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.firstName} {client.lastName} ({client.email})
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Date</label>
                <input
                  type="date"
                  value={newSessionDate}
                  onChange={(e) => setNewSessionDate(e.target.value)}
                  className={styles.editInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Start Time</label>
                <select
                  value={newSessionTime}
                  onChange={(e) => setNewSessionTime(e.target.value)}
                  className={styles.select}
                >
                  {Array.from({ length: 17 }, (_, i) => i + 9).map(hour => (
                    <option key={hour} value={hour}>
                      {hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Duration (hours)</label>
                <select
                  value={newSessionDuration}
                  onChange={(e) => setNewSessionDuration(e.target.value)}
                  className={styles.select}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(hours => (
                    <option key={hours} value={hours}>{hours} hour{hours > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Admin Notes (optional)</label>
                <input
                  type="text"
                  value={newSessionNotes}
                  onChange={(e) => setNewSessionNotes(e.target.value)}
                  placeholder="e.g., Rescheduled from Dec 20"
                  className={styles.editInput}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={handleCloseCreateSession} className={styles.cancelEditButton}>
                Cancel
              </button>
              <button
                onClick={handleCreateSession}
                disabled={creatingSession || !selectedClient || !newSessionDate}
                className={styles.approveButton}
              >
                {creatingSession ? 'Creating...' : 'Create Session'}
              </button>
            </div>
          </div>
        </div>
      )}

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
                          <button
                            className={styles.viewProfileButton}
                            onClick={() => handleViewProfile(booking.customerEmail)}
                            disabled={viewingProfileEmail === booking.customerEmail}
                            title="View full user profile"
                          >
                            {viewingProfileEmail === booking.customerEmail ? '...' : '👤'}
                          </button>
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
                                  {booking.actualDepositPaid === 0 && booking.depositAmount === 0 && <span className={styles.freeTag}> FREE</span>}
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
                              {approvingBookingId === booking.id ? 'Approving...' : 'Approve & Capture Payment'}
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
                      <div className={styles.debugHeader}>
                        <button
                          className={styles.debugToggle}
                          onClick={() => setExpandedDebugBookingId(expandedDebugBookingId === booking.id ? null : booking.id)}
                        >
                          {expandedDebugBookingId === booking.id ? '▼' : '▶'} Debug Info & Flow Events
                        </button>
                        {expandedDebugBookingId === booking.id && (
                          <button
                            className={styles.investigateButton}
                            onClick={() => handleInvestigateBooking(booking)}
                            disabled={investigatingBookingId === booking.id}
                            title="Query Stripe for detailed payment information"
                          >
                            {investigatingBookingId === booking.id ? 'Investigating...' : '🔍 Investigate Payment'}
                          </button>
                        )}
                      </div>

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
                          <button
                            className={styles.viewProfileButton}
                            onClick={() => handleViewProfile(booking.customerEmail)}
                            disabled={viewingProfileEmail === booking.customerEmail}
                            title="View full user profile"
                          >
                            {viewingProfileEmail === booking.customerEmail ? '...' : '👤'}
                          </button>
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
                                  {booking.actualDepositPaid === 0 && booking.depositAmount === 0 && <span className={styles.freeTag}> FREE</span>}
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

                        <div className={styles.actionButtons}>
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
                            title="Send reminder email to customer"
                          >
                            {notifyingBookingId === booking.id ? 'Sending...' : 'Notify'}
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
                    </div>

                    {showDebugInfo[booking.id] && (
                      <div className={styles.debugPanel}>
                        <div className={styles.debugHeader}>
                          <h4>Debug Info & Flow Events</h4>
                          <button
                            className={styles.investigateButton}
                            onClick={() => handleInvestigateBooking(booking)}
                            disabled={investigatingBookingId === booking.id}
                            title="Query Stripe for detailed payment information"
                          >
                            {investigatingBookingId === booking.id ? 'Investigating...' : '🔍 Investigate Payment'}
                          </button>
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
                          <button
                            className={styles.viewProfileButton}
                            onClick={() => handleViewProfile(booking.customerEmail)}
                            disabled={viewingProfileEmail === booking.customerEmail}
                            title="View full user profile"
                          >
                            {viewingProfileEmail === booking.customerEmail ? '...' : '👤'}
                          </button>
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

          {/* PENDING PAYMENT - Customer started booking but didn't complete checkout */}
          {pendingPaymentBookings.length > 0 && (
            <>
              <h2 className={styles.sectionTitle}>⏳ Abandoned Bookings (No Payment)</h2>
              <div className={styles.bookingsList}>
                {pendingPaymentBookings.map((booking) => (
                  <div key={booking.id} className={`${styles.bookingRow} ${styles.abandonedRow}`}>
                    <div className={styles.bookingInfo}>
                      <div className={styles.profilePhoto}>
                        {getInitials(booking.firstName, booking.lastName)}
                      </div>
                      <div className={styles.bookingText}>
                        <div className={styles.bookingName}>
                          {booking.firstName} {booking.lastName}
                          <button
                            className={styles.viewProfileButton}
                            onClick={() => handleViewProfile(booking.customerEmail)}
                            disabled={viewingProfileEmail === booking.customerEmail}
                            title="View full user profile"
                          >
                            {viewingProfileEmail === booking.customerEmail ? '...' : '👤'}
                          </button>
                        </div>
                        <div className={styles.bookingArtist}>{booking.artistName}</div>
                        <div className={styles.bookingDateTime}>
                          📅 {formatDate(booking.date, booking.startTime)} • ⏱️ {booking.duration}h
                        </div>
                        <div className={styles.bookingEmail}>{booking.customerEmail}</div>
                      </div>
                    </div>
                    <div className={styles.bookingDetails}>
                      <div className={styles.bookingMoney}>
                        <div className={styles.moneyRow}>
                          <span className={styles.moneyLabel}>Expected Deposit:</span>
                          <span className={styles.moneyValue}>${(booking.depositAmount / 100).toFixed(2)}</span>
                        </div>
                        <div className={styles.warningText}>⚠️ Never completed Stripe checkout</div>
                      </div>
                    </div>
                    <div className={styles.bookingActions}>
                      {getStatusBadge(booking.status)}
                      <button
                        className={styles.softDeleteButton}
                        onClick={() => handleSoftDelete(booking)}
                        title="Remove from list"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* CANCELLED BOOKINGS */}
          {cancelledBookings.length > 0 && (
            <>
              <h2 className={styles.sectionTitle}>❌ Cancelled Bookings</h2>
              <div className={styles.bookingsList}>
                {cancelledBookings.map((booking) => (
                  <div key={booking.id} className={`${styles.bookingRow} ${styles.cancelledRow}`}>
                    <div className={styles.bookingInfo}>
                      <div className={styles.profilePhoto}>
                        {getInitials(booking.firstName, booking.lastName)}
                      </div>
                      <div className={styles.bookingText}>
                        <div className={styles.bookingName}>
                          {booking.firstName} {booking.lastName}
                          <button
                            className={styles.viewProfileButton}
                            onClick={() => handleViewProfile(booking.customerEmail)}
                            disabled={viewingProfileEmail === booking.customerEmail}
                            title="View full user profile"
                          >
                            {viewingProfileEmail === booking.customerEmail ? '...' : '👤'}
                          </button>
                        </div>
                        <div className={styles.bookingArtist}>{booking.artistName}</div>
                        <div className={styles.bookingDateTime}>
                          📅 {formatDate(booking.date, booking.startTime)} • ⏱️ {booking.duration}h
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

          {/* REJECTED BOOKINGS */}
          {rejectedBookings.length > 0 && (
            <>
              <h2 className={styles.sectionTitle}>🚫 Rejected Bookings</h2>
              <div className={styles.bookingsList}>
                {rejectedBookings.map((booking) => (
                  <div key={booking.id} className={`${styles.bookingRow} ${styles.rejectedRow}`}>
                    <div className={styles.bookingInfo}>
                      <div className={styles.profilePhoto}>
                        {getInitials(booking.firstName, booking.lastName)}
                      </div>
                      <div className={styles.bookingText}>
                        <div className={styles.bookingName}>
                          {booking.firstName} {booking.lastName}
                          <button
                            className={styles.viewProfileButton}
                            onClick={() => handleViewProfile(booking.customerEmail)}
                            disabled={viewingProfileEmail === booking.customerEmail}
                            title="View full user profile"
                          >
                            {viewingProfileEmail === booking.customerEmail ? '...' : '👤'}
                          </button>
                        </div>
                        <div className={styles.bookingArtist}>{booking.artistName}</div>
                        <div className={styles.bookingDateTime}>
                          📅 {formatDate(booking.date, booking.startTime)} • ⏱️ {booking.duration}h
                        </div>
                        {booking.rejectedReason && (
                          <div className={styles.rejectedReason}>Reason: {booking.rejectedReason}</div>
                        )}
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

          {/* DELETED BOOKINGS (Soft deleted, no email sent) */}
          {deletedBookings.length > 0 && (
            <>
              <h2 className={styles.sectionTitle}>🗑️ Deleted Bookings</h2>
              <div className={styles.bookingsList}>
                {deletedBookings.map((booking) => (
                  <div key={booking.id} className={`${styles.bookingRow} ${styles.deletedRow}`}>
                    <div className={styles.bookingInfo}>
                      <div className={styles.profilePhoto}>
                        {getInitials(booking.firstName, booking.lastName)}
                      </div>
                      <div className={styles.bookingText}>
                        <div className={styles.bookingName}>
                          {booking.firstName} {booking.lastName}
                          <button
                            className={styles.viewProfileButton}
                            onClick={() => handleViewProfile(booking.customerEmail)}
                            disabled={viewingProfileEmail === booking.customerEmail}
                            title="View full user profile"
                          >
                            {viewingProfileEmail === booking.customerEmail ? '...' : '👤'}
                          </button>
                        </div>
                        <div className={styles.bookingArtist}>{booking.artistName}</div>
                        <div className={styles.bookingDateTime}>
                          📅 {formatDate(booking.date, booking.startTime)} • ⏱️ {booking.duration}h
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
