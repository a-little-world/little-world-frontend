import logo from "./logo.svg";
import "./App.css";

function CallSetup() {
  return (
    <div className="call-setup-overlay">
      <div className="call-setup-modal">
        <div className="modal-top">
          <div className="modal-header">
            <h3 className="title">Beitrittsbestätigung</h3>
            <span className="subtitle">Möchten Sie diesem Gespräch beitreten?</span>
          </div>
          <button className="modal-close">X</button>
        </div>
        <VideoFrame />
        <div className="video-setup-dropdowns">
          <Dropdown title="Gewähltes Kamera"/>
          <Dropdown title="Gewähltes Mikrofon"/>
          <Dropdown title="Gewählte Lautsprecher"/>
        </div>
        <a className="video-setup-reset">Geräte neu auswählen</a>
        <button className="video-setup-confirm">Gespräch beitreten</button>
      </div>
    </div>
  );
}


function VideoFrame() {
  return (
    <div className="video-container">
      <img src={logo} className="video-frame" alt="video" />
      <div className="video-controls">
          <button className="signal-button">Signal Gut <span className="signal-update">Aktualisieren</span></button>
          <button className="push-right circle-button">M</button>
          <button className="circle-button">C</button>
      </div>
    </div>
  );
}

function Dropdown({title, options}) {
  return (
    <div className="">
      <label for="webcam-select">{title}</label>
      <select name="webcam-select">
        <option value="123">FaceTime HD camera</option>
      </select>
    </div>
  );
}

export default CallSetup;
