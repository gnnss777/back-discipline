'use client';

import { useState } from 'react';
import { getYouTubeEmbedUrl } from '../types/exercise';

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  autoplay?: boolean;
}

export function VideoPlayer({ videoUrl, title, autoplay = false }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const embedUrl = getYouTubeEmbedUrl(videoUrl);
  const finalUrl = autoplay ? `${embedUrl}?autoplay=1` : embedUrl;

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-white font-bold mb-3">{title}</h3>
      )}
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        {isLoading && (
          <div className="absolute inset-0 bg-[#1A1A1A] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#B8956A] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <iframe
          src={finalUrl}
          title={title || 'Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full rounded-lg"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
}