import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import "./settings.css";

function ListItem({ title, text, setEditing }) {
  return (
    <>
      <h3>{title}</h3>
      {text}
      <button type="button" className="edit" onClick={() => setEditing(title)}>
        edit
      </button>
    </>
  );
}

function InputItem({ label, initVal, example, repeat }) {
  const [value, setValue] = useState(initVal);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
      <div className="label">{label}</div>
      <input type="text" value={value} onChange={handleChange} placeholder={example} />
      {repeat && <InputItem label={`repeat ${label}`} repeat={false} />}
    </>
  );
}

function Settings() {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);

  const data = {
    name: [
      {
        label: "First name",
        example: "Max",
        val: "John",
        regex: "",
      },
      {
        label: "Second name",
        example: "Power",
        val: "Smith",
        regex: "",
      },
    ],
    email: [
      {
        label: "email",
        example: "max.power@gmail.com",
        val: "j.smith69@gmx.de",
        repeat: true,
      },
    ],
    password: [
      {
        label: "password",
        repeat: true,
      },
    ],
    "phone number": [
      {
        label: "phone number",
        example: "0519-345 95 704",
        val: "0123-456-76-754",
      },
    ],
    "post code": [
      {
        label: "post code",
        example: "44986",
        val: "90210",
      },
    ],
    "birth year": [
      {
        label: "birth year",
        example: "1962",
        val: "1969",
      },
    ],
  };

  return (
    <>
      <div className="header">
        <span className="text">{t("sg_main_header_settings")}</span>
      </div>
      <div className="content panel">
        {Object.entries(data).map(([title, fields]) => {
          const text = fields.map(({ val }) => val).join(" ");
          return <ListItem key={title} title={title} text={text} setEditing={setEditing} />;
        })}
        <button type="button">Delete Account</button>
        <div className={editing ? "edit-overlay" : "edit-overlay hidden"}>
          {editing && (
            <div className="edit-modal">
              {data[editing].map(({ label, example, val, regex, repeat }) => (
                <InputItem
                  key={label}
                  label={label}
                  example={example}
                  initVal={val}
                  regex={regex}
                  repeat={repeat}
                />
              ))}
              <button type="button" onClick={() => setEditing(false)}>
                cancel
              </button>
              <button type="button">submit</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Settings;
