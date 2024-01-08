import { postUserProfileUpdate } from '../../api';
import { updateProfile } from '../../features/userData';
import '../../i18n';
import Link from '../../path-prepend';
import { getAppRoute } from '../../routes';
import ProfileCard from '../blocks/Cards/ProfileCard';
import './profile.css';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

function InterestsSelector({ inTopicSelection }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const interestChoices = useSelector(
    state => state.userData.apiOptions.profile.interests,
  );
  const [topicSelection, setTopicSelection] = useState(inTopicSelection);

  const [editing, setEditing] = useState(false);
  const [errorText, setErrorText] = useState('');

  const location = useLocation();
  const { userPk } = location.state || {};
  const isSelf = !userPk;

  const toggleInterest = topicValue => {
    const newSelection = topicSelection.includes(topicValue)
      ? topicSelection.filter(item => item !== topicValue) // remove item
      : [...topicSelection, topicValue]; // add item

    setTopicSelection(() => newSelection);
  };

  const saveTopics = () => {
    postUserProfileUpdate(
      { interests: topicSelection },
      errorTags => {
        const errorTextStr = errorTags.map(e => t(e)).join(', ');
        setErrorText(errorTextStr);
        setEditing(false);
      },
      () => {
        dispatch(updateProfile({ interests: topicSelection }));
        setEditing(false);
      },
      'interests',
    );
  };

  const cancelTopics = () => {
    setEditing(false);
  };

  return (
    <div className="topics">
      <h3>{t('profile_topics')}</h3>
      <div className="selected-topics">
        {isSelf && (
          <button
            type="button"
            className="edit"
            onClick={() => setEditing(true)}
          >
            <img alt="edit" />
          </button>
        )}
        {topicSelection.map(interest => {
          const topicOptions = interestChoices.filter(
            c => c.value === interest,
          )[0];
          return (
            <div key={topicOptions.value} className="interest-item">
              <span className="text">{t(topicOptions.tag)}</span>
            </div>
          );
        })}
        <div className={editing ? 'overlay-shade' : 'overlay-shade hidden'}>
          {editing && (
            <div className="topics-selector modal-box">
              <button
                type="button"
                className="modal-close"
                onClick={cancelTopics}
              />
              <h3>{t('profile_choose_interests')}</h3>
              <div className="items">
                {interestChoices.map(choice => (
                  <button
                    key={choice.value}
                    type="button"
                    className={
                      topicSelection.includes(choice.value)
                        ? 'interest-item selected-item'
                        : 'interest-item'
                    }
                    onClick={() => toggleInterest(choice.value)}
                  >
                    <span className="text">{t(choice.tag)}</span>
                  </button>
                ))}
              </div>
              <div className="buttons">
                <button type="button" className="save" onClick={saveTopics}>
                  {t('btn_save')}
                </button>
                <button type="button" className="cancel" onClick={cancelTopics}>
                  {t('btn_cancel')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {errorText && <div style={{ color: 'red' }}>{errorText}</div>}
    </div>
  );
}

function TextBox({ subject, topicText = '', formTag }) {
  const { t } = useTranslation();
  const location = useLocation();
  const editorRef = useRef();
  const [editState, setEditState] = useState(false);
  const dispatch = useDispatch();

  const [errorText, setErrorText] = useState(''); // TODO: maybe if error add a reload button that loads the old default of this field
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
      .replaceAll('<div><br></div>', '<br>')
      .replace('<div>', '<br>')
      .replace('</div>', '');
    const text = editorRef.current.innerText;
    postUserProfileUpdate(
      { [formTag]: text },
      tag => {
        setErrorText(t(tag));
        setEditState(false);
      },
      () => {
        dispatch(updateProfile({ [formTag]: text }));
        setEditState(false);
      },
      formTag,
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

  const handleKeyDown = e => {
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

  const handlePaste = e => {
    // ensures pastes are sent as unformatted plain text
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    window.document.execCommand('insertText', false, text); // WARN: this is deprecated, but nothing else does the same. still widely supported at creation.
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
      <h3>{t(`profile_${subject.replace('-', '_')}`)}</h3>
      <div className="profile-text">
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <p
          contentEditable={editState}
          ref={editorRef}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onPaste={handlePaste}
          style={editState ? {} : { display: 'none' }}
        />
        {!editState && (
          <p>
            {topicText.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < topicText.split('\n').length - 1 ? <br /> : ''}
              </React.Fragment>
            ))}
          </p>
        )}
        {isSelf && !editState && (
          <button
            type="button"
            className="edit"
            onClick={() => setEditState(true)}
          >
            <img alt="edit" />
          </button>
        )}
        {isSelf && editState && (
          <div className="buttons">
            <button
              type="button"
              className="cancel"
              onClick={() => setEditState(false)}
            >
              <img alt={t('btn_cancel')} />
            </button>
            <button type="button" className="save" onClick={saveChange}>
              <img alt={t('btn_save')} />
            </button>
          </div>
        )}
        {editState && (
          <div className="character-limit">
            {textLen}/{maxLen}
          </div>
        )}
      </div>
      {errorText && <div style={{ color: 'red' }}>{errorText}</div>}
    </div>
  );
}

function ProfileDetail({ profile }) {
  // prevent erroring out when empty data sent (due to promise delay?)
  if (!profile) {
    return null;
  }

  return (
    <div className="profile-detail">
      <TextBox
        subject="about"
        topicText={profile.description}
        formTag="description"
      />
      <InterestsSelector inTopicSelection={profile.interests} />
      <TextBox
        subject="extra_topics"
        topicText={profile.additional_interests}
        formTag="additional_interests"
      />
      <TextBox
        subject="expectations"
        topicText={profile.language_skill_description}
        formTag="language_skill_description"
      />
    </div>
  );
}

function Profile({ setCallSetupPartner, isSelf, profile, userPk }) {
  const { t } = useTranslation();

  const profileTitle = isSelf
    ? t('profile_my_profile')
    : t('profile_match_profile', { userName: profile.first_name });

  return (
    <div className="profile-component">
      <div className="header">
        {!isSelf && (
          <Link to={getAppRoute('')} className="back">
            <img alt="back button" />
          </Link>
        )}
        <span className="text">{profileTitle}</span>
      </div>
      <div className="content-area-main">
        <ProfileDetail isSelf={isSelf} profile={profile} />
        <ProfileCard
          userPk={userPk}
          profile={profile}
          description="" /* don't show description on profile page as it's already shown in full */
          isSelf={isSelf}
          setCallSetupPartner={setCallSetupPartner}
        />
      </div>
    </div>
  );
}

export default Profile;
