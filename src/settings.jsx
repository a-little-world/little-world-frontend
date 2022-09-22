import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import "./settings.css";

function InputSetting({ type, example, initVal }) {
  const [value, setValue] = useState(initVal);
  const [storedValue, setStoredValue] = useState(`${value}`);
  const [editing, setEditing] = useState(false);

  const textInput = useRef(null);

  const enableEditing = () => {
    setEditing(true);
    const { current } = textInput;
    const { length } = current.value;
    current.focus();
    current.setSelectionRange(length, length); // ensure cursor is at end
  };

  const revertChange = () => {
    setValue(storedValue);
    setEditing(false);
  };

  const saveChange = () => {
    // server to be updated here
    setStoredValue(value);
    setEditing(false);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className={editing ? "setting-text editing" : "setting-text"}>
      <h3>{type}</h3>
      <button type="button" className="edit" onClick={enableEditing}>
        e
      </button>
      <input
        ref={textInput}
        type="text"
        readOnly={!editing}
        value={value}
        onChange={handleChange}
        placeholder={example}
      />
      <div className="save-buttons">
        <button type="button" className="cancel" onClick={revertChange}>
          <img alt="cancel" />
        </button>
        <button type="button" className="save" onClick={saveChange}>
          <img alt="save" />
        </button>
      </div>
    </div>
  );
}

function Settings() {
  const { t } = useTranslation();
  return (
    <>
      <div className="header">
        <span className="text">{t("sg_main_header_settings")}</span>
      </div>
      <div className="content panel">
        <InputSetting type="First Name" example="Max" initVal="John" />
        <InputSetting type="Second Name" example="Power" initVal="Smith" />
        <InputSetting
          type="E-mail"
          example="max.power@gmail.com"
          initVal="j.smith69@gmx.de"
          repeat
        />
        <InputSetting type="Password" example="Password123" initVal="Test123!" repeat />
        <InputSetting type="Phone number" example="0519-345 95 704" initVal="0123-456-76-754" />
        <InputSetting type="Post Code" example="44986" initVal="90210" />
        <InputSetting type="Date of Birth" example="25/12/1962" initVal="20/4/1969" />
        <button type="button">Delete Account</button>
      </div>
    </>
  );
}

export default Settings;
