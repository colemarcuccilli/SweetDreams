"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { createClient, PortfolioItem } from "@/lib/supabase";
import styles from "./RecentWork.module.css";

// Get singleton client instance
const supabase = createClient();

export default function RecentWork() {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [cursorLogo, setCursorLogo] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('featured', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching portfolio:', error);
      } else if (data) {
        setProjects(data);
      }
      setLoading(false);
    }

    fetchProjects();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handlePrevious = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({
      left: -600,
      behavior: 'smooth'
    });
  };

  const handleNext = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({
      left: 600,
      behavior: 'smooth'
    });
  };

  const handleMouseEnter = (project: PortfolioItem) => {
    setCursorLogo(project.client_logo_url || null);
  };

  const handleMouseLeave = () => {
    setCursorLogo(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeaveContainer = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>RECENT WORK</h2>
          <h3 className={styles.mainText}>THE LATEST</h3>
          <p>Loading projects...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} data-cursor-hide>
      {/* Custom Cursor with Logo */}
      {cursorLogo && (
        <div
          className={styles.customCursor}
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
          }}
        >
          <img src={cursorLogo} alt="Client Logo" className={styles.cursorLogo} />
        </div>
      )}

      <div className={styles.headerContainer}>
        <h2 className={styles.title}>RECENT WORK</h2>
        <h3 className={styles.mainText}>THE LATEST</h3>
        <Link href="/media#portfolio" className={styles.viewAllButton}>
          VIEW ALL PROJECTS
        </Link>
      </div>

      <div className={styles.scrollWrapper}>
        {/* Navigation Arrows */}
        <button
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={handlePrevious}
          aria-label="Previous project"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div
          className={styles.scrollContainer}
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveContainer}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div className={styles.carouselTrack}>
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/work/${project.slug}`}
                className={styles.projectCard}
                onMouseEnter={() => handleMouseEnter(project)}
                onMouseLeave={handleMouseLeave}
                draggable={false}
              >
                <div className={styles.imageContainer}>
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className={styles.thumbnail}
                    draggable={false}
                  />
                </div>
                <h4 className={styles.projectTitle}>{project.title}</h4>
              </Link>
            ))}
          </div>
        </div>

        <button
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={handleNext}
          aria-label="Next project"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </section>
  );
}
