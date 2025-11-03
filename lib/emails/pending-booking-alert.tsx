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
  Link,
} from '@react-email/components';

interface PendingBookingAlertProps {
  firstName: string;
  lastName: string;
  artistName: string;
  email: string;
  phone: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  depositAmount: number;
  totalAmount: number;
}

export const PendingBookingAlert = ({
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
}: PendingBookingAlertProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>⚠️ Booking Needs Confirmation</Heading>

          <Text style={alertText}>
            A new booking has been created but is <strong>pending manual confirmation</strong>.
            The customer has paid, but the webhook may have failed.
          </Text>

          <Section style={alertBox}>
            <Heading as="h2" style={h2}>
              Action Required
            </Heading>
            <Text style={text}>
              Please log in to the admin dashboard and manually confirm this booking:
            </Text>
            <Link href="https://sweetdreamsmusic.com/profile/manage-bookings" style={button}>
              Go to Manage Bookings
            </Link>
          </Section>

          <Hr style={hr} />

          <Section style={detailsBox}>
            <Heading as="h2" style={h2}>
              Booking Details
            </Heading>

            <Text style={detailText}>
              <strong>Customer:</strong> {firstName} {lastName}
            </Text>

            <Text style={detailText}>
              <strong>Artist Name:</strong> {artistName}
            </Text>

            <Text style={detailText}>
              <strong>Email:</strong> {email}
            </Text>

            <Text style={detailText}>
              <strong>Phone:</strong> {phone || 'Not provided'}
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

            <Text style={detailText}>
              <strong>Deposit:</strong> ${(depositAmount / 100).toFixed(2)}
            </Text>

            <Text style={detailText}>
              <strong>Total:</strong> ${(totalAmount / 100).toFixed(2)}
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Sweet Dreams Music Studio<br />
            Admin Alert System
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default PendingBookingAlert;

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
  color: '#ff9800',
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

const alertText = {
  color: '#000',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
  textAlign: 'center' as const,
};

const detailText = {
  color: '#000',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
};

const alertBox = {
  backgroundColor: '#fff3e0',
  borderRadius: '4px',
  margin: '24px 40px',
  padding: '24px',
  border: '2px solid #ff9800',
  textAlign: 'center' as const,
};

const detailsBox = {
  backgroundColor: '#f4f4f4',
  borderRadius: '4px',
  margin: '24px 40px',
  padding: '24px',
};

const button = {
  backgroundColor: '#ff9800',
  borderRadius: '4px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '16px 0',
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
