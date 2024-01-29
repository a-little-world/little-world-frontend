import {
  Button,
  ButtonAppearance,
  ButtonSizes,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../../../features/userData';
import ButtonsContainer from '../../atoms/ButtonsContainer';
import ModalCard, { ModalTitle } from '../Cards/ModalCard';
import FormStep from '../Form/FormStep';
import { SubmitError } from '../Form/styles';
import ProfilePic from './ProfilePic/ProfilePic';

const ProfileEditor = ({ content, field, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    control, handleSubmit, formState: { errors }, setValue,
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

export default ProfileEditor;