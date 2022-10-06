import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import "./settings.css";

function ListItem({ title, text, setEditing }) {
  return (
    <div className="item">
      <h3>{title}</h3>
      <span className="text">{text}</span>
      <button type="button" className="edit" onClick={() => setEditing(title)}>
        change
      </button>
    </div>
  );
}

const displayLanguages = ["English", "Deutsch"];
const allowedChars = {
  tel: /^[+]?[0-9- ]*$/, // numbers spaces, dashes. can start with one +
  numeric: /^[0-9]*$/, // numbers only
  email: /^[a-z0-9@.+-]*$/i, // alphanumeric and @ . + -
};

function ModalBox({ label, type, initValue, setEditing }) {
  const textInput = useRef();
  const [value, setValue] = useState(type === "password" ? "" : initValue);

  const handleChange = (e) => {
    const val = e.target.value;
    if (!["tel", "numeric", "email"].includes(type) || allowedChars[type].test(val)) {
      setValue(val);
    }
  };

  useEffect(() => {
    if (textInput.current) {
      textInput.current.focus();
    }
  }, [textInput]);

  return (
    <div className="edit-modal">
      <h2>change {label}</h2>
      <button type="button" className="modal-close" onClick={() => setEditing(false)} />
      <div className="input-container">
        <label htmlFor={label}>{label}</label>
        {type === "select" && (
          <select name="lang-select">
            {displayLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        )}
        {type !== "select" && (
          <input
            type={type === "numeric" ? "text" : type}
            value={value}
            name={label}
            inputMode={type}
            onChange={handleChange}
            pattern={type === "numeric" ? "[0-9]*" : undefined}
            ref={textInput}
          />
        )}
      </div>
      <div className="buttons">
        <button type="button" className="save" onClick={() => setEditing(false)}>
          save
        </button>
        <button type="button" className="cancel" onClick={() => setEditing(false)}>
          cancel
        </button>
      </div>
    </div>
  );
}

function Settings() {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);

  const data = [
    {
      label: "display langauge",
      value: "English",
      type: "select",
    },
    {
      label: "first name",
      value: "John",
      type: "text",
    },
    {
      label: "last name",
      value: "Smith",
      type: "text",
    },
    {
      label: "e-mail",
      value: "j.smith69@gmx.de",
      type: "email",
      repeat: true,
    },
    {
      label: "password",
      value: "********",
      type: "password",
      repeat: true,
    },
    {
      label: "phone number",
      value: "0123-456-76-754",
      type: "tel",
    },
    {
      label: "post code",
      value: "90210",
      type: "numeric",
    },
    {
      label: "birth year",
      value: "1969",
      type: "numeric",
    },
  ];

  return (
    <>
      <div className="header">
        <span className="text">{t("sg_main_header_settings")}</span>
      </div>
      <div className="content panel">
        <section className="settings personal">
          <h2>{t("sg_section_personal")}</h2>
          <div className="settings-items">
            {data.map(({ label, value }) => {
              return <ListItem key={label} title={label} text={value} setEditing={setEditing} />;
            })}
            <div className="item">
              <h3>Delete Account</h3>
              <button type="button" className="delete-account">
                Delete My Account Now
              </button>
            </div>
            <div className={editing ? "edit-overlay" : "edit-overlay hidden"}>
              {editing && (
                <ModalBox
                  label={editing}
                  type={data.filter(({ label }) => label === editing)[0].type}
                  initValue={data.filter(({ label }) => label === editing)[0].value}
                  setEditing={setEditing}
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Settings;
