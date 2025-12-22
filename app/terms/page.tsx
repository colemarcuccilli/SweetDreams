import type { Metadata } from "next";
import Link from "next/link";
import styles from "../privacy/legal.module.css";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service | Sweet Dreams",
  description: "Terms of Service for Sweet Dreams Music LLC. Read our booking policies, cancellation terms, and studio guidelines.",
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.updated}>Last Updated: October 30, 2025</p>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>1. Acceptance of Terms</h2>
            <p>
              Welcome to Sweet Dreams Music LLC ("Sweet Dreams," "we," "us," or "our"). By accessing our website at sweetdreams.us or booking our services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Services Provided</h2>
            <p>Sweet Dreams Music Studio provides:</p>
            <ul>
              <li>Recording studio sessions</li>
              <li>Music production services</li>
              <li>Mixing and mastering</li>
              <li>Beat production</li>
              <li>Music video production</li>
              <li>Photography and videography services</li>
              <li>Other creative media services as described on our website</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. Booking and Payment</h2>

            <h3>3.1 Online Booking</h3>
            <p>
              Sessions can be booked through our online booking system. By submitting a booking, you agree to pay the full session fee.
            </p>

            <h3>3.2 Pricing</h3>
            <p>Current studio rates:</p>
            <ul>
              <li><strong>Regular Hours</strong> (Mon-Thu 9AM-8:59PM): $50/hour</li>
              <li><strong>After Hours</strong> (Mon-Fri 9PM-2AM, Sat-Sun 11AM-3AM): $50/hour + $10/hour surcharge</li>
              <li><strong>Same-Day Bookings:</strong> Additional $10/hour fee</li>
            </ul>
            <p>Prices are subject to change. Current pricing will be displayed at time of booking.</p>

            <h3>3.3 Payment Processing</h3>
            <p>
              All payments are processed securely through Stripe. We accept major credit cards and debit cards. Payment is due at the time of booking unless otherwise arranged.
            </p>

            <h3>3.4 Promotional Offers</h3>
            <p>
              Promotional offers (e.g., Holiday Special: 3 Hours for $100) are valid for one-time use per customer and cannot be combined with other offers. Promotions must be applied at checkout and cannot be retroactively applied.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Cancellation and Refund Policy</h2>

            <h3>4.1 Cancellations</h3>
            <ul>
              <li><strong>48+ hours notice:</strong> Full refund</li>
              <li><strong>24-48 hours notice:</strong> 50% refund</li>
              <li><strong>Less than 24 hours:</strong> No refund</li>
              <li><strong>No-show:</strong> No refund, full charge applies</li>
            </ul>

            <h3>4.2 Rescheduling</h3>
            <p>
              Sessions may be rescheduled up to 48 hours before the scheduled time at no charge. Rescheduling requests with less than 48 hours notice are subject to availability and may incur fees.
            </p>

            <h3>4.3 Studio-Initiated Cancellations</h3>
            <p>
              If we need to cancel your session due to equipment failure, emergency, or other unforeseen circumstances, you will receive a full refund or the option to reschedule at no additional cost.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Studio Policies and Conduct</h2>

            <h3>5.1 Arrival Time</h3>
            <p>
              Please arrive on time for your session. Late arrivals may result in shortened session time, as sessions end at the scheduled time to accommodate other bookings.
            </p>

            <h3>5.2 Guest Policy</h3>
            <p>
              A reasonable number of guests are welcome. However, we reserve the right to limit guest access if it interferes with the session or other studio operations.
            </p>

            <h3>5.3 Prohibited Conduct</h3>
            <p>The following are strictly prohibited on studio premises:</p>
            <ul>
              <li>Illegal drugs or substances</li>
              <li>Excessive alcohol consumption</li>
              <li>Smoking inside the studio</li>
              <li>Aggressive or threatening behavior</li>
              <li>Damage to equipment or property</li>
              <li>Unauthorized recording or photography of the studio</li>
            </ul>
            <p>
              Violation of these policies may result in immediate termination of your session without refund and potential ban from future bookings.
            </p>

            <h3>5.4 Equipment Use</h3>
            <p>
              All studio equipment is to be operated by studio staff only unless otherwise authorized. Clients are responsible for any damage caused by misuse of equipment.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Intellectual Property Rights</h2>

            <h3>6.1 Client Content</h3>
            <p>
              You retain all rights to your original musical compositions, lyrics, and performances. By using our services, you grant us a limited license to work with your content for the purpose of providing our services.
            </p>

            <h3>6.2 Studio Work Product</h3>
            <p>
              The recordings, mixes, masters, and other work products created during your session belong to you upon full payment. We retain the right to use excerpts for promotional purposes (e.g., website, social media) unless you explicitly opt out.
            </p>

            <h3>6.3 Producer Credits</h3>
            <p>
              Sweet Dreams Music reserves the right to appropriate producer credits on all work produced at our studio. This includes:
            </p>
            <ul>
              <li>Credit on streaming platforms (Spotify, Apple Music, etc.)</li>
              <li>Credit on physical releases</li>
              <li>Credit in promotional materials</li>
            </ul>

            <h3>6.4 Portfolio Use</h3>
            <p>
              We may use your music, videos, and photos in our portfolio, website, and promotional materials. If you prefer not to be featured, please notify us in writing.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. File Delivery and Storage</h2>

            <h3>7.1 File Delivery</h3>
            <p>
              Final files will be delivered via digital download link within 72 hours of session completion, unless otherwise specified for projects requiring extensive mixing or mastering.
            </p>

            <h3>7.2 File Storage</h3>
            <p>
              We retain session files for 90 days after delivery. After 90 days, files may be deleted to free up storage space. Clients are responsible for backing up their files.
            </p>

            <h3>7.3 Extended Storage</h3>
            <p>
              Extended file storage beyond 90 days may be available for an additional fee. Contact us for pricing.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Limitation of Liability</h2>

            <h3>8.1 Service Quality</h3>
            <p>
              While we strive for excellence, we cannot guarantee specific commercial results from our services. The success of your music depends on many factors beyond our control.
            </p>

            <h3>8.2 Equipment Failure</h3>
            <p>
              We are not liable for session interruptions or data loss due to equipment failure, power outages, or other technical issues beyond our reasonable control. In such cases, we will offer a refund or reschedule at no charge.
            </p>

            <h3>8.3 Maximum Liability</h3>
            <p>
              Our total liability for any claim related to our services is limited to the amount you paid for that specific service.
            </p>

            <h3>8.4 Lost or Stolen Property</h3>
            <p>
              We are not responsible for personal items left at the studio. Please secure your belongings.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Account Terms</h2>

            <h3>9.1 Account Registration</h3>
            <p>
              To book sessions, you must create an account with accurate information. You are responsible for maintaining the security of your account credentials.
            </p>

            <h3>9.2 Account Termination</h3>
            <p>
              We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Dispute Resolution</h2>

            <h3>10.1 Informal Resolution</h3>
            <p>
              If you have a complaint or dispute, please contact us first at{" "}
              <a href="mailto:jayvalleo@sweetdreamsmusic.com">jayvalleo@sweetdreamsmusic.com</a>. We will work in good faith to resolve the issue.
            </p>

            <h3>10.2 Governing Law</h3>
            <p>
              These Terms are governed by the laws of the State of Indiana, USA. Any disputes will be resolved in the courts of Allen County, Indiana.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify and hold Sweet Dreams Music LLC harmless from any claims, damages, or expenses arising from:
            </p>
            <ul>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights (copyright, trademark, etc.)</li>
              <li>Your conduct at the studio</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>12. Force Majeure</h2>
            <p>
              We are not liable for failure to perform our obligations due to events beyond our reasonable control, including natural disasters, power outages, pandemics, civil unrest, or government actions.
            </p>
          </section>

          <section className={styles.section}>
            <h2>13. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated "Last Updated" date. Continued use of our services after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className={styles.section}>
            <h2>14. Severability</h2>
            <p>
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect.
            </p>
          </section>

          <section className={styles.section}>
            <h2>15. Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and Sweet Dreams Music LLC regarding use of our services.
            </p>
          </section>

          <section className={styles.section}>
            <h2>16. Contact Information</h2>
            <p>For questions about these Terms of Service, contact us:</p>
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
