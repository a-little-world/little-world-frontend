import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  Link,
  TextInput,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from 'styled-components';

import { login } from '../../api';
import { initialise } from '../../features/userData';
import {
  SIGN_UP_ROUTE,
  USER_FORM_ROUTE,
  VERIFY_EMAIL_ROUTE,
  getAppRoute,
} from '../../routes';
import FormMessage, { MessageTypes } from '../atoms/FormMessage';
import { registerInput } from './SignUp';
import { StyledCard, StyledCta, StyledForm, Title } from './SignUp.styles';

const Login = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const [searchParams] = useSearchParams();

  const [isSubmitting, setIsSubmitting] = useState(false);

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
        { type: 'custom', message: e.message },
        { shouldFocus: true },
      );
    } else {
      setError('root.serverError', {
        type: 'custom',
        message: 'validation.generic_try_again',
      });
    }
  };

  const onFormSubmit = async data => {
    setIsSubmitting(true);

    login(data)
      .then(loginData => {
        dispatch(initialise(loginData));
        setIsSubmitting(false);

        if (!loginData.user.emailVerified) {
          navigate(getAppRoute(VERIFY_EMAIL_ROUTE));
        } else if (!loginData.user.userFormCompleted) {
          navigate(getAppRoute(USER_FORM_ROUTE));
        } else if (searchParams.get('next')) {
          // users can be redirected from /login?next=<url>
          // consider this route after the requried for entry forms verify-email / user-form
          navigate(searchParams.get('next'));
        } else {
          // per default route to /app on successful login
          navigate(getAppRoute(''));
        }
      })
      .catch(onError);
  };

  return (
    <StyledCard>
      <Title tag="h2" type={TextTypes.Heading2}>
        {t('login.title')}
      </Title>
      <StyledForm onSubmit={handleSubmit(onFormSubmit)}>
        <TextInput
          {...registerInput({
            register,
            name: 'email',
            options: { required: 'error.required' },
          })}
          id="email"
          label={t('login.email_label')}
          error={t(errors?.email?.message)}
          placeholder={t('login.email_placeholder')}
          type="email"
        />
        <TextInput
          {...registerInput({
            register,
            name: 'password',
            options: { required: 'error.required' },
          })}
          id="password"
          error={t(errors?.password?.message)}
          label={t('login.password_label')}
          placeholder={t('login.password_placeholder')}
          type="password"
        />

        <Button
          variation={ButtonVariations.Inline}
          onClick={() => navigate('/forgot-password')}
          color={theme.color.text.link}
        >
          {t('login.forgot_password')}
        </Button>
        <FormMessage
          $visible={errors?.root?.serverError}
          $type={MessageTypes.Error}
        >
          {t(errors?.root?.serverError?.message)}
        </FormMessage>
        <StyledCta
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
          size={ButtonSizes.Stretch}
        >
          {t('login.submit_btn')}
        </StyledCta>
        <Link
          to={`/${SIGN_UP_ROUTE}`}
          buttonAppearance={ButtonAppearance.Secondary}
        >
          {t('login.change_location_cta')}
        </Link>
      </StyledForm>
    </StyledCard>
  );
};

export default Login;
