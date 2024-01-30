import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  CardSizes,
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
import { mutateUserData } from '../../../api';
import { onFormError } from '../../../helpers/form';

const ProfileEditor = ({ content, field, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    control, getValues, handleSubmit, formState: { errors }, setError, setValue,
  } = useForm();
  const isImage = field === 'image';

  const onFormSuccess = data => {
    console.log({ data })
    dispatch(updateProfile(data));
    onClose();
  };

  const onError = e => {
    onFormError({ e, formFields: getValues(), setError, t });
  };

  const onSave = data => {
    // onFormSuccess({data});
    mutateUserData(data, onFormSuccess, onError);
  };

  const onCancel = () => {
    onClose();
  };

  return (
    <ModalCard size={isImage ? CardSizes.Large : CardSizes.Medium}>
      <ModalTitle>{t(`profile.editor_title_${content.dataField}`)}</ModalTitle>
      <form onSubmit={handleSubmit(onSave)}>
        {isImage ? (
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