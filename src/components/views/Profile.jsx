import {
  Modal,
  MultiDropdown,
  Text,
  TextAreaSize,
} from '@a-little-world/little-world-design-system';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import '../../i18n';
import {
  ComponentTypes,
  formatDataField,
  getFormComponent,
} from '../../userForm/formContent';
import PageHeader from '../atoms/PageHeader';
import ProfileCard from '../blocks/Cards/ProfileCard';
import {
  Details,
  PageContent,
  TextField,
} from '../blocks/Profile/styles';
import Interests from '../blocks/Profile/Interests';
import ProfileEditor from '../blocks/Profile/ProfileEditor';
import ProfileDetail from '../blocks/Profile/ProfileDetail';

const getProfileFields = ({ profile, formOptions, t}) => ({
  description: getFormComponent(
    {
      type: ComponentTypes.textArea,
      dataField: 'description',
      currentValue: profile.description,
      getProps: trans => ({
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
      getProps: trans => ({
        label: trans('interests.selection_label'),
        labelTooltip: trans('interests.selection_tooltip'),
      }),
    },
    t,
  ),
  additional_interests: getFormComponent({
    type: ComponentTypes.textArea,
    dataField: 'additional_interests',
    currentValue: profile.additional_interests,
    getProps: () => ({
      size: TextAreaSize.Medium,
    }),
  }, t),
  lang_skill: getFormComponent(
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
  image: {
    dataField: 'image',
  },
})

function Profile({ setCallSetupPartner, isSelf, profile, userPk }) {
  const { t } = useTranslation();
  const formOptions = useSelector(state => state.userData.formOptions);
  const [editingField, setEditingField] = useState(null);
  const [profileFields, setProfileFields] = useState(getProfileFields({ profile, formOptions, t}));

  const profileTitle = isSelf
    ? t('profile.self_profile_title')
    : t('profile.match_profile_title', { userName: profile.first_name });

  useEffect(() => {
    setProfileFields(getProfileFields({ profile, formOptions, t}));
  }, [profile, formOptions])

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
                Add your language skills now so we can provide you with the best
                possible match
              </Text>
            )}
          </ProfileDetail>
        </Details>
        <ProfileCard
          userPk={userPk}
          profile={profile}
          description="" /* don't show description on profile page as it's already shown in full */
          isSelf={isSelf}
          setCallSetupPartner={setCallSetupPartner}
          openEditImage={() => setEditingField('image')}
        />
      </PageContent>
      <Modal open={editingField} onClose={() => setEditingField(null)}>
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
