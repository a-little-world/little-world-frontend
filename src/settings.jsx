import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { BACKEND_URL, DEVELOPMENT } from "./ENVIRONMENT";
import { updateSettings } from "./features/userData";

import "./settings.css";

function ListItem({ section, label, value, setEditing, map }) {
  const { t } = useTranslation();
  const text = map ? map[value] : value;

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
  profilePicture: "popup-open",
  displayLang: "select",
  firstName: "text",
  lastName: "text",
  email: "email",
  password: "password",
  phone: "tel",
  postCode: "numeric",
  birthYear: "numeric",
};
const allowedChars = {
  tel: /^[+]?[0-9- ]*$/, // numbers spaces, dashes. can start with one +
  numeric: /^[0-9]*$/, // numbers only
  email: /^[a-z0-9@.+-]*$/i, // alphanumeric and @ . + -
};
const displayLanguages = {
  en: "🇬🇧 English",
  de: "🇩🇪 Deutsch",
};

const repeaters = ["password", "email"];

const labelsMap = {
  displayLang: "display_lang",
  firstName: "first_name",
  lastName: "second_name",
  email: "email",
  password: "password",
  phone: "phone_mobile",
  postCode: "postal_code",
  birthYear: "birth_year",
};

const submitItem = (item, newValue) => {
  return submitData({ [labelsMap[item]]: newValue }, "/api/profile/");
};

const submitData = (data, endpoint) => {
  return fetch(`${BACKEND_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-UseTagsOnly": true, // This automaticly requests error tags instead of direct translations!
    },
    body: JSON.stringify(data),
  }).then((response) => {
    const { status, statusText } = response;
    if (status === 200) {
      return response.json();
    } else {
      throw new Error(`Error "${status}" submitting data: ${statusText}`);
    }
  });
};

const apiChangePw = (oldPass, newPass) => {
  const data = {
    password_old: oldPass,
    password_new: newPass,
    password_new2: newPass,
  };
  return submitData(data, "/api/user/changepw/");
};

const apiChangeEmail = (email) => submitData({email}, "/api/user/change_email/");
/* WARNING: this will log the user out of the dashboard and require to enter a new verification code ( impossible using only this frontend ) */

const allowedCodes = [
  // copied from profile.jsx. should globalise.
  8, // backspace
  16, // shift - for selection
  17, // ctrl - for word deletion
  33, // pageUp
  34, // pageDown
  35, // end
  36, // home
  37, // left arrow
  38, // up arrow
  39, // right arrow
  40, // down arrow
  46, // delete
];

function AtomicInput({ label, inputVal = "", handleChange = () => {}, refIn = undefined }) {
  const { t } = useTranslation();
  const type = types[label] || types[label.slice(0, 8)]; // password_new_rpt -> password
  const controlled = ["tel", "numeric", "email"].includes(type);

  const onKeyDown = (e) => {
    if (
      controlled &&
      !e.ctrlKey &&
      !allowedCodes.includes(e.keyCode) &&
      allowedChars[type].test(e.key) === false
    ) {
      e.preventDefault(); // prevent unwanted keypresses registering
    }
  };

  const inputProps = {
    type: type === "numeric" ? "text" : type,
    name: label,
    inputMode: type,
    pattern: type === "numeric" ? "[0-9]*" : undefined,
    onChange: handleChange,
    onKeyDown,
    ref: refIn,
  };

  if (controlled) {
    inputProps.value = inputVal || "";
  } else {
    inputProps.defaultValue = inputVal || "";
  }

  return (
    <label className="input-container">
      {t(`sg_personal_${label}`)}
      <input {...inputProps} />
    </label>
  );
}

function PassChange({ refIn = undefined }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleForgot = () => {
    navigate("/password_reset/");
    navigate(0);
  };

  return (
    <>
      <AtomicInput label="password_current" refIn={refIn} />
      <button type="button" className="forgot-password" onClick={handleForgot}>
        {t("sg_personal_password_forgot")}
      </button>
      <AtomicInput label="password_new" />
      <AtomicInput label="password_new_rpt" />
    </>
  );
}

function ModalBox({ label, valueIn, setEditing }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const type = types[label];
  const [value, setValue] = useState(valueIn);
  const [waiting, setWaiting] = useState(false);
  const [errors, setErrors] = useState([]);
  const textInput = useRef();

  const handleChange = (e) => {
    const val = e.target.value;
    if (!["tel", "numeric", "email"].includes(type) || allowedChars[type].test(val)) {
      setValue(val);
    } else {
      e.preventDefault();
    }
  };

  const onResponseSuccess = (data) => {
    dispatch(updateSettings(data));
    setEditing(false);
  };
  const onResponseFailure = (report) => {
    console.log("REPORT", report);
    const backendLabel = labelsMap[label];
    const errorsList = report[backendLabel] || ["unknown error"];
    setErrors(errorsList); // update error message(s)
    setWaiting(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]); // clear existing errors
    const val = e.target.elements[0].value;

    if (label === "displayLang") {
      // TODO: we need to update the server info also; this only upadates UI and cookie
      const langCode = val;
      dispatch(updateSettings({ displayLang: langCode }));
      Cookies.set("frontendLang", langCode);
      i18n.changeLanguage(langCode);
      setEditing(false);
    } else {
      setWaiting(true);
      if (label == "password") {
        const values = Array.from(e.target.elements)
          .filter(({ tagName }) => tagName !== "BUTTON")
          .map((x) => x.value);

        const [currentPw, newPw, newPwCopy] = values;
        // we check the new passwords match on frontend, so only need to send one to backend
        if (newPw !== newPwCopy) {
          setErrors(["request_errors.fe_mismatch"]);
          console.log(111, t("request_errors.fe_mismatch"));
          setWaiting(false);
        } else {
          // submit data
          apiChangePw(currentPw, newPw).then(onResponseSuccess).catch(onResponseFailure).then(() => {
            window.location.reload();
          });
        }
      } else if (type === "email") {
        // DISABLE; DANGEROUS
        if(!DEVELOPMENT)
          apiChangeEmail(value).then(onResponseSuccess).catch(onResponseFailure).then(() => {
            window.location.reload();
          });
      } else {
        submitItem(label, value).then(onResponseSuccess).catch(onResponseFailure);
      }
    }
  };

  useEffect(() => {
    if (textInput.current) {
      textInput.current.focus();
    }
  }, [textInput]);

  return (
    <div className="edit-modal modal-box">
      <button type="button" className="modal-close" onClick={() => setEditing(false)} />
      <h2>{t("sg_change_item", { item: t(`sg_personal_${label}`) })}</h2>
      <div className="error-message">
        {errors.map((errorTag) => {
          return <div key={errorTag}>{`⚠️ ${t(errorTag)}`}</div>;
        })}
      </div>
      <form onSubmit={handleSubmit}>
        <section className="inputs">
          {label === "displayLang" && (
            <label className="input-container">
              {t("sg_personal_displayLang")}
              <select name="lang-select" defaultValue={valueIn} ref={textInput}>
                {Object.entries(displayLanguages).map(([code, lang]) => (
                  <option key={code} value={code}>
                    {lang}
                  </option>
                ))}
              </select>
            </label>
          )}
          {["email", "password"].includes(label) && <span className="warning-notice">{t(`sg_personal_${label}_change_warning`)}</span>}
          {label === "password" && <PassChange refIn={textInput} />}
          {["firstName", "lastName", "email", "phone", "postCode", "birthYear"].includes(label) && (
            <AtomicInput
              label={label}
              inputVal={value}
              handleChange={handleChange}
              refIn={textInput}
            />
          )}
        </section>
        <div className="buttons">
          <button type="submit" className={waiting ? "save waiting" : "save"}>
            {t("btn_save")}
          </button>
          <button
            type="button"
            className={waiting ? "cancel disabled" : "cancel"}
            onClick={() => setEditing(false)}
          >
            {t("btn_cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}


function ConfirmAccountDeletetion({ 
  showModal,
  setShowModal
}) {
  const { t } = useTranslation();

  return ( showModal &&
  <div className={showModal ? "overlay-shade" : "overlay-shade hidden"}>
    <div className="modal-box">
      <button type="button" className="modal-close" onClick={() => setShowModal(false)} />
      <div className="content">
        <div className="message-text">{t("settings_delete_account_confirm_title")}</div>
        <div className="buttons">
          <button type="button" className="confirm" onClick={() => {
            // call deletion api ...
            // then reload page ...
              fetch(`${BACKEND_URL}/api/user/delete_account/`, {
                method: "POST",
                headers: {
                  "X-CSRFToken": Cookies.get("csrftoken"),
                  "Content-Type": "application/json",
                }
              }).then((res) => {
                if (res.ok) {
                  window.location.reload();
                } else {
                  console.error(`Error ${res.status}: ${res.statusText}`);
                }
              })
          }}>
            {t("settings_delete_account_confirm_button")}
          </button>
          <button type="button" className="cancel" onClick={() => setShowModal(false)}>
            {t("settings_delete_account_confirm_cancel")}
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}

function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.userData.user.profile);

  const [editing, setEditing] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const items = [
    // with ordering
    // "profilePicture",
    "display_language",
    "first_name",
    "second_name",
    "email",
    "password",
    "phone_mobile",
    "postal_code",
    "birth_year",
  ];


  const data = Object.fromEntries(
    items.map((item) => [item, item === "password" ? "********" : profile[item]])
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
                  value={data[label]}
                  setEditing={
                    label !== "profilePicture"
                      ? setEditing
                      : () => {
                          /* For profile picture we just open the userform frontend for now */
                          navigate("/formpage?pages=6");
                          navigate(0); /* Reload page */
                        }
                  }
                  map={label === "displayLang" ? displayLanguages : false}
                />
              );
            })}
            <div className="item">
              <h3>{t("sg_personal_delete_account")}</h3>
              <button type="button" className="delete-account"
                  onClick={() => {
                    setShowConfirm(true);
                  }}>
                {t("sg_personal_delete_account_btn")}
              </button>
            </div>
          </div>
        </section>
      </div>
      <div className={editing ? "overlay-shade" : "overlay-shade hidden"}>
        {editing && (
          <ModalBox
            label={editing}
            valueIn={data[editing]}
            repeat={repeaters.includes(editing)}
            setEditing={setEditing}
          />
        )}
      </div>
      <ConfirmAccountDeletetion showModal={showConfirm} setShowModal={setShowConfirm}/>
    </>
  );
}

export default Settings;
