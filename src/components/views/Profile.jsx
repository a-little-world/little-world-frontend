import {
  Button,
  ButtonVariations,
  MultiSelection,
  PencilIcon,
  Text,
  TextArea,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { current } from '@reduxjs/toolkit';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { postUserProfileUpdate } from '../../api';
import { updateProfile } from '../../features/userData';
import { formatMultiSelectionOptions, registerInput } from '../../helpers/form';
import '../../i18n';
import Link from '../../path-prepend';
import { getAppRoute } from '../../routes';
import {
  EditButton,
  Field,
  FieldTitle,
  ProfileSection,
} from './Profile.styles';
import './profile.css';

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
    <ProfileSection>
      <Text tag="h3" type={TextTypes.Heading2}>
        {t('profile_topics')}
      </Text>
      <div className="selected-topics">
        {isSelf && (
          <EditButton
            variation={ButtonVariations.Icon}
            onClick={() => setEditing(true)}
          >
            <PencilIcon
              label="edit interests button"
              labelId="edit-interests-btn"
            />
          </EditButton>
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
        {/* <MultiSelection
          onSelection={null}
          preSelected={topicSelection}
          options={formatMultiSelectionOptions({ data: interestChoices, t })}
        /> */}

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
    </ProfileSection>
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
    <ProfileSection className={subject}>
      <Text tag="h3">{t(`profile_${subject.replace('-', '_')}`)}</Text>
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
          <EditButton
            variation={ButtonVariations.Icon}
            onClick={() => setEditState(true)}
          >
            <PencilIcon
              label="edit interests button"
              labelId="edit-interests-btn"
            />
          </EditButton>
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
    </ProfileSection>
  );
}

const ProfileDetail = ({ children, currentValue, editable, field }) => {
  const { t } = useTranslation();
  const {
    control,
    getValues,
    register,
    handleSubmit,
    formState: { errors },
    resetField,
    setError,
    setFocus,
    watch,
  } = useForm({ defaultValues: { [field]: currentValue } });
  const [editorOpen, setEditorOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const watchField = watch(field);
  console.log({ watchField });

  useEffect(() => {
    if (watchField !== currentValue) setIsEditing(true);
  }, [watchField, setIsEditing]);

  const onSave = data => {
    dispatch(updateProfile({ [field]: data }));
    setIsEditing(false);
  };

  const onCancel = () => {
    setIsEditing(false);
    resetField(field);
  };

  return (
    <ProfileSection>
      <FieldTitle tag="h3" type={TextTypes.Body2} bold>
        {t(`profile.${field}_title`)}
      </FieldTitle>
      <Field>
        {editable && (
          <EditButton
            variation={ButtonVariations.Icon}
            onClick={() => setEditorOpen(true)}
          >
            <PencilIcon
              label="edit interests button"
              labelId="edit-interests-btn"
            />
          </EditButton>
        )}
        <form onSubmit={onSave}>
          <TextArea
            {...registerInput({
              register,
              name: field,
              options: { required: 'error.required' },
            })}
            error={t(errors?.[field]?.message)}
          />
          {isEditing && (
            <>
              <Button onClick={onCancel}>{t('profile.cancel_btn')}</Button>
              <Button type="submit">{t('profile.save_btn')}</Button>
            </>
          )}
        </form>
      </Field>
    </ProfileSection>
  );
};

function Profile({ setCallSetupPartner, isSelf, profile, userPk }) {
  const { t } = useTranslation();
  // const location = useLocation();

  // const { userPk } = location.state || {};
  // const isSelf = !userPk;

  const profileTitle = isSelf
    ? t('profile.self_profile_title')
    : t('profile.match_profile_title', { userName: profile.first_name });

  return (
    <div className="profile-component">
      <div className="header">
        {!isSelf && (
          <Link to={getAppRoute()} className="back">
            <img alt="back button" />
          </Link>
        )}
        <span className="text">{profileTitle}</span>
      </div>
      <div className="content-area-main">
        <div className="profile-detail">
          <ProfileDetail
            field="description"
            currentValue={profile.description}
          />
          <InterestsSelector inTopicSelection={profile.interests} />
          <ProfileDetail
            field="additional_interests"
            currentValue={profile.additional_interests}
          />
          <TextBox
            subject="expectations"
            topicText={profile.language_skill_description}
            formTag="language_skill_description"
          />
        </div>
        <ProfileSection
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
