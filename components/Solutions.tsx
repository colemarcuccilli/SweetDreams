import Link from "next/link";
import styles from "./Solutions.module.css";

const SOLUTIONS = [
  "Creative & Design",
  "Production",
  "Post-Production",
  "Social Strategy",
  "Launch & Growth",
  "Music Studio"
];

export default function Solutions() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>WHAT WE DO</h2>
        <h3 className={styles.mainText}>SOLUTIONS</h3>

        <div className={styles.contentWrapper}>
          <div className={styles.leftContent}>
            <p className={styles.description}>
              From shooting ads to crafting campaigns, designing visuals, managing your social presence, and everything in-between—we handle it all. (And yeah, we especially love the in-between.)
            </p>

            <div className={styles.solutionsList}>
              {SOLUTIONS.map((solution, index) => (
                <span key={index} className={styles.solutionTag}>
                  {solution}
                </span>
              ))}
            </div>

            <Link href="/solutions" className={styles.learnMoreButton}>
              LEARN MORE
            </Link>
          </div>

          <div className={styles.rightContent}>
            <img
              src="https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/team/FX300218.jpg"
              alt="Sweet Dreams Team"
              className={styles.teamPhoto}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
