import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  Link,
  TextInput,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';

import { setNewEmail } from '../../api';
import { updateEmail } from '../../features/userData';
import { VERIFY_EMAIL_ROUTE, getAppRoute } from '../../routes';
import ButtonsContainer from '../atoms/ButtonsContainer';
import FormMessage, { MessageTypes } from '../atoms/FormMessage';
import { registerInput } from './SignUp';
import {
  FormDescription,
  StyledCard,
  StyledForm,
  Title,
} from './SignUp.styles';

const ChangeEmail = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setFocus,
  } = useForm({ shouldUnregister: true });

  const navigate = useNavigate();

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const onError = e => {
    setIsSubmitting(false);

    if (e?.message) {
      setError(
        e.cause ?? 'root.serverError',
        { type: 'custom', message: t(e.message) },
        { shouldFocus: true },
      );
    } else {
      setError('root.serverError', {
        type: 'custom',
        message: t(e?.message) || t('validation.generic_try_again'),
      });
    }
  };

  const onFormSubmit = async ({ email }) => {
    setIsSubmitting(true);

    setNewEmail({ email })
      .then(() => {
        setIsSubmitting(false);
        dispatch(updateEmail(email));
        navigate(getAppRoute(VERIFY_EMAIL_ROUTE));
      })
      .catch(onError);
  };

  return (
    <StyledCard>
      <Title tag="h2" type={TextTypes.Heading2}>
        {t('change_email.title')}
      </Title>
      <FormDescription>{t('change_email.description')}</FormDescription>
      <StyledForm onSubmit={handleSubmit(onFormSubmit)}>
        <TextInput
          {...registerInput({
            register,
            name: 'email',
            options: { required: t('error.required') },
          })}
          id="email"
          label={t('change_email.input_label')}
          error={errors?.email?.message}
          placeholder={t('change_email.input_placeholder')}
          type="email"
        />
        <FormMessage
          $visible={errors?.root?.serverError}
          $type={MessageTypes.Error}
        >
          {errors?.root?.serverError?.message}
        </FormMessage>
        <ButtonsContainer>
          <Link
            buttonAppearance={ButtonAppearance.Secondary}
            buttonSize={ButtonSizes.Medium}
            to={getAppRoute(VERIFY_EMAIL_ROUTE)}
          >
            {t('change_email.back_btn')}
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            size={ButtonSizes.Medium}
          >
            {t('change_email.submit_btn')}
          </Button>
        </ButtonsContainer>
      </StyledForm>
    </StyledCard>
  );
};

export default ChangeEmail;
