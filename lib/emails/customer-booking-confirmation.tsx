import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
} from '@react-email/components';

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

export const CustomerBookingConfirmation = ({
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
}: CustomerBookingConfirmationProps) => {
  const remainderAmount = totalAmount - depositAmount;

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🎵 Booking Confirmed!</Heading>

          <Text style={text}>Hi {firstName},</Text>

          <Text style={text}>
            Great news! Your studio session has been approved and confirmed. We can't wait to see you!
          </Text>

          <Section style={detailsBox}>
            <Heading as="h2" style={h2}>
              Session Details
            </Heading>

            <Text style={detailText}>
              <strong>Artist Name:</strong> {artistName}
            </Text>

            <Text style={detailText}>
              <strong>Date:</strong> {date}
            </Text>

            <Text style={detailText}>
              <strong>Time:</strong> {startTime} - {endTime}
            </Text>

            <Text style={detailText}>
              <strong>Duration:</strong> {duration} {duration === 1 ? 'hour' : 'hours'}
            </Text>
          </Section>

          <Section style={paymentBox}>
            <Heading as="h2" style={h2}>
              Payment Summary
            </Heading>

            <Text style={detailText}>
              <strong>Deposit Charged Today:</strong> ${(depositAmount / 100).toFixed(2)}
            </Text>

            <Text style={detailText}>
              <strong>Total Session Cost:</strong> ${(totalAmount / 100).toFixed(2)}
            </Text>

            {remainderAmount > 0 && (
              <Text style={remainderText}>
                💳 Remaining balance of ${(remainderAmount / 100).toFixed(2)} will be charged after your session.
              </Text>
            )}

            {(sameDayFee || afterHoursFee) && (
              <>
                <Text style={detailText}><strong>Additional Fees Applied:</strong></Text>
                {sameDayFee && <Text style={feeText}>• Same-day booking fee: +$10.00</Text>}
                {afterHoursFee && <Text style={feeText}>• After-hours fee: +$10.00/hr</Text>}
              </>
            )}
          </Section>

          <Section style={locationBox}>
            <Heading as="h2" style={h2White}>
              Studio Location
            </Heading>

            <Text style={locationText}>
              3943 Parnell Ave<br />
              Fort Wayne, IN 46805
            </Text>

            <Text style={parkingText}>
              Free on-site parking available
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={infoSection}>
            <Heading as="h2" style={h2}>
              Important Information
            </Heading>

            <Text style={infoText}>• Please arrive 5-10 minutes early for your session</Text>
            <Text style={infoText}>• All guests must be pre-approved</Text>
            <Text style={infoText}>• Bring any reference tracks or project files you need</Text>
          </Section>

          <Hr style={hr} />

          <Text style={contactText}>
            Questions? Contact us anytime at<br />
            <strong>jayvalleo@sweetdreamsmusic.com</strong>
          </Text>

          <Text style={footer}>
            Sweet Dreams Music Studio<br />
            © 2025 Sweet Dreams Music LLC
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default CustomerBookingConfirmation;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#00cc00',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#000',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
};

const h2White = {
  color: '#fff',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
};

const text = {
  color: '#000',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
};

const detailText = {
  color: '#000',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
};

const feeText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '4px 0',
};

const remainderText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '15px 0 0 0',
  padding: '12px',
  backgroundColor: '#f0f0f0',
  borderRadius: '4px',
};

const detailsBox = {
  backgroundColor: '#f4f4f4',
  borderRadius: '4px',
  margin: '24px 40px',
  padding: '24px',
};

const paymentBox = {
  backgroundColor: '#e8f5e9',
  borderRadius: '4px',
  margin: '24px 40px',
  padding: '24px',
  border: '2px solid #4caf50',
};

const locationBox = {
  backgroundColor: '#000',
  borderRadius: '4px',
  margin: '24px 40px',
  padding: '24px',
};

const locationText = {
  color: '#fff',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
};

const parkingText = {
  color: 'rgba(255,255,255,0.7)',
  fontSize: '14px',
  margin: '15px 0 0 0',
};

const infoSection = {
  padding: '0 40px',
};

const infoText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '6px 0',
};

const contactText = {
  color: '#000',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '24px 0',
  padding: '0 40px',
  textAlign: 'center' as const,
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '32px 40px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '32px 0',
  padding: '0 40px',
  textAlign: 'center' as const,
};