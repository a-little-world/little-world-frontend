import React from 'react';
import styled from 'styled-components';

const YT_EMBED_URL = 'https://www.youtube.com/embed/';

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */
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

const Video = ({ src, title }: { src: string; title: string }) => {
  return (
    <VideoContainer>
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
};

export default Video;
