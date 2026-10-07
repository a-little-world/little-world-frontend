import { useEffect, useRef } from 'react';

import styled from 'styled-components';

import { extractYoutubeId, getEmbedderOrigin } from '../../helpers/youtube';

const YT_IFRAME_API_URL = 'https://www.youtube.com/iframe_api';

type YouTubePlayer = {
  destroy: () => void;
  getIframe: () => HTMLIFrameElement | undefined;
};

type YouTubePlayerOptions = {
  videoId: string;
  playerVars?: Record<string, string | number>;
};

type YouTubeApi = {
  Player: new (
    element: HTMLElement,
    options: YouTubePlayerOptions,
  ) => YouTubePlayer;
};

const getYouTubeApi = (): YouTubeApi | undefined =>
  (window as unknown as { YT?: YouTubeApi }).YT;

let youTubeApiPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (getYouTubeApi()?.Player) return Promise.resolve();

  if (!youTubeApiPromise) {
    youTubeApiPromise = new Promise<void>(resolve => {
      const globalWindow = window as unknown as {
        onYouTubeIframeAPIReady?: () => void;
      };
      const previous = globalWindow.onYouTubeIframeAPIReady;
      globalWindow.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve();
      };
      const script = document.createElement('script');
      script.src = YT_IFRAME_API_URL;
      document.head.appendChild(script);
    });
  }

  return youTubeApiPromise;
}

type VideoContainerProps = {
  $maxWidth?: string;
  $maxHeight?: string;
  $aspectRatio: number;
};

const VideoContainer = styled.div<VideoContainerProps>`
  position: relative;
  width: 100%;
  max-width: ${({ $maxWidth, $maxHeight, $aspectRatio }) => {
    if ($maxWidth && $maxHeight) {
      return `min(${$maxWidth}, calc(${$maxHeight} * ${$aspectRatio}))`;
    }
    if ($maxHeight) {
      return `calc(${$maxHeight} * ${$aspectRatio})`;
    }
    return $maxWidth ?? 'none';
  }};
  max-height: ${({ $maxHeight }) => $maxHeight ?? 'none'};
  margin: 0 auto;
  aspect-ratio: ${({ $aspectRatio }) => $aspectRatio};
  overflow: hidden;

  iframe {
    border: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
`;

type VideoProps = {
  src: string;
  title: string;
  maxWidth?: string;
  maxHeight?: string;
  aspectRatio?: number;
};

const Video = ({
  src,
  title,
  maxWidth,
  maxHeight,
  aspectRatio = 16 / 9,
}: VideoProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoId = extractYoutubeId(src);

  useEffect(() => {
    if (!videoId || !containerRef.current) return undefined;

    const mount = document.createElement('div');
    containerRef.current.appendChild(mount);

    let player: YouTubePlayer | undefined;
    let cancelled = false;

    loadYouTubeApi().then(() => {
      const api = getYouTubeApi();
      if (cancelled || !api?.Player) return;

      const origin = getEmbedderOrigin(window.location.origin);
      player = new api.Player(mount, {
        videoId,
        playerVars: { origin, widget_referrer: origin },
      });

      const iframe = player.getIframe();
      if (iframe) {
        iframe.title = title;
        iframe.setAttribute(
          'referrerpolicy',
          'strict-origin-when-cross-origin',
        );
      }
    });

    return () => {
      cancelled = true;
      player?.destroy();
      mount.remove();
    };
  }, [videoId, title]);

  return (
    <VideoContainer
      ref={containerRef}
      $maxWidth={maxWidth}
      $maxHeight={maxHeight}
      $aspectRatio={aspectRatio}
    />
  );
};

export default Video;
