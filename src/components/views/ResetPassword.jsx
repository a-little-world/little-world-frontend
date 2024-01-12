import {
  Button,
  ButtonAppearance,
  TextInput,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { resetPassword } from '../../api';
import { LOGIN_ROUTE } from '../../routes';
import FormMessage, { MessageTypes } from '../atoms/FormMessage';
import { registerInput } from './SignUp';
import { StyledCard, StyledForm, Title } from './SignUp.styles';

const ResetPassword = () => {
  const { t } = useTranslation();
  const { token } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSuccessful, setRequestSuccessful] = useState(false);

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

  const onFormSubmit = async data => {
    setIsSubmitting(true);

    resetPassword({ ...data, token })
      .then(() => {
        setRequestSuccessful(true);
        setIsSubmitting(false);
      })
      .catch(onError);
  };

  return (
    <StyledCard>
      <Title tag="h2" type={TextTypes.Heading2}>
        {t('reset_password.title')}
      </Title>
      <StyledForm onSubmit={handleSubmit(onFormSubmit)}>
        <TextInput
          {...registerInput({
            register,
            name: 'password',
            options: { required: t('error.required') },
          })}
          id="password"
          error={errors?.password?.message}
          label={t('reset_password.password_label')}
          placeholder={t('reset_password.password_placeholder')}
          type="password"
        />
        <TextInput
          {...registerInput({
            register,
            name: 'confirmPassword',
            options: {
              required: t('error.required'),
              passwordsMatch: (v, values) =>
                values.password === v || t('confirmPasswordError'),
            },
          })}
          label={t('reset_password.confirm_password_label')}
          id="confirmPassword"
          error={errors?.confirmPassword?.message}
          type="password"
        />
        <FormMessage
          $visible={requestSuccessful || errors?.root?.serverError}
          $type={requestSuccessful ? MessageTypes.Success : MessageTypes.Error}
        >
          {requestSuccessful
            ? t('forgot_password.success_message')
            : errors?.root?.serverError?.message}
        </FormMessage>
        <Button
          appearance={ButtonAppearance.Secondary}
          onClick={() => navigate(`/${LOGIN_ROUTE}`)}
        >
          {t('reset_password.to_login')}
        </Button>
        <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
          {t('reset_password.submit_btn')}
        </Button>
      </StyledForm>
    </StyledCard>
  );
};

export default ResetPassword;
