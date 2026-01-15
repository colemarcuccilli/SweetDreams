'use client';

import { useState, useRef, useEffect } from 'react';
import Hls from 'hls.js';
import styles from './project.module.css';

interface VideoPlayerProps {
  videoId: string;
  className?: string;
  playTextSize?: 'large' | 'small';
  thumbnailTime?: string;
}

export default function VideoPlayer({ videoId, className, playTextSize = 'large', thumbnailTime = '1s' }: VideoPlayerProps) {
  const [showOverlay, setShowOverlay] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const hlsUrl = `https://customer-w6h9o08eg118alny.cloudflarestream.com/${videoId}/manifest/video.m3u8`;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = hlsUrl;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [videoId]);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setShowOverlay(false);
    }
  };

  const handleVideoPlay = () => {
    setShowOverlay(false);
  };

  const handleVideoPause = () => {
    // Optional: show overlay again when paused
    // setShowOverlay(true);
  };

  return (
    <div className={className}>
      <video
        ref={videoRef}
        className={styles.video}
        poster={`https://customer-w6h9o08eg118alny.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg?time=${thumbnailTime}&height=600`}
        controls
        playsInline
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
      />
      {showOverlay && (
        <div className={styles.playOverlay} onClick={handlePlay}>
          <span className={`${styles.playText} ${playTextSize === 'small' ? styles.playTextSmall : ''}`}>
            PLAY
          </span>
        </div>
      )}
    </div>
  );
}
