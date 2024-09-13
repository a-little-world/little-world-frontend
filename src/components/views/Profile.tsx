import {
  Modal,
  MultiDropdown,
  Tags,
  Text,
  TextAreaSize,
} from '@a-little-world/little-world-design-system';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TFunction, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { fetchUserMatch, mutateUserData } from '../../api/index.js';
import { fetchProfile } from '../../api/profile.ts';
import { USER_TYPES } from '../../constants/index';
import {
  addMatch,
  getMatchByPartnerId,
  updateProfile,
} from '../../features/userData';
import { onFormError } from '../../helpers/form';
import { EDIT_FORM_ROUTE, getAppRoute } from '../../routes.ts';
import {
  ComponentTypes,
  formatDataField,
  getFormComponent,
} from '../../userForm/formContent';
import { constructCheckboxes } from '../../userForm/formPages';
import PageHeader from '../atoms/PageHeader.tsx';
import ProfileCard from '../blocks/Cards/ProfileCard';
import FormStep from '../blocks/Form/FormStep.jsx';
import ProfileDetail from '../blocks/Profile/ProfileDetail';
import ProfileEditor from '../blocks/Profile/ProfileEditor';
import { Details, PageContent, TextField } from '../blocks/Profile/styles';

const getProfileFields = ({
  profile,
  formOptions,
  t,
  isSelf,
  selfAvailability,
}: {
  t: TFunction;
  profile: any;
  formOptions: any;
  isSelf: boolean;
  selfAvailability: any;
}) => ({
  description: getFormComponent(
    {
      type: ComponentTypes.textArea,
      dataField: 'description',
      currentValue: profile.description,
      getProps: (trans: TFunction) => ({
        errorRules: { required: trans('validation.required') },
        size: TextAreaSize.Medium,
      }),
    },
    t,
  ),
  interests: getFormComponent(
    {
      type: ComponentTypes.multiSelection,
      currentValue: profile.interests,
      dataField: 'interests',
      formData: formOptions?.interests,
      getProps: (trans: TFunction) => ({
        label: trans('interests.selection_label'),
        labelTooltip: trans('interests.selection_tooltip'),
      }),
    },
    t,
  ),
  availability: getFormComponent(
    {
      type: ComponentTypes.checkboxGrid,
      dataField: 'availability',
      currentValue: profile?.availability,
      getProps: (trans: TFunction) => ({
        label: trans('availability.label'),
        labelTooltip: trans('availability.tooltip'),
        columnHeadings: Array(8)
          .fill()
          .map((_, index) => trans(`availability.column${index + 1}`)),
        rowHeadings: Array(7)
          .fill()
          .map((_, index) => trans(`availability.row${index + 1}`)),
        checkboxesByColumn: constructCheckboxes(
          formOptions?.availability,
          trans,
        ),
        preSelected: profile?.availability,
        readOnly: !isSelf,
        highlightCells: isSelf ? undefined : selfAvailability,
        legendText: trans('availability.legend_text'),
      }),
    },
    t,
  ),
  lang_skill: getFormComponent(
    {
      type: ComponentTypes.multiDropdown,
      dataField: 'lang_skill',
      currentValue: profile.lang_skill,
      getProps: (trans: TFunction) => ({
        addMoreLabel: trans('self_info.language_add_more'),
        label: trans('self_info.language_skills_label'),
        labelTooltip: trans('self_info.language_skills_tooltip'),
        maxSegments: 8,
        firstDropdown: {
          dataField: 'lang',
          ariaLabel: trans('self_info.language_selector_label'),
          placeholder: trans('self_info.language_selector_placeholder'),
          options: formatDataField(formOptions?.lang_skill.lang, trans),
          values: profile?.lang_skill?.map(el => el.lang),
          lockedValue: 'german',
          errors: [],
        },
        secondDropdown: {
          dataField: 'level',
          ariaLabel: trans('self_info.language_level_label'),
          placeholder: trans('self_info.language_level_placeholder'),
          options: formatDataField(
            formOptions?.lang_skill.level.slice(
              profile?.user_type === USER_TYPES.volunteer ? 3 : 0,
            ),
            trans,
          ),
          values: profile?.lang_skill?.map(el => el.level),
          errors: [],
        },
      }),
    },
    t,
  ),
});

function Profile() {
  const { t } = useTranslation();
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { control, getValues, handleSubmit, setError, watch } = useForm();

  const formOptions = useSelector(state => state.userData.formOptions);
  const [editingField, setEditingField] = useState(null);

  const match = useSelector(state =>
    getMatchByPartnerId(state.userData.matches, userId),
  );

  const user = useSelector(state => state.userData.user);
  const isSelf = user?.id === userId || !userId;

  const [profile, setProfile] = useState(
    isSelf ? user?.profile : match?.partner,
  );
  const [profileFields, setProfileFields] = useState(
    profile
      ? getProfileFields({
          profile,
          formOptions,
          t,
          isSelf,
          selfAvailability: user?.profile?.availability,
        })
      : {},
  );

  useEffect(() => {
    if (!isSelf && !profile) {
      fetchProfile({ userId })
        .then(data => {
          setProfile(data.match.partner);
        })
        .catch(error => {
          throw error;
        });
    }
  }, []);

  const profileTitle = isSelf
    ? t('profile.self_profile_title')
    : t('profile.match_profile_title', { userName: profile?.first_name });

  const onError = e => {
    onFormError({ e, formFields: getValues(), setError });
  };

  const onFormSuccess = response => {
    dispatch(updateProfile(response));
  };

  const onFormSubmit = data => {
    mutateUserData(data, onFormSuccess, onError);
  };

  useEffect(() => {
    setProfile(isSelf ? user?.profile : match?.partner);
  }, [isSelf, user]);

  useEffect(() => {
    if (profile)
      setProfileFields(
        getProfileFields({
          profile,
          formOptions,
          t,
          isSelf,
          selfAvailability: user?.profile?.availability,
        }),
      );
  }, [profile, formOptions]);

  useEffect(() => {
    const subscription = watch(() => handleSubmit(onFormSubmit)());
    return () => subscription.unsubscribe();
  }, [handleSubmit, watch]);

  useEffect(() => {
    if (!isSelf && !match) {
      fetchUserMatch({ userId }).then(res => {
        dispatch(addMatch(res));
      });
    }
  }, [isSelf, match, userId, dispatch]);

  if (isEmpty(profile) || isEmpty(profileFields)) return null;

  const selectedInterests = formOptions?.interests
    ?.filter(option => profile.interests.includes(option.value))
    .map(interest => t(interest.tag));

  return (
    <>
      <PageHeader canGoBack={!isSelf} text={profileTitle} />
      <PageContent>
        <Details>
          <ProfileDetail
            editable={isSelf}
            content={profileFields.description}
            setEditingField={setEditingField}
          >
            <TextField>{profile.description}</TextField>
          </ProfileDetail>
          <ProfileDetail
            editable={false}
            content={profileFields.availability}
            setEditingField={setEditingField}
          >
            <FormStep control={control} content={profileFields.availability} />
          </ProfileDetail>
          <ProfileDetail
            editable={isSelf}
            content={profileFields.interests}
            setEditingField={setEditingField}
          >
            <Tags content={selectedInterests} />
          </ProfileDetail>
          <ProfileDetail
            editable={isSelf}
            content={profileFields.lang_skill}
            setEditingField={setEditingField}
          >
            {profile.lang_skill?.length ? (
              <MultiDropdown
                {...profileFields.lang_skill}
                locked
                label={undefined}
              />
            ) : (
              <Text>
                {t(`profile.lang_skill${isSelf ? '_self' : ''}_undefined`)}
              </Text>
            )}
          </ProfileDetail>
        </Details>
        <ProfileCard
          chatId={match?.chatId}
          userPk={userId}
          profile={profile}
          isSelf={isSelf}
          onProfile
          openEditImage={() =>
            navigate(getAppRoute(`${EDIT_FORM_ROUTE}/picture`))
          }
        />
      </PageContent>
      <Modal open={!!editingField} onClose={() => setEditingField(null)}>
        <ProfileEditor
          onClose={() => setEditingField(null)}
          field={editingField}
          content={profileFields[editingField]}
        />
      </Modal>
    </>
  );
}

export default Profile;
