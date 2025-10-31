import type { Metadata } from "next";
import Link from "next/link";
import styles from "./legal.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | Sweet Dreams Studio",
  description: "Privacy Policy for Sweet Dreams Music Studio. Learn how we collect, use, and protect your personal information.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Last Updated: October 30, 2025</p>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>1. Introduction</h2>
            <p>
              Welcome to Sweet Dreams Music LLC ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website sweetdreamsmusic.com and use our services.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Information We Collect</h2>

            <h3>2.1 Personal Information</h3>
            <p>When you book a session or create an account, we collect:</p>
            <ul>
              <li>Name and contact information (email, phone number)</li>
              <li>Artist name or stage name</li>
              <li>Profile photo (optional)</li>
              <li>Billing and payment information</li>
              <li>Booking details (session dates, times, preferences)</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <p>When you visit our website, we automatically collect:</p>
            <ul>
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent</li>
              <li>Referring website</li>
              <li>Geographic location (city/state level)</li>
            </ul>

            <h3>2.3 Cookies and Tracking Technologies</h3>
            <p>We use cookies and similar tracking technologies including:</p>
            <ul>
              <li><strong>Google Tag Manager:</strong> Tag management and analytics</li>
              <li><strong>Google Analytics 4:</strong> Website analytics and user behavior</li>
              <li><strong>Facebook Pixel:</strong> Advertising and remarketing</li>
              <li><strong>Microsoft Clarity:</strong> Session recordings and heatmaps</li>
              <li><strong>Vercel Analytics:</strong> Performance monitoring</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Process and manage your studio bookings</li>
              <li>Send booking confirmations and reminders</li>
              <li>Process payments securely via Stripe</li>
              <li>Communicate with you about your sessions</li>
              <li>Improve our website and services</li>
              <li>Send promotional offers (with your consent)</li>
              <li>Analyze website usage and optimize user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. How We Share Your Information</h2>

            <h3>4.1 Service Providers</h3>
            <p>We share your information with trusted third-party service providers:</p>
            <ul>
              <li><strong>Stripe:</strong> Payment processing</li>
              <li><strong>Supabase:</strong> Database and authentication</li>
              <li><strong>Vercel:</strong> Website hosting</li>
              <li><strong>Resend:</strong> Transactional emails</li>
              <li><strong>Google/Meta/Microsoft:</strong> Analytics and advertising</li>
            </ul>

            <h3>4.2 Legal Requirements</h3>
            <p>We may disclose your information if required by law or to:</p>
            <ul>
              <li>Comply with legal processes</li>
              <li>Protect our rights and property</li>
              <li>Prevent fraud or illegal activity</li>
              <li>Protect user safety</li>
            </ul>

            <h3>4.3 Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal data, including:
            </p>
            <ul>
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure password hashing</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
              <li>PCI DSS compliant payment processing via Stripe</li>
            </ul>
            <p>
              However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Your Privacy Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing emails</li>
              <li><strong>Data Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Object:</strong> Object to certain data processing activities</li>
            </ul>
            <p>
              To exercise these rights, contact us at{" "}
              <a href="mailto:jayvalleo@sweetdreamsmusic.com">jayvalleo@sweetdreamsmusic.com</a>
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Data Retention</h2>
            <p>We retain your personal data for as long as necessary to:</p>
            <ul>
              <li>Provide our services to you</li>
              <li>Comply with legal obligations (tax, accounting)</li>
              <li>Resolve disputes and enforce agreements</li>
            </ul>
            <p>
              Booking records are retained for 7 years for tax purposes. Account data is retained until you request deletion.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Children's Privacy</h2>
            <p>
              Our services are not directed to individuals under 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. California Privacy Rights (CCPA)</h2>
            <p>California residents have additional rights under the CCPA:</p>
            <ul>
              <li>Right to know what personal information is collected</li>
              <li>Right to know if personal information is sold or disclosed</li>
              <li>Right to opt-out of the sale of personal information</li>
              <li>Right to deletion</li>
              <li>Right to non-discrimination</li>
            </ul>
            <p>
              We do not sell your personal information. To exercise your CCPA rights, contact us at{" "}
              <a href="mailto:jayvalleo@sweetdreamsmusic.com">jayvalleo@sweetdreamsmusic.com</a>
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. European Privacy Rights (GDPR)</h2>
            <p>
              If you are located in the European Economic Area (EEA), you have rights under the GDPR including the rights listed in Section 6 above.
            </p>
            <p>
              Our legal basis for processing your data is:
            </p>
            <ul>
              <li><strong>Contract:</strong> To fulfill our booking services</li>
              <li><strong>Consent:</strong> For marketing communications</li>
              <li><strong>Legitimate Interest:</strong> For analytics and improvements</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>11. Cookies and Tracking</h2>
            <p>You can control cookies through your browser settings:</p>
            <ul>
              <li>Block all cookies</li>
              <li>Accept only first-party cookies</li>
              <li>Delete cookies after browsing</li>
            </ul>
            <p>
              Note: Disabling cookies may limit website functionality. To opt-out of interest-based advertising:
            </p>
            <ul>
              <li>Google: <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">adssettings.google.com</a></li>
              <li>Facebook: <a href="https://www.facebook.com/settings?tab=ads" target="_blank" rel="noopener noreferrer">facebook.com/settings?tab=ads</a></li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>12. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites (Instagram, TikTok, etc.). We are not responsible for the privacy practices of these sites. Please review their privacy policies.
            </p>
          </section>

          <section className={styles.section}>
            <h2>13. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section className={styles.section}>
            <h2>14. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, contact us:</p>
            <ul>
              <li><strong>Email:</strong> <a href="mailto:jayvalleo@sweetdreamsmusic.com">jayvalleo@sweetdreamsmusic.com</a></li>
              <li><strong>Phone:</strong> <a href="tel:+12604507739">(260) 450-7739</a></li>
              <li><strong>Address:</strong> 3943 Parnell Ave, Fort Wayne, IN 46805</li>
            </ul>
          </section>

          <div className={styles.backLink}>
            <Link href="/">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
