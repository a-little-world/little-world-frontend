import React, { useState } from "react";
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

function ModalBox({ label, value, setEditing }) {
  return (
    <div className="edit-modal">
      <h2>change {label}</h2>
      <button type="button" className="modal-close" onClick={() => setEditing(false)} />
      <div className="input-container">
        <label htmlFor={label}>{label}</label>
        <input type="text" defaultValue={value} name={label} />
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
      label: "first name",
      value: "John",
    },
    {
      label: "last name",
      value: "Smith",
    },
    {
      label: "e-mail",
      value: "j.smith69@gmx.de",
      repeat: true,
    },
    {
      label: "password",
      value: "********",
      repeat: true,
    },
    {
      label: "phone number",
      value: "0123-456-76-754",
    },
    {
      label: "post code",
      value: "90210",
    },
    {
      label: "birth year",
      value: "1969",
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
                  value={data.filter(({ label }) => label === editing)[0].value}
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
