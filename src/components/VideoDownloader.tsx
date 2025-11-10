import { useEffect, useState } from 'react';
import { downloadVideo } from '../utils/videoDownloader';
import type { DownloadProgress, VideoItem } from '../types';
import './VideoDownloader.css';

interface VideoDownloaderProps {
  videos: string[];
  onComplete: (videos: VideoItem[]) => void;
}

export function VideoDownloader({ videos, onComplete }: VideoDownloaderProps) {
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    const initialProgress: DownloadProgress[] = videos.map(url => ({
      url,
      progress: 0,
      status: 'pending',
    }));
    setDownloadProgress(initialProgress);

    const downloadAllVideos = async () => {
      const downloadedVideos: VideoItem[] = [];

      for (let i = 0; i < videos.length; i++) {
        const url = videos[i];

        setDownloadProgress(prev =>
          prev.map(p => p.url === url ? { ...p, status: 'downloading' } : p)
        );

        try {
          const blob = await downloadVideo(url, (progress) => {
            setDownloadProgress(prev =>
              prev.map(p => p.url === url ? { ...p, progress } : p)
            );
          });

          downloadedVideos.push({
            url,
            id: url.split('/').pop() || `video-${i}`,
            blob,
          });

          setDownloadProgress(prev =>
            prev.map(p => p.url === url ? { ...p, status: 'completed', progress: 100 } : p)
          );
        } catch (error) {
          console.error(`Error downloading ${url}:`, error);
          setDownloadProgress(prev =>
            prev.map(p => p.url === url ? {
              ...p,
              status: 'error',
              error: error instanceof Error ? error.message : 'Unknown error'
            } : p)
          );
        }

        // Update overall progress
        const overall = Math.round(((i + 1) / videos.length) * 100);
        setOverallProgress(overall);
      }

      onComplete(downloadedVideos);
    };

    downloadAllVideos();
  }, [videos, onComplete]);

  const getVideoName = (url: string) => {
    return url.split('/').pop()?.replace('.mp4', '') || url;
  };

  return (
    <div className="video-downloader">
      <div className="downloader-container">
        <h1>Carregando Vídeos de Propaganda</h1>

        <div className="overall-progress">
          <div className="progress-label">
            <span>Progresso Geral</span>
            <span className="progress-percentage">{overallProgress}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill overall"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        <div className="videos-list">
          {downloadProgress.map((item) => (
            <div key={item.url} className={`video-item ${item.status}`}>
              <div className="video-info">
                <span className="video-name">{getVideoName(item.url)}</span>
                <span className="video-status">
                  {item.status === 'pending' && '⏳ Aguardando...'}
                  {item.status === 'downloading' && `📥 Baixando... ${item.progress}%`}
                  {item.status === 'completed' && '✓ Completo'}
                  {item.status === 'error' && `✗ Erro: ${item.error}`}
                </span>
              </div>
              {(item.status === 'downloading' || item.status === 'completed') && (
                <div className="progress-bar small">
                  <div
                    className="progress-fill"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

