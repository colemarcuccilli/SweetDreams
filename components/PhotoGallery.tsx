'use client';

import { useState, useEffect } from 'react';
import styles from './PhotoGallery.module.css';

interface PhotoGalleryProps {
  images: string[];
  projectTitle: string;
}

export default function PhotoGallery({ images, projectTitle }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    // Preload current and adjacent images
    preloadImages(index);
  };

  const closeGallery = () => {
    setIsOpen(false);
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    preloadImages(nextIndex);
  };

  const goToPrevious = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    preloadImages(prevIndex);
  };

  const preloadImages = (index: number) => {
    // Preload current, next, and previous images
    const toPreload = [
      index,
      (index + 1) % images.length,
      (index - 1 + images.length) % images.length
    ];

    toPreload.forEach((i) => {
      if (!loadedImages.has(i)) {
        const img = new Image();
        img.src = images[i];
        img.onload = () => {
          setLoadedImages((prev) => new Set(prev).add(i));
        };
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'Escape') closeGallery();
  };

  // Global keyboard listener
  useEffect(() => {
    if (!isOpen) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'Escape') closeGallery();
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, currentIndex]);

  return (
    <>
      {/* Thumbnail Grid */}
      <div className={styles.thumbnailGrid}>
        {images.map((image, index) => (
          <div
            key={index}
            className={styles.thumbnail}
            onClick={() => openGallery(index)}
          >
            <img
              src={image}
              alt={`${projectTitle} - Photo ${index + 1}`}
              className={styles.thumbnailImage}
            />
            <div className={styles.thumbnailOverlay}>
              <span className={styles.viewText}>VIEW</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Gallery */}
      {isOpen && (
        <div
          className={styles.lightbox}
          onClick={closeGallery}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            className={styles.closeButton}
            onClick={closeGallery}
            aria-label="Close gallery"
          >
            ✕
          </button>

          {/* Navigation Arrows */}
          <button
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            aria-label="Previous image"
          >
            ‹
          </button>

          <button
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Next image"
          >
            ›
          </button>

          {/* Main Image */}
          <div className={styles.imageContainer} onClick={(e) => e.stopPropagation()}>
            <img
              src={images[currentIndex]}
              alt={`${projectTitle} - Photo ${currentIndex + 1}`}
              className={styles.mainImage}
            />
          </div>

          {/* Counter */}
          <div className={styles.counter}>
            {currentIndex + 1} / {images.length}
          </div>

          {/* Thumbnail Strip */}
          <div className={styles.thumbnailStrip}>
            {images.map((image, index) => (
              <div
                key={index}
                className={`${styles.stripThumbnail} ${
                  index === currentIndex ? styles.activeThumbnail : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
