import $ from "jquery";
import { BACKEND_URL } from "./ENVIRONMENT";

const { connect, createLocalTracks } = require("twilio-video");

const activeTracks = { video: null, audio: null };

// initialise webcam and mic
function addTracks() {
  createLocalTracks(
    {
      audio: true,
      video: { width: 576, height: 276, aspectRatio: 16 / 9 },
    },
    (error) => {
      console.error(`Unable to create local track: ${error.message}`);
    }
  ).then((localTracks) => {
    const localMediaContainer = document.querySelector(".local-video-container");
    // temporarily setting last audio/video track found as default
    localTracks.forEach((track) => {
      activeTracks[track.kind] = track;
    });
    localMediaContainer.prepend(activeTracks.video.attach());
    localMediaContainer.prepend(activeTracks.audio.attach());
  });
}

function joinRoom(partnerKey) {
  $.ajax({
    // using jQuery for now as fetch api is more convoluted with cross-domain requests
    type: "POST",
    url: `${BACKEND_URL}/api2/auth_call_room/`,
    data: {
      room_h256_pk: "4a44dc15364204a80fe80e9039455cc1608281820fe2b24f1e5233ade6af1dd5",
      partner_h256_pk: partnerKey,
    },
  }).then((data) => {
    const token = data.user_token;
    connect(token, {
      name: "cool room",
      tracks: [activeTracks.video, activeTracks.audio],
    }).then((room) => {
      console.log("Connected to Room:", room.name);

      const container = document.getElementById("foreign-container");
      const handleParticipant = (participant) => {
        console.log(`Participant "${participant.identity}" is connected to the Room`);
        container.innerHTML = ""; // remove any video/audio elements hanging around, OK as we only have 1 partner
        participant.on("trackSubscribed", (track) => container.appendChild(track.attach()));
      };

      room.participants.forEach(handleParticipant); // handle already connected partners
      room.on("participantConnected", handleParticipant); // handle partners that join after

      room.once("participantDisconnected", (participant) => {
        // note this event doesn't always seem to successfully fire,
        // which would lead to multiple videos, so we are clearing it on connect instead
        console.log(`Participant "${participant.identity}" has disconnected from the Room`);
      });
    });
  });
}

function toggleLocalTracks(isOn, trackType) {
  const track = activeTracks[trackType];
  if (isOn) {
    track.enable();
  } else {
    track.disable();
  }
}

export { addTracks, joinRoom, toggleLocalTracks };
