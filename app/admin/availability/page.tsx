'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { isAdmin } from '@/lib/admin-auth';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from './availability.module.css';

interface BlockedSlot {
  id: string;
  blocked_date: string;
  start_time: number | null;
  end_time: number | null;
  reason: string | null;
  block_entire_day: boolean;
  created_by: string;
  created_at: string;
}

export default function AdminAvailabilityPage() {
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [startTime, setStartTime] = useState<number>(9);
  const [endTime, setEndTime] = useState<number>(17);
  const [reason, setReason] = useState('');
  const [blockEntireDay, setBlockEntireDay] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  // Check admin access
  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || !isAdmin(user.email)) {
        alert('Unauthorized - Admin access required');
        router.push('/');
        return;
      }

      await fetchBlockedSlots();
    };

    checkAccess();
  }, []);

  const fetchBlockedSlots = async () => {
    try {
      const response = await fetch('/api/admin/availability');
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setBlockedSlots(data.blockedSlots || []);
    } catch (error) {
      console.error('Error fetching blocked slots:', error);
      alert('Failed to load blocked availability');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockSlot = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      alert('Please select a date');
      return;
    }

    if (!blockEntireDay && startTime >= endTime) {
      alert('End time must be after start time');
      return;
    }

    setIsBlocking(true);

    try {
      const response = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocked_date: format(selectedDate, 'yyyy-MM-dd'),
          start_time: blockEntireDay ? null : startTime,
          end_time: blockEntireDay ? null : endTime,
          reason: reason || null,
          block_entire_day: blockEntireDay,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to block slot');
      }

      alert('Availability blocked successfully!');
      setSelectedDate(undefined);
      setReason('');
      setBlockEntireDay(false);
      await fetchBlockedSlots();
    } catch (error) {
      console.error('Error blocking slot:', error);
      alert('Failed to block availability: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsBlocking(false);
    }
  };

  const handleUnblock = async (id: string) => {
    if (!confirm('Remove this blocked slot?')) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/admin/availability?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to unblock slot');
      }

      alert('Slot unblocked successfully!');
      await fetchBlockedSlots();
    } catch (error) {
      console.error('Error unblocking slot:', error);
      alert('Failed to unblock: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setDeletingId(null);
    }
  };

  const formatTime = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  const groupedSlots = blockedSlots.reduce((acc, slot) => {
    const date = slot.blocked_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, BlockedSlot[]>);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading availability...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Calendar Availability Management</h1>
        <p className={styles.subtitle}>Block dates and times to prevent bookings</p>
      </div>

      <div className={styles.content}>
        {/* Block Slot Form */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Block Availability</h2>

          <form onSubmit={handleBlockSlot} className={styles.form}>
            <div className={styles.calendarWrapper}>
              <label className={styles.label}>Select Date</label>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={{ before: new Date() }}
                className={styles.calendar}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={blockEntireDay}
                  onChange={(e) => setBlockEntireDay(e.target.checked)}
                  className={styles.checkbox}
                />
                <span>Block Entire Day</span>
              </label>
            </div>

            {!blockEntireDay && (
              <div className={styles.timeInputs}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Start Time</label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(parseInt(e.target.value))}
                    className={styles.select}
                  >
                    {Array.from({ length: 15 }, (_, i) => i + 9).map((hour) => (
                      <option key={hour} value={hour}>
                        {formatTime(hour)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>End Time</label>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(parseInt(e.target.value))}
                    className={styles.select}
                  >
                    {Array.from({ length: 15 }, (_, i) => i + 9).map((hour) => (
                      <option key={hour} value={hour}>
                        {formatTime(hour)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.label}>Reason (Optional)</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Studio maintenance, Personal time off"
                className={styles.input}
              />
            </div>

            <button
              type="submit"
              disabled={isBlocking || !selectedDate}
              className={styles.blockButton}
            >
              {isBlocking ? 'Blocking...' : 'Block Availability'}
            </button>
          </form>
        </div>

        {/* Blocked Slots List */}
        <div className={styles.listSection}>
          <h2 className={styles.sectionTitle}>Blocked Slots ({blockedSlots.length})</h2>

          {blockedSlots.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No blocked slots yet</p>
              <p className={styles.emptyStateHint}>Use the form to block dates/times</p>
            </div>
          ) : (
            <div className={styles.slotsList}>
              {Object.entries(groupedSlots)
                .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                .map(([date, slots]) => (
                  <div key={date} className={styles.dateGroup}>
                    <h3 className={styles.dateHeader}>
                      {format(new Date(date + 'T00:00:00'), 'EEEE, MMMM d, yyyy')}
                    </h3>

                    {slots.map((slot) => (
                      <div key={slot.id} className={styles.slotCard}>
                        <div className={styles.slotInfo}>
                          <div className={styles.slotTime}>
                            {slot.block_entire_day ? (
                              <span className={styles.entireDay}>Entire Day Blocked</span>
                            ) : (
                              <span>
                                {formatTime(slot.start_time!)} - {formatTime(slot.end_time!)}
                              </span>
                            )}
                          </div>

                          {slot.reason && (
                            <div className={styles.slotReason}>{slot.reason}</div>
                          )}

                          <div className={styles.slotMeta}>
                            Blocked by {slot.created_by} on{' '}
                            {format(new Date(slot.created_at), 'MMM d, h:mm a')}
                          </div>
                        </div>

                        <button
                          onClick={() => handleUnblock(slot.id)}
                          disabled={deletingId === slot.id}
                          className={styles.unblockButton}
                        >
                          {deletingId === slot.id ? 'Removing...' : 'Unblock'}
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
