import * as React from 'react';

interface AdminBookingNotificationProps {
  firstName: string;
  lastName: string;
  artistName: string;
  email: string;
  phone?: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  depositAmount: number;
  totalAmount: number;
  sameDayFee: boolean;
  afterHoursFee: boolean;
}

export const AdminBookingNotification: React.FC<AdminBookingNotificationProps> = ({
  firstName,
  lastName,
  artistName,
  email,
  phone,
  date,
  startTime,
  endTime,
  duration,
  depositAmount,
  totalAmount,
  sameDayFee,
  afterHoursFee,
}) => {
  return (
    <div style={{ fontFamily: 'IBM Plex Mono, monospace', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#000' }}>
        🎵 New Studio Booking!
      </h1>

      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#000' }}>
          Customer Information
        </h2>
        <p style={{ margin: '8px 0', color: '#333' }}><strong>Name:</strong> {firstName} {lastName}</p>
        <p style={{ margin: '8px 0', color: '#333' }}><strong>Artist Name:</strong> {artistName}</p>
        <p style={{ margin: '8px 0', color: '#333' }}><strong>Email:</strong> {email}</p>
        {phone && <p style={{ margin: '8px 0', color: '#333' }}><strong>Phone:</strong> {phone}</p>}
      </div>

      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#000' }}>
          Booking Details
        </h2>
        <p style={{ margin: '8px 0', color: '#333' }}><strong>Date:</strong> {date}</p>
        <p style={{ margin: '8px 0', color: '#333' }}><strong>Time:</strong> {startTime} - {endTime}</p>
        <p style={{ margin: '8px 0', color: '#333' }}><strong>Duration:</strong> {duration} {duration === 1 ? 'hour' : 'hours'}</p>
      </div>

      <div style={{ background: '#000', color: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
          Payment Summary
        </h2>
        <p style={{ margin: '8px 0' }}><strong>Deposit Paid:</strong> ${(depositAmount / 100).toFixed(2)}</p>
        <p style={{ margin: '8px 0' }}><strong>Total Session Cost:</strong> ${(totalAmount / 100).toFixed(2)}</p>
        {duration > 1 && (
          <p style={{ margin: '8px 0', fontSize: '14px', opacity: 0.8 }}>
            Remainder to charge after session: ${((totalAmount - depositAmount) / 100).toFixed(2)}
          </p>
        )}
        {sameDayFee && <p style={{ margin: '8px 0', fontSize: '14px' }}>• Same-day booking fee applied (+$10)</p>}
        {afterHoursFee && <p style={{ margin: '8px 0', fontSize: '14px' }}>• After-hours fee applied (+$10/hr)</p>}
      </div>

      <p style={{ fontSize: '14px', color: '#666', marginTop: '30px' }}>
        View all bookings in your admin dashboard.
      </p>
    </div>
  );
};
