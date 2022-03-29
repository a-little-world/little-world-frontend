import $ from "jquery";

const { connect, createLocalTracks } = require("twilio-video");

const activeTracks = { video: null, audio: null };

// initialise webcam and mic
function addTracks() {
  createLocalTracks(
    {
      audio: true,
      video: { width: 576, height: 276 },
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

function joinRoom(loginString, partnerKey) {
  $.ajax({
    // using jQuery for now as fetch api is more convoluted with cross-domain requests
    type: "POST",
    url: "https://littleworld-test.com/api2/auth_call_room/",
    headers: {
      Authorization: `Basic ${btoa(loginString)}`,
    },
    data: {
      room_h256_pk: "4a44dc15364204a80fe80e9039455cc1608281820fe2b24f1e5233ade6af1dd5",
      partner_h256_pk: partnerKey, // "5893bfed87ff048caee8b0fc8a3514df7e2495fe2e48d160dc26cd6401f1e6e7",
    },
  }).then((data) => {
    const token = data.user_token;
    connect(token, {
      name: "cool room",
      tracks: [activeTracks.video, activeTracks.audio],
    }).then((room) => {
      console.log("Connected to Room:", room.name);
      console.log("Partner key:", partnerKey);
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
