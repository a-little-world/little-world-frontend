import styled from 'styled-components';

const YT_EMBED_URL = 'https://www.youtube.com/embed/';

function extractYoutubeId(input: string): string | null {
  // Accept raw ids, youtu.be links, and youtube.com links.
  // YouTube video ids are always 11 chars (letters, digits, _ and -).
  const rawIdMatch = input.match(/^[a-zA-Z0-9_-]{11}$/);
  if (rawIdMatch) return input;

  try {
    const url = new URL(input);
    const host = url.hostname.toLowerCase();

    if (host === 'youtu.be') {
      const pathParts = url.pathname.split('/').filter(Boolean);
      return pathParts[0] ?? null;
    }

    if (host.includes('youtube.com')) {
      // https://www.youtube.com/watch?v=<id>
      const v = url.searchParams.get('v');
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

      // https://www.youtube.com/embed/<id>
      const embedMatch = url.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
      if (embedMatch?.[1]) return embedMatch[1];

      // https://www.youtube.com/shorts/<id>
      const shortsMatch = url.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
      if (shortsMatch?.[1]) return shortsMatch[1];
    }
  } catch {
    // Fall back to regex matching below.
  }

  const idMatch = input.match(
    /(?:v=|embed\/|shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return idMatch?.[1] ?? null;
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
`;

const StyledIframe = styled.iframe`
  border: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
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
}: VideoProps) => (
  <VideoContainer
    $maxWidth={maxWidth}
    $maxHeight={maxHeight}
    $aspectRatio={aspectRatio}
  >
    <StyledIframe
      src={`${YT_EMBED_URL}${extractYoutubeId(src) ?? src}`}
      frameBorder="0"
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  </VideoContainer>
);

export default Video;
