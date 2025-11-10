import { videoCache } from './videoCache';

export interface DownloadProgressCallback {
  (progress: number): void;
}

export async function downloadVideo(
  url: string,
  onProgress?: DownloadProgressCallback
): Promise<Blob> {
  // Check cache first
  const cachedVideo = await videoCache.getVideo(url);
  if (cachedVideo) {
    onProgress?.(100);
    return cachedVideo;
  }

  // Download video
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download video: ${response.statusText}`);
  }

  const contentLength = response.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Failed to read response body');
  }

  const chunks: BlobPart[] = [];
  let receivedLength = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    chunks.push(value);
    receivedLength += value.length;

    if (total > 0 && onProgress) {
      const progress = Math.round((receivedLength / total) * 100);
      onProgress(progress);
    }
  }

  const blob = new Blob(chunks, { type: 'video/mp4' });

  // Save to cache
  await videoCache.saveVideo(url, blob);

  return blob;
}

