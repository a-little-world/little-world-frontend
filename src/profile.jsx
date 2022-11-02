import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Avatar from "react-nice-avatar";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { BACKEND_URL } from "./ENVIRONMENT";
import "./i18n";
import Link from "./path-prepend";

import "./profile.css";

const postUserProfileUpdate = (updateData, onFailure, onSucess, formTag) => {
  fetch(`${BACKEND_URL}/api2/profile/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(updateData).toString(),
  }).then((response) => {
    const { status, statusText } = response;
    if (![200, 400].includes(status)) {
      console.error("server error", status, statusText);
    } else {
      response.json().then(({ report }) => {
        if (response.status === 200) {
          return onSucess();
        }
        const errorTags = report[formTag];
        console.log("ListError", errorTags);
        return onFailure(errorTags);
      });
    }
  });
};

function ProfileBox({
  userPk,
  firstName,
  lastName,
  description,
  imgSrc,
  avatarCfg,
  status,
  setCallSetupPartner,
  isOnline,
}) {
  const { t } = useTranslation();
  const isSelf = status === "self";
  if (isSelf) {
    isOnline = true;
  }

  return (
    <div className={status === "unconfirmed" ? "profile-box new-match" : "profile-box"}>
      {avatarCfg ? (
        <Avatar className="profile-avatar" {...avatarCfg} />
      ) : (
        <img alt="match" className="profile-image" src={imgSrc} />
      )}
      <div className={isOnline ? "online-indicator online" : "online-indicator"}>
        online <span className="light" />
      </div>
      <div className="profile-info">
        <div className="name">{`${firstName} ${lastName}`}</div>
        <div className="text">{description}</div>
      </div>
      {!isSelf && (
        <div className="buttons">
          <Link to="/" state={{ userPk }} className="profile">
            <img alt="visit profile" />
            {t("cp_profile")}
          </Link>
          <Link to="/chat" state={{ userPk }} className="chat">
            <img alt="chat" />
            {t("cp_message")}
          </Link>
          <button type="button" onClick={() => setCallSetupPartner(userPk)} className="call">
            <img alt="call" />
            {t("cp_call")}
          </button>
        </div>
      )}
    </div>
  );
}

function ItemsBox({ selectedChoices }) {
  const { t } = useTranslation();
  const choices = useSelector((state) => state.userData.interestsChoices);

  const choicesTransTags = choices.map(({ display_name }) => display_name);
  const [editing, setEditing] = useState(false);
  const [topicIndexes, setTopicIndexes] = useState(selectedChoices);
  const [tempTopicIndexes, setTempTopicIndexes] = useState(selectedChoices);
  const [errorText, setErrorText] = useState("");

  const location = useLocation();
  const { userPk } = location.state || {};
  const isSelf = !userPk;

  const toggleInterest = (idx) => {
    const newIndexes = tempTopicIndexes.includes(idx)
      ? tempTopicIndexes.filter((item) => item !== idx) // remove item
      : [...tempTopicIndexes, idx]; // add item
    setTempTopicIndexes(newIndexes);
  };

  const saveTopics = () => {
    postUserProfileUpdate(
      `interests:[${tempTopicIndexes}]`,
      (errorTags) => {
        const errorTextStr = errorTags.map((e) => t(e)).join(", ");
        setErrorText(errorTextStr);
        console.log("ErrorText", errorTextStr);
        setEditing(false);
      },
      () => {
        setEditing(false);
        setTopicIndexes(tempTopicIndexes); // probably should use the server response?
      },
      "interests"
    );
  };

  const cancelTopics = () => {
    setTempTopicIndexes(topicIndexes);
    setEditing(false);
  };

  return (
    <div className="topics">
      <h3>{t("profile_topics")}</h3>
      <div className="selected-topics">
        {isSelf && (
          <button type="button" className="edit" onClick={() => setEditing(true)}>
            <img alt="edit" />
          </button>
        )}
        {topicIndexes.map((idx) => (
          <div key={idx} className="interest-item">
            <span className="text">{t(`profile_interests.${choicesTransTags[idx]}`)}</span>
          </div>
        ))}
        {editing && (
          <div className="topics-shade">
            <div className="topics-selector">
              <div className="buttons">
                <button type="button" className="cancel" onClick={cancelTopics}>
                  <img alt="cancel" />
                </button>
                <button type="button" className="save" onClick={saveTopics}>
                  <img alt="save" />
                </button>
              </div>
              <h3>{t("profile_choose_interests")}</h3>
              <div className="items">
                {choicesTransTags.map((interest, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={
                      tempTopicIndexes.includes(idx)
                        ? "interest-item selected-item"
                        : "interest-item"
                    }
                    onClick={() => toggleInterest(idx)}
                  >
                    <span className="text">{t(`profile_interests.${interest}`)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {errorText && <div style={{ color: "red" }}>{errorText}</div>}
    </div>
  );
}

function SectionBox({ subject, children }) {
  // TODO: use translations
  return (
    <div className={subject}>
      <h3>{subject}</h3>
      {children}
    </div>
  );
}

function TextBox({ subject, initialText = "", formTag }) {
  const { t } = useTranslation();
  const location = useLocation();
  const editorRef = useRef();
  const [editState, setEditState] = useState(false);

  /*
   * NOTE: useState will ONLY update based on initial value on the first render
   * This was causing bug https://github.com/tbscode/little-world-frontend/issues/108
   * IE; when a match's profile was loaded and then the user clicks directly to their own
   * profile, the element is re-rendered and the topicText is not updated by useState alone
   */
  const [topicText, setTopicText] = useState(initialText);
  useEffect(() => {
    setTopicText(initialText);
  }, [initialText]);

  const [errorText, setErrorText] = useState(""); // TODO: maybe if error add a reload button that loads the old default of this field
  const [textLen, setTextLen] = useState(0);

  const { userPk } = location.state || {};
  const isSelf = !userPk;

  const saveChange = () => {
    const html = editorRef.current.innerHTML;

    /* Unpick the weirdness that browsers are doing to the DOM when multiple returns
     * are included. If this is not done innerText will insert 2n-1 new lines and
     * giving different results between contenteditable and fixed content.
     */
    editorRef.current.innerHTML = html
      .replaceAll("<div><br></div>", "<br>")
      .replace("<div>", "<br>")
      .replace("</div>", "");
    const text = editorRef.current.innerText;
    postUserProfileUpdate(
      { [formTag]: text },
      (_text) => {
        console.log("text error");
        setErrorText(t(`request_errors.${_text}`)); // TODO: @tbscode here again I'm tahing a backend state directly, this could be resolved by https://github.com/tbscode/little-world-frontend/pull/122
        setEditState(false);
      },
      () => {
        setTopicText(text);
        setEditState(false);
      },
      formTag
    );
  };

  const allowedCodes = [
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
  const maxLen = 999;

  const handleKeyDown = (e) => {
    // preventing keyPresses needs to run on keyDown
    if (allowedCodes.includes(e.keyCode)) {
      return; // don't calculate length if not necessary
    }
    if (e.keyCode === 90 && e.ctrlKey) {
      return; // allow undo (ctrl+z)
    }
    const el = editorRef.current;
    const len = el.innerText.length;
    if (len >= maxLen) {
      e.preventDefault();
    }
  };

  const handleKeyUp = () => {
    // handling paste needs to run on keyUp
    const el = editorRef.current;
    const text = el.innerText;
    if (text.length > maxLen) {
      el.innerText = text.substring(0, maxLen);
    }
    setTextLen(el.innerText.length);
  };

  // Call to the api to update the user form

  const handlePaste = (e) => {
    // ensures pastes are sent as unformatted plain text
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    window.document.execCommand("insertText", false, text); // WARN: this is deprecated, but nothing else does the same. still widely supported at creation.
    handleKeyUp(); // trim if too long.
  };

  useEffect(() => {
    if (editState) {
      editorRef.current.innerText = topicText;
      setTextLen(topicText.length);

      // initialise cursor at end of text
      const el = editorRef.current;
      const target = el.lastChild || el;
      window.getSelection().removeAllRanges(); // need to run this first otherwise selection will fail with empty text when mouse focus is in element area
      window.getSelection().setPosition(target, target.length);
    }
  }, [editState]);

  return (
    <div className={subject}>
      <h3>{t(`profile_${subject.replace("-", "_")}`)}</h3>
      <div className="profile-text">
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <p
          contentEditable={editState}
          ref={editorRef}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onPaste={handlePaste}
          style={editState ? {} : { display: "none" }}
        />
        {!editState && (
          <p>
            {topicText.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < topicText.split("\n").length - 1 ? <br /> : ""}
              </React.Fragment>
            ))}
          </p>
        )}
        {isSelf && !editState && (
          <button type="button" className="edit" onClick={() => setEditState(true)}>
            <img alt="edit" />
          </button>
        )}
        {isSelf && editState && (
          <div className="buttons">
            <button type="button" className="cancel" onClick={() => setEditState(false)}>
              <img alt="cancel" />
            </button>
            <button type="button" className="save" onClick={saveChange}>
              <img alt="save" />
            </button>
          </div>
        )}
        {editState && (
          <div className="character-limit">
            {textLen}/{maxLen}
          </div>
        )}
      </div>
      {errorText && <div style={{ color: "red" }}>{errorText}</div>}
    </div>
  );
}

/* TODO: the expectations is still the wrong form field */
function ProfileDetail({ profile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { userPk } = location.state || {};
  const isSelf = !userPk;

  // prevent erroring out when empty data sent (due to promise delay?)
  if (!profile) {
    return null;
  }

  return (
    <div className="profile-detail">
      <TextBox subject="about" initialText={profile.about} formTag="description" />
      <ItemsBox selectedChoices={profile.interestTopics} />
      <TextBox
        subject="extra-topics"
        initialText={profile.extraTopics}
        formTag="additional_interests"
      />
      <TextBox
        subject="expectations"
        initialText={profile.expectations}
        formTag="language_skill_description"
      />
      {isSelf && (
        <SectionBox subject="Edit User Form">
          <button
            type="button"
            onClick={() => {
              navigate("/form/");
              navigate(0);
            }}
          >
            Edit User Form
          </button>
        </SectionBox>
      )}
    </div>
  );
}

function Profile({ setCallSetupPartner, userPk }) {
  const { t } = useTranslation();
  const usersData = useSelector((state) => state.userData.users);
  const isSelf = !userPk;

  const profileData = isSelf
    ? usersData.find(({ status }) => status === "self")
    : usersData.find((usr) => usr.userPk === userPk);

  if (!profileData) {
    return null; // don't render unless we have the necessary data
  }

  const profileTitle = isSelf
    ? t("profile_my_profile")
    : t("profile_match_profile", { userName: profileData.firstName });

  return (
    <div className="profile-component">
      <div className="header">
        {!isSelf && (
          <Link to="/" className="back">
            <img alt="back" />
          </Link>
        )}
        <span className="text">{profileTitle}</span>
      </div>
      <div className="content-area-main">
        <ProfileDetail isSelf={isSelf} profile={profileData.extraInfo} />
        <ProfileBox {...profileData} isSelf={isSelf} setCallSetupPartner={setCallSetupPartner} />
      </div>
    </div>
  );
}

export { ProfileBox };
export default Profile;
