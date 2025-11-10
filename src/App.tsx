import { useState, useCallback } from 'react';
import { VideoDownloader } from './components/VideoDownloader';
import { VideoPlayer } from './components/VideoPlayer';
import type { VideoItem } from './types';
import './App.css';

const VIDEO_URLS = [
  'https://miscelanias.s3.us-east-1.amazonaws.com/santo_beef.mp4',
  'https://miscelanias.s3.us-east-1.amazonaws.com/renner.mp4',
  'https://miscelanias.s3.us-east-1.amazonaws.com/pizza_hut.mp4',
  'https://miscelanias.s3.us-east-1.amazonaws.com/mc_donald.mp4',
  'https://miscelanias.s3.us-east-1.amazonaws.com/fast_escova.mp4',
  'https://miscelanias.s3.us-east-1.amazonaws.com/espaco_laser.mp4',
  'https://miscelanias.s3.us-east-1.amazonaws.com/coco_bambu.mp4',
];

function App() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  const handleDownloadComplete = useCallback((downloadedVideos: VideoItem[]) => {
    setVideos(downloadedVideos);
    setIsReady(true);
  }, []);

  if (!isReady) {
    return <VideoDownloader videos={VIDEO_URLS} onComplete={handleDownloadComplete} />;
  }

  return <VideoPlayer videos={videos} />;
}

export default App;
