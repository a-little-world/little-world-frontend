import $ from "jquery";
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

function addVideoTrack(deviceId) {
  // returns true for active, false for muted and null for failure
  let id = deviceId;
  if (selectedTracks.video) {
    if (id) {
      removeTrack(selectedTracks.video);
    } else {
      id = selectedTracks.video.deviceId;
    }
  }

  console.log(`adding video track with device id ${id}`);

  const constraints = {
    width: 576,
    height: 324,
    deviceId: { exact: id }, // if set as undefined acts as if not present and selects default
  };

  return createLocalVideoTrack(constraints, (error) => {
    console.error(`Unable to create local video track: ${error.message}`);
    return null;
  }).then((localTrack) => {
    selectedTracks.video = localTrack;
    selectedTracks.video.deviceId = deviceId; // need this for restarting after mute
    const localMediaContainer = document.querySelector(".local-video-container");
    localMediaContainer.prepend(selectedTracks.video.attach());
    if (localStorage.getItem("video muted") === "true") {
      selectedTracks.video.disable();
      return false;
    }
    return true;
  });
}

function addAudioTrack(deviceId) {
  let id;
  if (selectedTracks.audio) {
    if (deviceId) {
      removeTrack(selectedTracks.audio);
    }
    id = deviceId || selectedTracks.audio.deviceId;
  }

  console.log(`adding audio track with device id ${deviceId}`);

  const constraints = { deviceId: { exact: id } }; // selects default if undefined

  return createLocalAudioTrack(constraints, (error) => {
    console.error(`Unable to create local audio track: ${error.message}`);
    return false;
  }).then((localTrack) => {
    const localMediaContainer = document.querySelector(".local-video-container");
    selectedTracks.audio = localTrack;
    selectedTracks.audio.deviceId = deviceId; // need this for restarting after mute
    localMediaContainer.prepend(selectedTracks.audio.attach());
    return true;
  });
}

function joinRoom(partnerKey) {
  const csrfToken = Cookies.get("csrftoken");

  const doJoinRoom = (roomPk) => {
    $.ajax({
      // using jQuery for now as fetch api is more convoluted with cross-domain requests
      type: "POST",
      url: `${BACKEND_URL}/api2/auth_call_room/`,
      headers: {
        "X-CSRFToken": csrfToken,
      },
      data: {
        room_h256_pk: roomPk,
        partner_h256_pk: partnerKey,
      },
    }).then((data) => {
      const token = data.user_token;
      connect(token, {
        name: "cool room",
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
    });
  };

  // the room key will ultimately need both userPKs as input
  // although the current user PK could be inferred by backend
  $.ajax({
    type: "GET",
    url: `${BACKEND_URL}/api2/appointments/`,
    headers: {
      "X-CSRFToken": csrfToken,
    },
  }).then((appointments) => {
    const apt = appointments.filter(({ user }) =>
      user.filter(({ user_h256_pk }) => user_h256_pk === partnerKey)
    )[0];
    if (apt) {
      doJoinRoom(apt.room_h256_pk);
    } else {
      console.error("no appointment found");
    }
  });
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

export { addVideoTrack, addAudioTrack, joinRoom, toggleLocalTracks, removeActiveTracks };
