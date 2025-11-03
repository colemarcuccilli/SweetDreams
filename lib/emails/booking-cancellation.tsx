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

interface BookingCancellationProps {
  firstName: string;
  artistName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  refunded: boolean;
  refundAmount?: number;
}

export const BookingCancellation = ({
  firstName,
  artistName,
  date,
  startTime,
  endTime,
  duration,
  refunded,
  refundAmount,
}: BookingCancellationProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Booking Cancelled</Heading>

          <Text style={text}>Hi {firstName},</Text>

          <Text style={text}>
            Your studio session booking at Sweet Dreams Music Studio has been cancelled.
          </Text>

          <Section style={detailsBox}>
            <Heading as="h2" style={h2}>
              Cancelled Booking Details
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

          {refunded && refundAmount && (
            <Section style={refundBox}>
              <Heading as="h2" style={h2}>
                Refund Information
              </Heading>

              <Text style={text}>
                A refund of <strong>${(refundAmount / 100).toFixed(2)}</strong> has been processed to your original payment method.
              </Text>

              <Text style={text}>
                Please allow 5-10 business days for the refund to appear on your statement.
              </Text>
            </Section>
          )}

          <Hr style={hr} />

          <Text style={text}>
            If you have any questions or would like to reschedule, please don't hesitate to contact us.
          </Text>

          <Text style={footer}>
            Sweet Dreams Music Studio<br />
            Professional Recording Studio<br />
            📧 Contact us through our website
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default BookingCancellation;

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
  color: '#000',
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
  margin: '20px 0 10px',
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

const detailsBox = {
  backgroundColor: '#f4f4f4',
  borderRadius: '4px',
  margin: '24px 40px',
  padding: '24px',
};

const refundBox = {
  backgroundColor: '#e8f5e9',
  borderRadius: '4px',
  margin: '24px 40px',
  padding: '24px',
  border: '2px solid #4caf50',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '32px 40px',
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '32px 0',
  padding: '0 40px',
  textAlign: 'center' as const,
};
