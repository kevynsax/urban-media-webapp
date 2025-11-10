import { useEffect, useRef, useState } from 'react';
import type { VideoItem } from '../types';
import './VideoPlayer.css';

interface VideoPlayerProps {
  videos: VideoItem[];
}

export function VideoPlayer({ videos }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [isStarted, setIsStarted] = useState(false);

  // Create object URLs from blobs
  useEffect(() => {
    const urls = videos.map(video =>
      video.blob ? URL.createObjectURL(video.blob) : video.url
    );
    setVideoUrls(urls);

    // Cleanup function to revoke object URLs
    return () => {
      urls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [videos]);

  // Handle start button click
  const handleStart = () => {
    setIsStarted(true);
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
      });
    }
  };

  // Handle video ended - play next video
  const handleVideoEnded = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  // Auto-play when video source changes (after initial start)
  useEffect(() => {
    if (isStarted && videoRef.current && videoUrls.length > 0) {
      videoRef.current.load();
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
      });
    }
  }, [currentIndex, videoUrls, isStarted]);

  // Prevent context menu and selection (kiosk mode)
  useEffect(() => {
    if (!isStarted) return;

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const preventSelection = (e: Event) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('selectstart', preventSelection);

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('selectstart', preventSelection);
    };
  }, [isStarted]);

  // Request fullscreen when started
  const requestFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log('Fullscreen request failed:', err);
      });
    }
  };

  if (videoUrls.length === 0) {
    return <div className="video-player-loading">Preparando vídeos...</div>;
  }

  // Show start screen before playing
  if (!isStarted) {
    return (
      <div className="video-player-container">
        <div className="start-screen">
          <h1>Sistema de Propaganda</h1>
          <p>Toque na tela para iniciar</p>
          <button
            className="start-button"
            onClick={() => {
              handleStart();
              requestFullscreen();
            }}
          >
            Iniciar Vídeos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="video-player-container">
      <video
        ref={videoRef}
        className="video-player"
        onEnded={handleVideoEnded}
        playsInline
        muted={false}
        preload="auto"
      >
        <source src={videoUrls[currentIndex]} type="video/mp4" />
        Seu navegador não suporta reprodução de vídeo.
      </video>
    </div>
  );
}



