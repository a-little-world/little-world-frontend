import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  Modal,
  MultiDropdown,
  PencilIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';

import { postUserProfileUpdate } from '../../api';
import { updateProfile } from '../../features/userData';
import '../../i18n';
import {
  ComponentTypes,
  formatDataField,
  getFormComponent,
} from '../../userForm/formContent';
import ButtonsContainer from '../atoms/ButtonsContainer';
import PageHeader from '../atoms/PageHeader';
import ModalCard, { ModalTitle } from '../blocks/Cards/ModalCard';
import ProfileCard from '../blocks/Cards/ProfileCard';
import FormStep from '../blocks/Form/FormStep';
import { SubmitError } from '../blocks/Form/styles';
import ProfilePic from '../blocks/ProfilePic/ProfilePic';
import {
  Details,
  EditButton,
  Field,
  FieldTitle,
  ProfileSection,
} from './Profile.styles';
import './profile.css';

const PageContent = styled.section`
  display: flex;
  flex-direction: column-reverse;
  gap: ${({ theme }) => theme.spacing.medium};
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing.small};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: 0;
    }
    @media (min-width: ${theme.breakpoints.large}) {
      flex-direction: row;
    }
  `};
`;

const Interest = styled.div`
  font-family: 'Signika Negative';
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.color.surface.primary};
  border-radius: 10px;
  box-shadow: 0px 1px 5px rgb(0 0 0 / 30%);
  border-radius: 1000px;
  border: 2px solid ${({ theme }) => theme.color.border.selected};
  color: ${({ theme }) => theme.color.text.primary};
  padding: ${({ theme }) =>
    `${theme.spacing.xxxsmall} ${theme.spacing.xsmall}`};
  min-width: 60px;
  height: 33px;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.small}) {
      padding: ${theme.spacing.xxsmall} ${theme.spacing.small};
      min-width: 80px;
      height: 45px;
    }
  `}
`;

const InterestsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xsmall};
  padding-top: ${({ theme }) => theme.spacing.xxxsmall};
`;

function Interests({ interests, options }) {
  const { t } = useTranslation();
  const selected = options.filter(option => interests.includes(option.value));

  return (
    <InterestsContainer>
      {selected.map(interest => (
        <Interest key={interest.value} className="interest-item">
          <Text tag="span">{t(interest.tag)}</Text>
        </Interest>
      ))}
    </InterestsContainer>
  );
}

const TextField = styled.div`
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: 15px;
  background: ${({ theme }) => theme.color.surface.disabled};
  // box-shadow: 0px 1px 5px rgb(0 0 0 / 30%);
  padding: ${({ theme }) => theme.spacing.small};
`;

const ProfileDetail = ({
  content,
  children,
  editable = true,
  setEditingField,
}) => {
  const { t } = useTranslation();

  return (
    <ProfileSection>
      <FieldTitle tag="h3" type={TextTypes.Body3} bold>
        {t(`profile.${content.dataField}_title`)}
      </FieldTitle>
      <Field>
        {editable && (
          <EditButton
            variation={ButtonVariations.Icon}
            onClick={() => setEditingField(content.dataField)}
          >
            <PencilIcon
              label="edit interests button"
              labelId="edit-interests-btn"
              width="16"
              height="16"
              circular
            />
          </EditButton>
        )}
        {children}
      </Field>
    </ProfileSection>
  );
};

const ProfileEditor = ({ content, field, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const onSave = data => {
    dispatch(updateProfile(data));
    onClose();
  };

  const onCancel = () => {
    onClose();
  };

  return (
    <ModalCard>
      <ModalTitle>{t(`profile.editor_title_${content.dataField}`)}</ModalTitle>
      <form onSubmit={handleSubmit(onSave)}>
        {field === 'image' ? (
          <ProfilePic control={control} setValue={setValue} />
        ) : (
          <FormStep control={control} content={content} />
        )}
        <SubmitError $visible={errors?.root?.serverError}>
          {errors?.root?.serverError?.message}
        </SubmitError>
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
      </form>
    </ModalCard>
  );
};

function Profile({ setCallSetupPartner, isSelf, profile, userPk }) {
  const { t } = useTranslation();
  const formOptions = useSelector(state => state.userData.formOptions);
  const [editingField, setEditingField] = useState(null);

  const profileTitle = isSelf
    ? t('profile.self_profile_title')
    : t('profile.match_profile_title', { userName: profile.first_name });

  const profileFields = {
    description: getFormComponent(
      {
        type: ComponentTypes.textArea,
        dataField: 'description',
        currentValue: profile.description,
        getProps: trans => ({
          errorRules: { required: trans('validation.required') },
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
    }),
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
  };

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
