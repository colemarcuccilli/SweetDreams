"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { supabase, PortfolioItem } from "@/lib/supabase";
import styles from "./RecentWork.module.css";

export default function RecentWork() {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(projects.length - 1, prev + 1));
  };

  const handleMouseEnter = (projectId: string) => {
    const video = videoRefs.current.get(projectId);
    if (video) {
      video.play().catch((error) => {
        console.log("Video play prevented:", error);
      });
    }
  };

  const handleMouseLeave = (projectId: string) => {
    const video = videoRefs.current.get(projectId);
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
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
    <section className={styles.section}>
      <div className={styles.headerContainer}>
        <h2 className={styles.title}>RECENT WORK</h2>
        <h3 className={styles.mainText}>THE LATEST</h3>
      </div>

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
              onMouseEnter={() => handleMouseEnter(project.id)}
              onMouseLeave={() => handleMouseLeave(project.id)}
              draggable={false}
            >
              <div className={styles.videoContainer}>
                <img
                  src={project.thumbnail_url}
                  alt={project.title}
                  className={styles.thumbnail}
                  draggable={false}
                />
                <video
                  ref={(el) => {
                    if (el) videoRefs.current.set(project.id, el);
                  }}
                  muted
                  loop
                  playsInline
                  className={styles.video}
                >
                  <source
                    src={`https://customer-930f31024174032bfcbbb01ca4e88215.cloudflarestream.com/${project.cloudflare_stream_id}/manifest/video.m3u8`}
                    type="application/x-mpegURL"
                  />
                </video>
              </div>
              <h4 className={styles.projectTitle}>{project.title}</h4>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
