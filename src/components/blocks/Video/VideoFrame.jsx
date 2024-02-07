import React, { useState } from "react";

import { VideoControls } from "../../../call-setup";

function VideoFrame({ Video, Audio, signalInfo }) {
  return (
    <div className="local-video-container">
      <div id="container" className="video-frame" alt="video">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video ref={Video} />
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio ref={Audio} />
      </div>
      <VideoControls signalInfo={signalInfo} />
    </div>
  );
}

export function VideoFrameWithOverlay({ video, audio }) {
  const [selectedOverlay, setOverlay] = useState(null);

  return (
    <div className="video-border">
      <div className="video-container">
        {/* <MobileVideoControlsTop selectedOverlay={selectedOverlay} setOverlay={setOverlay} /> */}
        <div
          id="foreign-container"
          className={selectedOverlay ? "video-frame blur" : "video-frame"}
          alt="video"
        />
        <div className="local-video-container inset">
          {/* <video ref={video} />
          <audio ref={audio} /> */}
        </div>
        <VideoControls />
        {/* <MobileDrawer content={selectedOverlay} setOverlay={setOverlay} /> */}
      </div>
    </div>
  );
}

export default VideoFrame;
