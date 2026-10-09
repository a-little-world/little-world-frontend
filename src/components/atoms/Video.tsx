import styled from 'styled-components';

import { getEffectiveBackendUrl } from '../../api/helpers';
import { environment } from '../../environment';
import { extractYoutubeId } from '../../helpers/youtube';

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
  const videoId = extractYoutubeId(src) ?? src;

  // The native app renders this from a local file:// page, which has no origin
  // and sends no Referer. YouTube rejects embedded players without one
  // (error 153), so native builds embed via the backend's /youtube_embed/
  // proxy page, which runs on a real https origin the browser can identify
  // with. The web app has a real origin and can embed directly.
  const embedUrl = environment.isNative
    ? `${getEffectiveBackendUrl()}/youtube_embed/?v=${encodeURIComponent(videoId)}`
    : `https://www.youtube.com/embed/${videoId}`;

  return (
    <VideoContainer
      $maxWidth={maxWidth}
      $maxHeight={maxHeight}
      $aspectRatio={aspectRatio}
    >
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </VideoContainer>
  );
};

export default Video;
