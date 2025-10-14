import styles from "./Friends.module.css";

const CLIENT_LOGOS = [
  {
    name: "Brookfield Zoo",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/BrookfieldZooLogo.png"
  },
  {
    name: "Crooked Lake Music Festival",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/CrookedLakeLogo.png"
  },
  {
    name: "Indianapolis Children's Museum",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/IndyChildrensMuseumLogo.png"
  },
  {
    name: "Kissel Entertainment",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/KisselLogo.png"
  },
  {
    name: "Nissan",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/nissanredlogo.png"
  },
  {
    name: "RideWorx",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/RideWorxLogo.png"
  },
  {
    name: "Summit City Vintage",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SummitCityVintageLogo.jpg"
  },
  {
    name: "Trusted Dental",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/TrustedDentalLogo.png"
  }
];

export default function Friends() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>OUR FRIENDS</h2>
        <h3 className={styles.mainText}>TRUSTED BY</h3>

        <div className={styles.logosGrid}>
          {CLIENT_LOGOS.map((client, index) => (
            <div key={index} className={styles.logoItem}>
              <img
                src={client.url}
                alt={client.name}
                className={styles.logo}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
