import {
  Button,
  ButtonTypes,
  Card,
  designTokens,
  DotsIcon,
  Popover,
  Text,
} from "@a-little-world/little-world-design-system";
import { PopoverSizes } from "@a-little-world/little-world-design-system/dist/esm/components/Popover/Popover";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import { postUserProfileUpdate } from "./api";
import ProfileImage from "./components/atoms/ProfileImage";
import {
  PARTNER_ACTION_REPORT,
  PARTNER_ACTION_UNMATCH,
} from "./components/blocks/PartnerActionCard";
import { updateProfile } from "./features/userData";
import "./i18n";
import Link from "./path-prepend";

import "./profile.css";

const ProfileCard = styled(Card)`
  align-items: center;
`;

const ProfileInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  ${({ theme }) => `
  gap: ${theme.spacing.small};
  margin-bottom: ${theme.spacing.xsmall};
  `};
`;

const MatchMenuToggle = styled(Button)`
  position: absolute;

  ${({ theme }) => `
  padding: ${theme.spacing.xxxsmall} ${theme.spacing.xxsmall};
  top: ${theme.spacing.small};
  right: ${theme.spacing.small};
  `};
`;

const PartnerMenuOption = styled(Button)`
  font-size: 1rem;
  font-weight: normal;
  justify-content: flex-start;
  padding: ${({ theme }) => theme.spacing.xxsmall};

  &:not(:last-of-type) {
    margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
  }
`;

function ProfileBox({
  avatarCfg,
  description,
  firstName,
  imgSrc,
  isOnline,
  lastName,
  openPartnerModal,
  setCallSetupPartner,
  type,
  userPk,
  usesAvatar,
}) {
  const { t } = useTranslation();
  if (type === "self") {
    isOnline = true;
  }

  return (
    <ProfileCard className={type === "unconfirmed" ? "profile-box new-match" : "profile-box"}>
      <ProfileImage
        image={usesAvatar ? avatarCfg : imgSrc}
        imageType={usesAvatar ? "avatar" : "image"}
      />
      {type === "match" && (
        <Popover
          width={PopoverSizes.Large}
          showCloseButton
          trigger={
            <MatchMenuToggle type="button" variation={ButtonTypes.Icon}>
              <DotsIcon
                circular
                height="16px"
                width="16px"
                color={designTokens.color.theme.light.text.tertiary}
              />
            </MatchMenuToggle>
          }
        >
          <PartnerMenuOption
            variation={ButtonTypes.Inline}
            onClick={() =>
              openPartnerModal({ type: PARTNER_ACTION_REPORT, userPk, userName: firstName })
            }
          >
            {t("cp_menu_report")}
          </PartnerMenuOption>
          <PartnerMenuOption
            variation={ButtonTypes.Inline}
            onClick={() =>
              openPartnerModal({ type: PARTNER_ACTION_UNMATCH, userPk, userName: firstName })
            }
          >
            {t("cp_menu_unmatch")}
          </PartnerMenuOption>
        </Popover>
      )}
      <div className={isOnline ? "online-indicator online" : "online-indicator"}>
        online <span className="light" />
      </div>
      <ProfileInfo className="profile-info">
        <Text className="name">{`${firstName} ${lastName}`}</Text>
        <Text className="text">{description}</Text>
      </ProfileInfo>
      {type !== "self" && (
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
    </ProfileCard>
  );
}

function InterestsSelector({ inTopicSelection }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const interestChoices = useSelector((state) => state.userData.apiOptions.profile.interests);
  const [topicSelection, setTopicSelection] = useState(inTopicSelection);

  const [editing, setEditing] = useState(false);
  const [errorText, setErrorText] = useState("");

  const location = useLocation();
  const { userPk } = location.state || {};
  const isSelf = !userPk;

  const toggleInterest = (topicValue) => {
    const newSelection = topicSelection.includes(topicValue)
      ? topicSelection.filter((item) => item !== topicValue) // remove item
      : [...topicSelection, topicValue]; // add item

    setTopicSelection(() => newSelection);
  };

  const saveTopics = () => {
    postUserProfileUpdate(
      { interests: topicSelection },
      (errorTags) => {
        const errorTextStr = errorTags.map((e) => t(e)).join(", ");
        setErrorText(errorTextStr);
        setEditing(false);
      },
      () => {
        dispatch(updateProfile({ interestTopics: topicSelection }));
        setEditing(false);
      },
      "interests"
    );
  };

  const cancelTopics = () => {
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
        {topicSelection.map((interest) => {
          const topicOptions = interestChoices.filter((c) => c.value === interest)[0];
          return (
            <div key={topicOptions.value} className="interest-item">
              <span className="text">{t(topicOptions.tag)}</span>
            </div>
          );
        })}
        <div className={editing ? "overlay-shade" : "overlay-shade hidden"}>
          {editing && (
            <div className="topics-selector modal-box">
              <button type="button" className="modal-close" onClick={cancelTopics} />
              <h3>{t("profile_choose_interests")}</h3>
              <div className="items">
                {interestChoices.map((choice) => (
                  <button
                    key={choice.value}
                    type="button"
                    className={
                      topicSelection.includes(choice.value)
                        ? "interest-item selected-item"
                        : "interest-item"
                    }
                    onClick={() => toggleInterest(choice.value)}
                  >
                    <span className="text">{t(choice.tag)}</span>
                  </button>
                ))}
              </div>
              <div className="buttons">
                <button type="button" className="save" onClick={saveTopics}>
                  {t("btn_save")}
                </button>
                <button type="button" className="cancel" onClick={cancelTopics}>
                  {t("btn_cancel")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {errorText && <div style={{ color: "red" }}>{errorText}</div>}
    </div>
  );
}

function TextBox({ subject, topicText = "", formTag }) {
  const { t } = useTranslation();
  const location = useLocation();
  const editorRef = useRef();
  const [editState, setEditState] = useState(false);
  const dispatch = useDispatch();

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
      (tag) => {
        setErrorText(t(tag));
        setEditState(false);
      },
      () => {
        dispatch(updateProfile({ [subject]: text }));
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
    if (e.ctrlKey) {
      return; // allow ctrl + anything
    }
    if (allowedCodes.includes(e.keyCode)) {
      return; // don't calculate length if not necessary
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
              <img alt={t("btn_cancel")} />
            </button>
            <button type="button" className="save" onClick={saveChange}>
              <img alt={t("btn_save")} />
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
  // prevent erroring out when empty data sent (due to promise delay?)
  if (!profile) {
    return null;
  }

  return (
    <div className="profile-detail">
      <TextBox subject="about" topicText={profile.about} formTag="description" />
      <InterestsSelector inTopicSelection={profile.interestTopics} />
      <TextBox
        subject="extra_topics"
        topicText={profile.extraTopics}
        formTag="additional_interests"
      />
      <TextBox
        subject="expectations"
        topicText={profile.expectations}
        formTag="language_skill_description"
      />
    </div>
  );
}

function Profile({ setCallSetupPartner, userPk }) {
  const { t } = useTranslation();
  const usersData = useSelector((state) => state.userData.users);
  const isSelf = !userPk;

  const user = isSelf
    ? usersData.find(({ type }) => type === "self")
    : usersData.find((usr) => usr.userPk === userPk);

  if (!user) {
    return null; // don't render unless we have the necessary data
  }

  const profileTitle = isSelf
    ? t("profile_my_profile")
    : t("profile_match_profile", { userName: user.firstName });

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
        <ProfileDetail isSelf={isSelf} profile={user.extraInfo} />
        <ProfileBox
          {...user}
          description="" /* don't show description on profile page as it's already shown in full */
          isSelf={isSelf}
          setCallSetupPartner={setCallSetupPartner}
        />
      </div>
    </div>
  );
}

export { ProfileBox };
export default Profile;
