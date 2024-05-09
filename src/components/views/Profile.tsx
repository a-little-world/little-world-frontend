import {
  Modal,
  MultiDropdown,
  Text,
  TextAreaSize,
} from '@a-little-world/little-world-design-system';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { fetchProfile } from '../../api/profile.ts';
import { EDIT_FORM_ROUTE, getAppRoute } from '../../routes';
import {
  ComponentTypes,
  formatDataField,
  getFormComponent,
} from '../../userForm/formContent';
import PageHeader from '../atoms/PageHeader';
import ProfileCard from '../blocks/Cards/ProfileCard';
import Interests from '../blocks/Profile/Interests';
import ProfileDetail from '../blocks/Profile/ProfileDetail';
import ProfileEditor from '../blocks/Profile/ProfileEditor';
import { Details, PageContent, TextField } from '../blocks/Profile/styles';

const getProfileFields = ({ profile, formOptions, t }: { t: TFunction }) => ({
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
  additional_interests: getFormComponent(
    {
      type: ComponentTypes.textArea,
      dataField: 'additional_interests',
      currentValue: profile.additional_interests,
      getProps: () => ({
        size: TextAreaSize.Medium,
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
          options: formatDataField(formOptions?.lang_skill.level, trans),
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
  let { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { userPk } = location.state || {};
  const formOptions = useSelector(state => state.userData.formOptions);
  const [editingField, setEditingField] = useState(null);

  const matches = useSelector(state => state.userData.matches);
  const user = useSelector(state => state.userData.user);
  const isSelf = user?.id === userPk || !userId;
  const dashboardVisibleMatches = matches
    ? [...matches.support.items, ...matches.confirmed.items]
    : [];
  const [profile, setProfile] = useState(
    isSelf
      ? user?.profile
      : dashboardVisibleMatches.find(match => match?.partner?.id === userPk)
          ?.partner,
  );
  const [profileFields, setProfileFields] = useState(
    profile ? getProfileFields({ profile, formOptions, t }) : {},
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

  useEffect(() => {
    if (profile)
      setProfileFields(getProfileFields({ profile, formOptions, t }));
  }, [profile, formOptions]);

  if (isEmpty(profile) || isEmpty(profileFields)) return null;

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
            editable={isSelf}
            content={profileFields.interests}
            setEditingField={setEditingField}
          >
            <Interests
              interests={profile.interests}
              options={formOptions.interests}
            />
          </ProfileDetail>
          <ProfileDetail
            editable={isSelf}
            content={profileFields.additional_interests}
            setEditingField={setEditingField}
          >
            <TextField>{profile.additional_interests}</TextField>
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
          userPk={userPk}
          profile={profile}
          description="" /* don't show description on profile page as it's already shown in full */
          isSelf={isSelf}
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
