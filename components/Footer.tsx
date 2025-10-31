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
              <p>jayvalleo@sweetdreamsmusic.com</p>
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
              <p>cole@sweetdreamsmusic.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.column}>
            <h3 className={styles.brandTitle}>QUICK LINKS</h3>
            <div className={styles.links}>
              <Link href="/#work" className={styles.link}>Our Work</Link>
              <Link href="/solutions" className={styles.link}>Solutions</Link>
              <Link href="/solutions" className={styles.link}>About Us</Link>
              <Link href="/music#contact" className={styles.link}>Contact</Link>
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
          <div className={styles.bottomLeft}>
            <p className={styles.copyright}>© 2025 Sweet Dreams Music LLC. All rights reserved.</p>
            <div className={styles.legalLinks}>
              <Link href="/privacy" className={styles.legalLink}>Privacy Policy</Link>
              <span className={styles.separator}>•</span>
              <Link href="/terms" className={styles.legalLink}>Terms of Service</Link>
            </div>
          </div>
          <div className={styles.footerLogos}>
            <img
              src="https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackWhiteLogo.png"
              alt="Sweet Dreams"
              className={styles.footerLogo}
            />
            <img
              src="https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreamsMusic3StackWhiteLogo.png"
              alt="Sweet Dreams Music"
              className={styles.footerLogo}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}