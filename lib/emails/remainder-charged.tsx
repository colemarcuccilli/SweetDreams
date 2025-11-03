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

interface RemainderChargedProps {
  firstName: string;
  artistName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  remainderAmount: number;
}

export const RemainderCharged = ({
  firstName,
  artistName,
  date,
  startTime,
  endTime,
  duration,
  remainderAmount,
}: RemainderChargedProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Payment Processed</Heading>

          <Text style={text}>Hi {firstName},</Text>

          <Text style={text}>
            The remainder payment for your studio session has been successfully processed.
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
              Payment Information
            </Heading>

            <Text style={text}>
              <strong>Amount Charged:</strong> ${(remainderAmount / 100).toFixed(2)}
            </Text>

            <Text style={text}>
              This charge has been applied to your saved payment method.
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            Thank you for choosing Sweet Dreams Music Studio! We look forward to seeing you at your session.
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

export default RemainderCharged;

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

const paymentBox = {
  backgroundColor: '#e3f2fd',
  borderRadius: '4px',
  margin: '24px 40px',
  padding: '24px',
  border: '2px solid #2196f3',
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
