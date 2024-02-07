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
import styled from 'styled-components';

import { mutateUserData } from '../../../api';
import { updateProfile } from '../../../features/userData';
import { onFormError } from '../../../helpers/form';
import ModalCard, { ModalTitle } from '../Cards/ModalCard';
import FormStep from '../Form/FormStep';
import { FormButtons, SubmitError } from '../Form/styles';

const EditorForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

const EditorTitle = styled(ModalTitle)`
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const ProfileEditor = ({ content, field, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const isImage = field === 'image';

  const onFormSuccess = data => {
    dispatch(updateProfile(data));
    onClose();
  };

  const onError = e => {
    onFormError({ e, formFields: getValues(), setError, t });
  };

  const onSave = data => {
    mutateUserData(data, onFormSuccess, onError);
  };

  const onCancel = () => {
    onClose();
  };

  return (
    <ModalCard size={isImage ? CardSizes.Large : CardSizes.Medium}>
      <EditorForm onSubmit={handleSubmit(onSave)}>
        <EditorTitle>
          {t(`profile.editor_title_${content.dataField}`)}
        </EditorTitle>
        <FormStep control={control} content={content} />
        <SubmitError $visible={errors?.root?.serverError}>
          {errors?.root?.serverError?.message}
        </SubmitError>
        <FormButtons>
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
        </FormButtons>
      </EditorForm>
    </ModalCard>
  );
};

export default ProfileEditor;
