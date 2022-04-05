import $ from "jquery";
import { BACKEND_URL } from "./ENVIRONMENT";

const { connect, createLocalVideoTrack, createLocalAudioTrack } = require("twilio-video");

const activeTracks = { video: null, audio: null };

const removeTrack = (track) => {
  console.log(`removing ${track.kind} track with device id ${track.deviceId}`);
  track
    .stop()
    .detach()
    .forEach((e) => {
      e.remove();
    });
};

function addVideoTrack(deviceId) {
  let id;
  if (activeTracks.video) {
    if (deviceId) {
      removeTrack(activeTracks.video);
    }
    id = deviceId || activeTracks.video.deviceId;
  }

  console.log(`adding video track with device id ${id}`);

  const constraints = {
    width: 576,
    height: 276,
    deviceId: { exact: id }, // if set as undefined acts as if not present and selects default
  };

  return createLocalVideoTrack(constraints, (error) => {
    console.error(`Unable to create local video track: ${error.message}`);
    return false;
  }).then((localTrack) => {
    activeTracks.video = localTrack;
    activeTracks.video.deviceId = deviceId; // need this for restarting after mute
    const localMediaContainer = document.querySelector(".local-video-container");
    localMediaContainer.prepend(activeTracks.video.attach());
    return true;
  });
}

function addAudioTrack(deviceId) {
  let id;
  if (activeTracks.audio) {
    if (deviceId) {
      removeTrack(activeTracks.audio);
    }
    id = deviceId || activeTracks.audio.deviceId;
  }

  console.log(`adding audio track with device id ${deviceId}`);

  const constraints = { deviceId: { exact: id } }; // selects default if undefined

  return createLocalAudioTrack(constraints, (error) => {
    console.error(`Unable to create local audio track: ${error.message}`);
    return false;
  }).then((localTrack) => {
    const localMediaContainer = document.querySelector(".local-video-container");
    activeTracks.audio = localTrack;
    activeTracks.audio.deviceId = deviceId; // need this for restarting after mute
    localMediaContainer.prepend(activeTracks.audio.attach());
    return true;
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
      console.log(`Connected to Room ${room.name}`);

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

const addTrack = {
  audio: addAudioTrack,
  video: addVideoTrack,
};

function toggleLocalTracks(isOn, trackType) {
  const track = activeTracks[trackType];
  if (isOn) {
    addTrack[trackType](track.deviceId);
  } else {
    console.log(`stopping ${track.kind} track with device id ${track.deviceId}`);
    track.stop();
  }
}

export { addVideoTrack, addAudioTrack, joinRoom, toggleLocalTracks };
