import Cookies from "js-cookie";

import { BACKEND_URL } from "./ENVIRONMENT";

const { connect, createLocalVideoTrack, createLocalAudioTrack } = require("twilio-video");

const selectedTracks = { video: null, audio: null };

const removeTrack = (track) => {
  console.log(`removing ${track.kind} track with device id ${track.deviceId}`);
  track
    .stop()
    .detach()
    .forEach((e) => {
      e.remove();
    });
  selectedTracks[track.kind] = null;
};

const removeActiveTracks = () => {
  if (selectedTracks.video) {
    removeTrack(selectedTracks.video);
  }
  if (selectedTracks.audio) {
    removeTrack(selectedTracks.audio);
  }
};

function saveTrack(track, id) {
  const { kind } = track;
  selectedTracks[kind] = track;
  selectedTracks[kind].deviceId = id; // need this for restarting after mute
  if (localStorage.getItem(`${kind} muted`) === "true") {
    selectedTracks[kind].disable();
  }
  return selectedTracks[track.kind];
}

function getVideoTrack(deviceId) {
  console.log(`adding video track with device id ${deviceId}`);

  const constraints = {
    width: 576,
    height: 324,
    deviceId: { exact: deviceId }, // if set as undefined acts as if not present and selects default
  };

  return createLocalVideoTrack(constraints, (error) => {
    console.error(`Unable to create local video track: ${error.message}`);
    return null;
  }).then((localTrack) => saveTrack(localTrack, deviceId));
}

function getAudioTrack(deviceId) {
  console.log(`adding audio track with device id ${deviceId}`);

  const constraints = { deviceId: { exact: deviceId } }; // selects default if undefined

  return createLocalAudioTrack(constraints, (error) => {
    console.error(`Unable to create local audio track: ${error.message}`);
    return null;
  }).then((localTrack) => saveTrack(localTrack, deviceId));
}

function joinRoom(selfPk, partnerKey, isRandomCall = false) {
  // If random call is true, then use the 'authenticate_random_call` endpoint instead
  fetch(
    isRandomCall
      ? `${BACKEND_URL}/api/video_rooms/authenticate_random_call/`
      : `${BACKEND_URL}/api/video_rooms/authenticate_call/`,
    {
      method: "POST",
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken"),
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-UseTagsOnly": true,
      },
      body: JSON.stringify({
        usr_hash: selfPk,
        partner_hash: partnerKey,
      }),
    }
  )
    .then((response) => {
      const { status, statusText } = response;
      if (status === 200) {
        return response.json();
      }
      console.error("server error", status, statusText);
      return false;
    })
    .then(({ usr_auth_token, room_name }) => {
      connect(usr_auth_token, {
        name: room_name,
        tracks: [selectedTracks.video, selectedTracks.audio],
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
    })
    .catch((error) => console.error(error));
}

function toggleLocalTracks(willMute, trackType) {
  const track = selectedTracks[trackType];
  if (willMute) {
    track.disable();
  } else {
    track.enable();
  }
  localStorage.setItem(`${trackType} muted`, willMute);
}

export { getVideoTrack, getAudioTrack, joinRoom, toggleLocalTracks, removeActiveTracks };
