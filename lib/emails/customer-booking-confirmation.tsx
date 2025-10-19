import * as React from 'react';

interface CustomerBookingConfirmationProps {
  firstName: string;
  artistName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  depositAmount: number;
  totalAmount: number;
  sameDayFee: boolean;
  afterHoursFee: boolean;
}

export const CustomerBookingConfirmation: React.FC<CustomerBookingConfirmationProps> = ({
  firstName,
  artistName,
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
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px', color: '#000' }}>
        Sweet Dreams Music Studio
      </h1>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>Your session is confirmed!</p>

      <div style={{ background: '#000', color: '#fff', padding: '30px', borderRadius: '8px', marginBottom: '30px', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>
          Thanks, {firstName}!
        </p>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>
          See You Soon
        </h2>
      </div>

      <div style={{ background: '#f5f5f5', padding: '25px', borderRadius: '8px', marginBottom: '25px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#000' }}>
          Your Booking Details
        </h3>
        <p style={{ margin: '8px 0', color: '#333' }}><strong>Artist Name:</strong> {artistName}</p>
        <p style={{ margin: '8px 0', color: '#333' }}><strong>Date:</strong> {date}</p>
        <p style={{ margin: '8px 0', color: '#333' }}><strong>Time:</strong> {startTime} - {endTime}</p>
        <p style={{ margin: '8px 0', color: '#333' }}><strong>Duration:</strong> {duration} {duration === 1 ? 'hour' : 'hours'}</p>
      </div>

      <div style={{ background: '#f5f5f5', padding: '25px', borderRadius: '8px', marginBottom: '25px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#000' }}>
          Payment Summary
        </h3>
        <p style={{ margin: '8px 0', color: '#333' }}>
          <strong>Deposit Paid Today:</strong> ${(depositAmount / 100).toFixed(2)}
        </p>
        <p style={{ margin: '8px 0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
          <strong>Total Session Cost:</strong> ${(totalAmount / 100).toFixed(2)}
        </p>
        {duration > 1 && (
          <p style={{ margin: '15px 0 0 0', padding: '15px', background: '#fff', borderRadius: '4px', fontSize: '14px', color: '#666' }}>
            💳 The remaining ${((totalAmount - depositAmount) / 100).toFixed(2)} will be charged after your session is complete.
          </p>
        )}
        {(sameDayFee || afterHoursFee) && (
          <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
            <p style={{ margin: '4px 0' }}><strong>Additional Fees Applied:</strong></p>
            {sameDayFee && <p style={{ margin: '4px 0' }}>• Same-day booking fee: +$10.00</p>}
            {afterHoursFee && <p style={{ margin: '4px 0' }}>• After-hours fee: +$10.00/hr</p>}
          </div>
        )}
      </div>

      <div style={{ background: '#000', color: '#fff', padding: '25px', borderRadius: '8px', marginBottom: '25px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
          Studio Location
        </h3>
        <p style={{ margin: '8px 0', fontSize: '16px' }}>
          3943 Parnell Ave<br />
          Fort Wayne, IN 46805
        </p>
        <p style={{ margin: '15px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
          Free on-site parking available
        </p>
      </div>

      <div style={{ borderTop: '2px solid #000', paddingTop: '20px', marginTop: '30px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#000' }}>
          Important Information
        </h3>
        <ul style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', paddingLeft: '20px' }}>
          <li>Please arrive 5-10 minutes early for your session</li>
          <li>All guests must be pre-approved</li>
          <li>First time booking? Mention it when you arrive for 20% off!</li>
        </ul>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #ddd' }}>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
          Questions? Contact us anytime
        </p>
        <p style={{ fontSize: '14px', color: '#000', fontWeight: 'bold' }}>
          jayvalleo@sweetdreamsmusic.com
        </p>
      </div>

      <p style={{ fontSize: '12px', color: '#999', textAlign: 'center', marginTop: '30px' }}>
        © 2025 Sweet Dreams Music LLC. All rights reserved.
      </p>
    </div>
  );
};
c