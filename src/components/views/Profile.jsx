import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  MultiSelection,
  PencilIcon,
  Text,
  TextArea,
  TextTypes,
} from '@a-little-world/little-world-design-system';
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
  ComponentTypes,
  formatDataField,
  getFormComponent,
} from '../../userForm/formContent';
import ButtonsContainer from '../atoms/ButtonsContainer';
import ProfileCard from '../blocks/Cards/ProfileCard';
import FormStep from '../blocks/Form/FormStep';
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

const ProfileDetail = ({ content, editable }) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    resetField,
    setError,
    setFocus,
    watch,
  } = useForm({ defaultValues: { [content.dataField]: content.currentValue } });
  const [editorOpen, setEditorOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const watchField = watch(content.dataField);
  console.log({ watchField });

  useEffect(() => {
    if (watchField !== content.currentValue) setIsEditing(true);
  }, [watchField, setIsEditing]);

  const onSave = data => {
    dispatch(updateProfile({ [content.dataField]: data }));
    setIsEditing(false);
  };

  const onCancel = () => {
    setIsEditing(false);
    resetField(content.dataField);
  };

  return (
    <ProfileSection>
      <FieldTitle tag="h3" type={TextTypes.Body2} bold>
        {t(`profile.${content.dataField}_title`)}
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
        <form onSubmit={handleSubmit(onSave)}>
          <FormStep control={control} content={content} />
          {isEditing && (
            <ButtonsContainer>
              <Button
                appearance={ButtonAppearance.Secondary}
                onClick={onCancel}
                size={ButtonSizes.Small}
              >
                {t('profile.cancel_btn')}
              </Button>
              <Button type="submit" size={ButtonSizes.Small}>
                {t('profile.save_btn')}
              </Button>
            </ButtonsContainer>
          )}
        </form>
      </Field>
    </ProfileSection>
  );
};

function Profile({ setCallSetupPartner, isSelf, profile, userPk }) {
  const { t } = useTranslation();
  const formOptions = useSelector(state => state.userData.formOptions);

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
            content={getFormComponent(
              {
                type: ComponentTypes.textArea,
                dataField: 'description',
                currentValue: profile.description,
                getProps: trans => ({
                  errorRules: { required: trans('validation.required') },
                }),
              },
              t,
            )}
          />
          <ProfileDetail
            content={getFormComponent(
              {
                type: ComponentTypes.multiSelection,
                currentValue: profile.interests,
                dataField: 'interests',
                formData: formOptions?.interests,
                getProps: trans => ({
                  label: trans('interests.selection_label'),
                  labelTooltip: trans('interests.selection_tooltip'),
                }),
              },
              t,
            )}
          />
          <ProfileDetail
            content={getFormComponent({
              type: ComponentTypes.textArea,
              dataField: 'additional_interests',
              currentValue: profile.additional_interests,
            })}
          />
          <ProfileDetail
            content={getFormComponent(
              {
                type: ComponentTypes.multiDropdown,
                dataField: 'lang_skill',
                currentValue: profile.lang_skill,
                getProps: trans => ({
                  addMoreLabel: trans('self_info.language_add_more'),
                  label: trans('self_info.language_skills_label'),
                  labelTooltip: trans('self_info.language_skills_tooltip'),
                  firstDropdown: {
                    dataField: 'lang',
                    ariaLabel: trans('self_info.language_selector_label'),
                    placeholder: trans(
                      'self_info.language_selector_placeholder',
                    ),
                    options: formatDataField(
                      formOptions?.lang_skill.lang,
                      trans,
                    ),
                    values: profile?.lang_skill?.map(el => el.lang),
                    lockedValue: 'german',
                    errors: [],
                  },
                  secondDropdown: {
                    dataField: 'level',
                    ariaLabel: trans('self_info.language_level_label'),
                    placeholder: trans('self_info.language_level_placeholder'),
                    options: formatDataField(
                      formOptions?.lang_skill.level,
                      trans,
                    ),
                    values: profile?.lang_skill?.map(el => el.level),
                    errors: [],
                  },
                }),
              },
              t,
            )}
          />
        </div>
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
