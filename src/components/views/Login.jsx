import {
  ButtonAppearance,
  ButtonSizes,
  Link,
  MessageTypes,
  StatusMessage,
  TextInput,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { I18nextProvider, useTranslation } from 'react-i18next';
import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
  useRouteError,
} from 'react-router-dom';
import { SWRConfig, mutate } from 'swr';

import { login } from '../../api';
import { USER_ENDPOINT, swrConfig } from '../../features/swr/index';
import { onFormError, registerInput } from '../../helpers/form';
import i18n from '../../i18n';
import { getWebRouter } from '../../router/router';
import {
  FORGOT_PASSWORD_ROUTE,
  SIGN_UP_ROUTE,
  USER_FORM_ROUTE,
  VERIFY_EMAIL_ROUTE,
  getAppRoute,
  passAuthenticationBoundary,
} from '../../router/routes';
import FormLayout from '../blocks/Layout/FormLayout';
import { StyledCard, StyledCta, StyledForm, Title } from './SignUp.styles';

// Error component that displays actual error information
const ErrorElement = () => {
  const error = useRouteError();
  const { t } = useTranslation();
  const navigate = useNavigate();

  console.error('Route error:', error);

  return (
    <StyledCard>
      <Title tag="h2" type={TextTypes.Heading4}>
        {t('error_view.title')}
      </Title>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <p>Something went wrong while loading this page.</p>
        {error && (
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            <strong>Error details:</strong>
            <pre
              style={{
                background: '#f5f5f5',
                padding: '10px',
                borderRadius: '4px',
                overflow: 'auto',
                maxHeight: '200px',
                fontSize: '12px',
              }}
            >
              {error.message || error.toString()}
            </pre>
          </div>
        )}
      </div>
      <StyledCta onClick={() => navigate('/')} size={ButtonSizes.Stretch}>
        {t('error_view.button')}
      </StyledCta>
    </StyledCard>
  );
};

const Login = () => {
  const { t } = useTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
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
    onFormError({ e, formFields: getValues(), setError });
  };

  const onFormSubmit = async data => {
    setIsSubmitting(true);

    login(data)
      .then(loginData => {
        mutate(USER_ENDPOINT, loginData);
        setIsSubmitting(false);

        passAuthenticationBoundary();

        if (!loginData.emailVerified) {
          navigate(getAppRoute(VERIFY_EMAIL_ROUTE));
        } else if (!loginData.userFormCompleted) {
          navigate(getAppRoute(USER_FORM_ROUTE));
        } else {
          // per default route to /app on successful login
          navigate(getAppRoute());
        }
      })
      .catch(onError);
  };

  return (
    <StyledCard>
      <Title tag="h2" type={TextTypes.Heading4}>
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

        <Link to={`/${FORGOT_PASSWORD_ROUTE}/`}>
          {t('login.forgot_password')}
        </Link>
        <StatusMessage
          $visible={errors?.root?.serverError}
          $type={MessageTypes.Error}
        >
          {t(errors?.root?.serverError?.message)}
        </StatusMessage>
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
          buttonSize={ButtonSizes.Stretch}
        >
          {t('login.change_location_cta')}
        </Link>
      </StyledForm>
    </StyledCard>
  );
};

export const NativeWebWrapperL = ({ children }) => (
  <SWRConfig value={swrConfig}>{children}</SWRConfig>
);

export function LoginNativeWeb() {
  const router = getWebRouter();
  const router2 = createBrowserRouter(
    [
      {
        path: '/',
        element: (
          <FormLayout>
            <Login />
          </FormLayout>
        ),
        errorElement: (
          <FormLayout>
            <ErrorElement />
          </FormLayout>
        ),
      },
      {
        path: '/login',
        element: (
          <FormLayout>
            <Login />
          </FormLayout>
        ),
        errorElement: (
          <FormLayout>
            <ErrorElement />
          </FormLayout>
        ),
      },
      {
        path: '',
        element: (
          <FormLayout>
            <Login />
          </FormLayout>
        ),
        errorElement: (
          <FormLayout>
            <ErrorElement />
          </FormLayout>
        ),
      },
    ],
    {
      basename: '/',
    },
  );

  return (
    <I18nextProvider i18n={i18n}>
      <NativeWebWrapperL>
        <RouterProvider router={router} />
      </NativeWebWrapperL>
    </I18nextProvider>
  );
}

export default Login;
