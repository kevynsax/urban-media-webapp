export interface VideoItem {
  url: string;
  id: string;
  blob?: Blob;
}

export interface DownloadProgress {
  url: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'error';
  error?: string;
}

