import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { BACKEND_URL } from "./ENVIRONMENT";

import "./settings.css";

function ListItem({ section, label, text, setEditing }) {
  const { t } = useTranslation();

  return (
    <div className={`item ${label}`}>
      <h3>{t(`sg_${section}_${label}`)}</h3>
      <span className="text">{text}</span>
      <button type="button" className="edit" onClick={() => setEditing(label)}>
        {t("sg_btn_change")}
      </button>
    </div>
  );
}

const types = {
  display_lang: "select",
  first_name: "text",
  second_name: "text",
  email: "email",
  password: "password",
  mobile_number: "tel",
  postal_code: "numeric",
  birth_year: "numeric",
};
const allowedChars = {
  tel: /^[+]?[0-9- ]*$/, // numbers spaces, dashes. can start with one +
  numeric: /^[0-9]*$/, // numbers only
  email: /^[a-z0-9@.+-]*$/i, // alphanumeric and @ . + -
};
const displayLanguages = [
  ["English", "en"],
  ["Deutsch", "de"],
];
const repeaters = ["password", "email"];

const submitData = (newDataObj, onSucess, onFailure) => {
  fetch(`${BACKEND_URL}/api2/profile/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(newDataObj).toString(),
  })
    .then((response) => {
      const { status, statusText } = response;
      if ([200, 400].includes(status)) {
        response.json().then(({ report }) => {
          if (status === 200) {
            onSucess(report);
          } else {
            onFailure(report);
          }
        });
      } else {
        // unexpected error
        console.error("server error", status, statusText);
      }
    })
    .catch((error) => console.error(error));
};

const apiChangeEmail = (email, onSucess, onFailure) => {
  /* WARNING: this will log the user out of the dashboard and require to enter a new verification code ( impossible using only this frontend ) */
  fetch(`${BACKEND_URL}/api2/change_email/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ email }).toString(),
  })
    .then((response) => {
      const { status, statusText } = response;
      if ([200, 400].includes(status)) {
        response.json().then(({ report }) => {
          if (status === 200) {
            onSucess(report);
          } else {
            onFailure(report);
          }
        });
      } else {
        // unexpected error
        console.error("server error", status, statusText);
      }
    })
    .catch((error) => console.error(error));
};

function ModalBox({ label, valueIn, repeatIn, lastValueIn, setEditing }) {
  const { t } = useTranslation();
  const type = types[label];
  const [value, setValue] = useState(type === "password" ? "" : valueIn);
  const [repeat, setRepeat] = useState(repeatIn);
  const [lastValue, setLastValue] = useState(lastValueIn);
  const [waiting, setWaiting] = useState(false);
  const [errors, setErrors] = useState([]);
  const textInput = useRef();

  const isOldPass = type === "password" && valueIn === "********";

  const handleChange = (e) => {
    const val = e.target.value;
    if (!["tel", "numeric", "email"].includes(type) || allowedChars[type].test(val)) {
      setValue(val);
    }
  };

  const onResponseSucess = (data) => {
    window.location.reload(); // update page
    setEditing(false);
  };
  const onResponseFailure = (report) => {
    const errorsList = report[label];
    setErrors(errorsList); // update error message(s)
    setWaiting(false);
  };

  const handleSubmit = () => {
    /**
     * @tbscode future TODO there should be seperate chnage handlers! Switching inside the hanler is bad practice
     */
    const wrongPass = type === "password" && value.length < 6;
    /* mismatched values */
    const { current } = textInput;
    if (lastValue && lastValue !== value) {
      setValue("");
      setRepeat(true);
      setLastValue(undefined);
      current.value = ""; // clear directly because react does not re-render
      setErrors(["fe_mismatch"]);
    } else if (wrongPass) {
      setErrors(["fe_password"]);
      current.value = "";
      current.focus();
    } else if (repeat !== true) {
      setWaiting(true);
      const newData = { [label]: value };
      console.log("Appepting update ", newData, value, type);
      if (type === "email") apiChangeEmail(value, onResponseSucess, onResponseFailure);
      else if (type === "select" && label === "display_lang") {
        // TODO @tbscode for now we use just the 'frontendLang' cookie
        // This *will* change with the new api
        Cookies.set("frontendLang", value);
        onResponseSucess({});
      } else submitData(newData, onResponseSucess, onResponseFailure);
    }
  };

  useEffect(() => {
    if (textInput.current) {
      textInput.current.focus();
    }
  }, [textInput, repeat]);

  const fullLabel = () => {
    if (lastValue) {
      const item = t(`sg_personal_${label}`);
      return t("sg_repeat_item", { item });
    }
    if (isOldPass) {
      return t("sg_personal_password_current");
    }
    if (type === "password") {
      return t("sg_personal_password_new");
    }
    return t(`sg_personal_${label}`);
  };

  return (
    <>
      {waiting && repeat === true && (
        <ModalBox
          label={label}
          valueIn=""
          repeatIn={isOldPass}
          lastValueIn={isOldPass ? value : undefined} /* maybe need to be undef if isOldPass */
          setEditing={setEditing}
        />
      )}
      {!(waiting && repeat === true) && (
        <div className="edit-modal">
          <h2>{t("sg_change_item", { item: t(`sg_personal_${label}`) })}</h2>
          <div className="error-message">
            {errors.map((errorTag) => {
              return <div key={errorTag}>{`⚠️ ${t(`request_errors.${errorTag}`)}`}</div>;
            })}
          </div>
          <button type="button" className="modal-close" onClick={() => setEditing(false)} />
          <div className="input-container">
            <label htmlFor={label}>{fullLabel()}</label>
            {type === "select" && (
              <select name="lang-select" onChange={handleChange} ref={textInput}>
                {displayLanguages.map((lang) => (
                  <option
                    key={lang[1]}
                    value={lang[1]}
                    // This auto sects the current language selection
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...(valueIn === lang[1] ? { selected: "selected" } : {})}
                  >
                    {lang[0]}
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
                pattern={type === "numeric" ? "[0-9]*" : undefined}
                onChange={handleChange}
                ref={textInput}
              />
            )}
            {isOldPass && (
              <button type="button" className="forgot-password" onClick={() => {}}>
                {t("sg_personal_password_forgot")}
              </button>
            )}
          </div>
          <div className="buttons">
            <button
              type="button"
              className={waiting ? "save waiting" : "save"}
              onClick={handleSubmit}
            >
              {isOldPass ? t("sg_btn_confirm") : t("sg_btn_save")}
            </button>
            <button
              type="button"
              className={waiting ? "cancel disabled" : "cancel"}
              onClick={() => setEditing(false)}
            >
              {t("sg_btn_cancel")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Settings({ userData }) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(null);

  /**
   * @tbscode future TODO ok i see how this makes it hard to have different form inside the modals
   * I think this would have been bettere handled by creating 'atom' components ( per suggestion from @Simba14 )
   * e.g.: atom.IntegerInput, atom.PassInput, atom.ErrorDisplay
   * This would allow to render any form inside any modal simply by listing the fields to be used
   * Since all these fields should be able to handle their own validation this wouldn't give us the annoying limitation of having only one input per modal
   */
  if (!userData) {
    // TODO @tbscode: I stole this from profile.jsx but this certainly doesn't look like the right way to handle things like this
    return null; // don't render until ajax has returned the necessary data
  }

  const items = [
    // with ordering
    "display_lang",
    "first_name",
    "second_name",
    "email",
    "password",
    "mobile_number",
    "postal_code",
    "birth_year",
  ];

  const data = Object.fromEntries(
    items.map((item) => [item, item === "password" ? "********" : userData[item]])
  );

  return (
    <>
      <div className="header">
        <span className="text">{t("sg_header")}</span>
      </div>
      <div className="content panel">
        <section className="settings personal">
          <h2>{t("sg_personal_header")}</h2>
          <div className="settings-items">
            {items.map((label) => {
              return (
                <ListItem
                  key={label}
                  section="personal"
                  label={label}
                  text={data[label]}
                  setEditing={setEditing}
                />
              );
            })}
            {/* No deleting of account for now!
            <div className="item">
              <h3>{t("sg_personal_delete_account")}</h3>
              <button type="button" className="delete-account">
                {t("sg_personal_delete_account_btn")}
              </button>
            </div>
          */}
            <div className={editing ? "edit-overlay" : "edit-overlay hidden"}>
              {editing && (
                <ModalBox
                  label={editing}
                  valueIn={data[editing]}
                  repeat={repeaters.includes(editing)}
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
