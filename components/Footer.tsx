import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Sweet Dreams Music */}
          <div className={styles.column}>
            <h3 className={styles.brandTitle}>SWEET DREAMS MUSIC</h3>
            <div className={styles.links}>
              <Link href="/music" className={styles.link}>Recording Studio</Link>
              <Link href="/music" className={styles.link}>Music Production</Link>
              <Link href="/music" className={styles.link}>Mixing & Mastering</Link>
            </div>
            <div className={styles.contact}>
              <p>3943 Parnell Ave</p>
              <p>Fort Wayne, IN 46805</p>
              <p>info@sweetdreamsmusic.com</p>
            </div>
          </div>

          {/* Sweet Dreams Media */}
          <div className={styles.column}>
            <h3 className={styles.brandTitle}>SWEET DREAMS MEDIA</h3>
            <div className={styles.links}>
              <Link href="/media" className={styles.link}>Video Production</Link>
              <Link href="/media" className={styles.link}>Brand Films</Link>
              <Link href="/media" className={styles.link}>Commercials</Link>
            </div>
            <div className={styles.contact}>
              <p>jayvalleo@sweetdreamsmusic.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.column}>
            <h3 className={styles.brandTitle}>QUICK LINKS</h3>
            <div className={styles.links}>
              <Link href="/work" className={styles.link}>Our Work</Link>
              <Link href="/solutions" className={styles.link}>Solutions</Link>
              <Link href="/about" className={styles.link}>About Us</Link>
              <Link href="/contact" className={styles.link}>Contact</Link>
            </div>
          </div>

          {/* Social */}
          <div className={styles.column}>
            <h3 className={styles.brandTitle}>FOLLOW US</h3>
            <div className={styles.links}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.link}>Instagram</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.link}>YouTube</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.link}>Facebook</a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>© 2025 Sweet Dreams Music LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}