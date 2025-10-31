import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ContactFormNotificationProps {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: string;
}

export const ContactFormNotification = ({
  name,
  email,
  phone,
  message,
  source,
}: ContactFormNotificationProps) => (
  <Html>
    <Head />
    <Preview>New Contact Form Submission from {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Contact Form Submission</Heading>

        <Text style={text}>
          You have received a new contact form submission from <strong>{source}</strong>.
        </Text>

        <Hr style={hr} />

        <Section style={section}>
          <Text style={label}>Name:</Text>
          <Text style={value}>{name}</Text>
        </Section>

        <Section style={section}>
          <Text style={label}>Email:</Text>
          <Text style={value}>{email}</Text>
        </Section>

        {phone && (
          <Section style={section}>
            <Text style={label}>Phone:</Text>
            <Text style={value}>{phone}</Text>
          </Section>
        )}

        <Section style={section}>
          <Text style={label}>Message:</Text>
          <Text style={messageValue}>{message}</Text>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          This notification was sent from Sweet Dreams contact form.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ContactFormNotification;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#000000',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  padding: '0',
  lineHeight: '1.4',
};

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
};

const label = {
  color: '#666666',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 4px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const value = {
  color: '#000000',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 20px',
};

const messageValue = {
  color: '#000000',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 20px',
  padding: '16px',
  backgroundColor: '#f6f9fc',
  borderRadius: '4px',
  whiteSpace: 'pre-wrap' as const,
};

const section = {
  margin: '0 0 20px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '1.5',
  marginTop: '32px',
};
