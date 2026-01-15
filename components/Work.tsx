'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Work.module.css';

const PROJECTS = [
  {
    id: 1,
    title: 'THE COLEMAN PRIME STORY',
    slug: 'the-coleman-prime-story',
    thumbnail: 'https://customer-w6h9o08eg118alny.cloudflarestream.com/d08682649901944d9bbec1dcfb8bde88/thumbnails/thumbnail.jpg?time=89s&height=600',
    client: 'Coleman Prime',
    category: 'Brand Trailer',
    year: '2025',
    services: 'Brand Strategy, Cinematography, Editing, Color Grading'
  },
  {
    id: 2,
    title: 'KISSEL ENTERTAINMENT COMMERCIAL & MORE',
    slug: 'knoxville-carnival-coverage',
    thumbnail: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/KnoxvilleCarnival/DJI_20250912212213_0133_D.jpg',
    client: 'Kissel Entertainment',
    category: 'Event Coverage',
    year: '2025',
    services: 'Documentary Production, Event Coverage, Interview Production, Cinematic Trailers'
  },
  {
    id: 3,
    title: 'NISSAN WARSAW DEALERSHIP COMMERCIAL',
    slug: 'nissan-warsaw-dealership',
    thumbnail: 'https://customer-w6h9o08eg118alny.cloudflarestream.com/700297c313e97262173f0c2107f3b8db/thumbnails/thumbnail.jpg?time=2s&height=600',
    client: 'Nissan Warsaw Dealer',
    category: 'Commercial',
    year: '2025',
    services: 'Cinematography, Editing, Color Grading'
  },
  {
    id: 4,
    title: 'INDIANAPOLIS CHILDREN\'S MUSEUM FERRIS WHEEL EXPERIENCE',
    slug: 'indianapolis-childrens-museum-ferris-wheel',
    thumbnail: 'https://videodelivery.net/7a243650c649bdcf4369622acd47abf6/thumbnails/thumbnail.jpg?time=1s&height=600',
    client: 'Indianapolis Children\'s Museum',
    category: 'Commercial',
    year: '2025',
    services: 'Scripting, Cinematography, Editing, Color Grading'
  },
  {
    id: 5,
    title: 'BROOKFIELD ZOO FERRIS WHEEL COMMERCIAL',
    slug: 'brookfield-zoo-ferris-wheel',
    thumbnail: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/BrookfieldZoo/_DSC8445.jpg',
    client: 'RideWorx & Brookfield Zoo',
    category: 'Commercial',
    year: '2025',
    services: 'Scripting, Cinematography, Editing, Color Grading'
  },
  {
    id: 6,
    title: 'AEGIS DENTAL - TRUSTED DENTISTRY',
    slug: 'aegis-dental-trusted-dentistry',
    thumbnail: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/AegisDental/_DSC7982.jpg',
    client: 'Aegis Dental Group',
    category: 'Commercial',
    year: '2025',
    services: 'Cinematography, Editing, Color Grading'
  },
  {
    id: 7,
    title: 'SWEET DREAMS RECORDING STUDIO SHOWCASE',
    slug: 'sweet-dreams-recording-studio',
    thumbnail: 'https://customer-w6h9o08eg118alny.cloudflarestream.com/d912b8bd58831e95431db3c24791e44b/thumbnails/thumbnail.jpg?time=1s&height=600',
    client: 'Sweet Dreams Media',
    category: 'Commercial',
    year: '2025',
    services: 'Cinematography, Editing, Color Grading'
  },
  {
    id: 8,
    title: 'DEAR LOVER - MUSIC VIDEO',
    slug: 'dear-lover-music-video',
    thumbnail: 'https://customer-w6h9o08eg118alny.cloudflarestream.com/beeb2ee6a9a30c655e79bdc1f4fb6d20/thumbnails/thumbnail.jpg?time=3s&height=600',
    client: 'Lyaz',
    category: 'Music Video',
    year: '2025',
    services: 'Scripting, Cinematography, Editing'
  },
  {
    id: 9,
    title: 'FORT WAYNE TRAFFIC HYPERLAPSE',
    slug: 'fort-wayne-traffic-hyperlapse',
    thumbnail: 'https://customer-w6h9o08eg118alny.cloudflarestream.com/11ba969d7ad3bca18978a2c36580c51f/thumbnails/thumbnail.jpg?time=1s&height=600',
    client: 'Sweet Dreams Media',
    category: 'Hyperlapse',
    year: '2025',
    services: 'Aerial Cinematography, Hyperlapse, Editing'
  },
  {
    id: 10,
    title: 'CINEMA DRONE AD',
    slug: 'cinema-drone-ad',
    thumbnail: 'https://customer-w6h9o08eg118alny.cloudflarestream.com/7d5f758e9ad94d17703b2f7842ca309b/thumbnails/thumbnail.jpg?time=1s&height=600',
    client: 'Sweet Dreams Media',
    category: 'Equipment Showcase',
    year: '2025',
    services: 'Aerial Cinematography, Color Grading, Editing'
  }
];

export default function Work() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleProject = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>WE CARE ABOUT YOUR "WHY?"</h2>
          <h3 className={styles.mainText}>WORK</h3>
        </div>

        {/* Subheader */}
        <div className={styles.subheader}>
          <span className={styles.subheaderLeft}>PROJECTS</span>
          <Link href="/media#portfolio" className={styles.exploreLink}>EXPLORE</Link>
        </div>

        {/* Projects List */}
        <div className={styles.projectsList}>
          {PROJECTS.map((project) => (
            <div key={project.id} className={styles.projectItem}>
              {/* Project Header - Always Visible */}
              <div className={styles.projectHeader} onClick={() => toggleProject(project.id)}>
                <h4 className={styles.projectTitle}>{project.title}</h4>
                <button className={styles.toggleButton}>
                  <svg
                    className={`${styles.arrow} ${expandedId === project.id ? styles.arrowUp : ''}`}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>

              {/* Project Details - Collapsible */}
              {expandedId === project.id && (
                <div className={styles.projectDetails}>
                  <div className={styles.detailsLeft}>
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className={styles.thumbnail}
                    />
                  </div>
                  <div className={styles.detailsRight}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>CLIENT</span>
                      <span className={styles.detailValue}>{project.client}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>CATEGORY</span>
                      <span className={styles.detailValue}>{project.category}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>YEAR</span>
                      <span className={styles.detailValue}>{project.year}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>SERVICES</span>
                      <span className={styles.detailValue}>{project.services}</span>
                    </div>
                    <Link href={`/work/${project.slug}`} className={styles.viewButton}>
                      VIEW PROJECT
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
