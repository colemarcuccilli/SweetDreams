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

interface ContactFormConfirmationProps {
  name: string;
}

export const ContactFormConfirmation = ({
  name,
}: ContactFormConfirmationProps) => (
  <Html>
    <Head />
    <Preview>Thank you for contacting Sweet Dreams Music!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Thank You for Reaching Out!</Heading>

        <Text style={text}>
          Hi {name},
        </Text>

        <Text style={text}>
          Thank you for contacting Sweet Dreams Music & Media. We've received your message and will get back to you as soon as possible.
        </Text>

        <Text style={text}>
          Our team typically responds within 24-48 hours during business hours.
        </Text>

        <Hr style={hr} />

        <Section style={infoBox}>
          <Text style={infoTitle}>Sweet Dreams Music & Media</Text>
          <Text style={infoText}>3943 Parnell Ave</Text>
          <Text style={infoText}>Fort Wayne, IN 46805</Text>
          <Text style={infoText}>Phone: (260) 420-6397</Text>
          <Text style={infoText}>Email: jayvalleo@sweetdreamsmusic.com</Text>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          This is an automated confirmation. Please do not reply to this email.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ContactFormConfirmation;

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

const infoBox = {
  backgroundColor: '#f6f9fc',
  padding: '20px',
  borderRadius: '4px',
  margin: '20px 0',
};

const infoTitle = {
  color: '#000000',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px',
};

const infoText = {
  color: '#333333',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 4px',
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
