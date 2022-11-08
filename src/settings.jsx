import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { BACKEND_URL } from "./ENVIRONMENT";
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
  phone: "mobile_phone",
  postCode: "postal_code",
  birthYear: "birth_year",
};

const submitData = (item, newValue, onSuccess, onFailure) => {
  fetch(`${BACKEND_URL}/api2/profile/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ [labelsMap[item]]: newValue }).toString(),
  })
    .then((response) => {
      const { status, statusText } = response;
      if ([200, 400].includes(status)) {
        response.json().then(({ report }) => {
          if (status === 200) {
            onSuccess(report, item, newValue);
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
  $.ajax({
    type: "POST",
    url: `${BACKEND_URL}/api2/change_email/`,
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    data: { email },
    success: onSucess,
    error: onFailure,
  });
};

function ModalBox({ label, valueIn, repeatIn, lastValueIn, setEditing }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
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

  const onResponseSuccess = (data, item, newValue) => {
    dispatch(updateSettings({ [item]: newValue }));
    setEditing(false);
  };
  const onResponseFailure = (report) => {
    const errorsList = report[labelsMap[label]];
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
    if (label === "displayLang") {
      dispatch(updateSettings({ displayLang: value }));
      Cookies.set("frontendLang", value);
      i18n.changeLanguage(value);
      setEditing(false);
    } else if (lastValue && lastValue !== value) {
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
      if (type === "email") {
        apiChangeEmail(value, onResponseSuccess, onResponseFailure);
      } else {
        submitData(label, value, onResponseSuccess, onResponseFailure);
      }
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
        <div className="edit-modal modal-box">
          <button type="button" className="modal-close" onClick={() => setEditing(false)} />
          <h2>{t("sg_change_item", { item: t(`sg_personal_${label}`) })}</h2>
          <div className="error-message">
            {errors.map((errorTag) => {
              return <div key={errorTag}>{`⚠️ ${t(`request_errors.${errorTag}`)}`}</div>;
            })}
          </div>
          <div className="input-container">
            <label htmlFor={label}>{fullLabel()}</label>
            {label === "displayLang" ? (
              <select
                name="lang-select"
                onChange={handleChange}
                ref={textInput}
                defaultValue={valueIn}
              >
                {Object.entries(displayLanguages).map(([code, lang]) => (
                  <option key={code} value={code}>
                    {lang}
                  </option>
                ))}
              </select>
            ) : (
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

function Settings() {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(null);

  /**
   * @tbscode future TODO ok i see how this makes it hard to have different form inside the modals
   * I think this would have been bettere handled by creating 'atom' components ( per suggestion from @Simba14 )
   * e.g.: atom.IntegerInput, atom.PassInput, atom.ErrorDisplay
   * This would allow to render any form inside any modal simply by listing the fields to be used
   * Since all these fields should be able to handle their own validation this wouldn't give us the annoying limitation of having only one input per modal
   */
  const items = [
    // with ordering
    "displayLang",
    "firstName",
    "lastName",
    "email",
    "password",
    "phone",
    "postCode",
    "birthYear",
  ];

  const settingsData = useSelector((state) => state.userData.settings);

  const data = Object.fromEntries(
    items.map((item) => [item, item === "password" ? "********" : settingsData[item]])
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
                  setEditing={setEditing}
                  map={label === "displayLang" ? displayLanguages : false}
                />
              );
            })}
            <div className="item">
              <h3>{t("sg_personal_delete_account")}</h3>
              <button type="button" className="delete-account">
                {t("sg_personal_delete_account_btn")}
              </button>
            </div>
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
