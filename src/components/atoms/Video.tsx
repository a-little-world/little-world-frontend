import styled from 'styled-components';

const YT_EMBED_URL = 'https://www.youtube.com/embed/';

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
      src={`${YT_EMBED_URL}${src}`}
      frameBorder="0"
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  </VideoContainer>
);

export default Video;
