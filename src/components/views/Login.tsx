import {
  ButtonAppearance,
  ButtonSizes,
  Link,
  StatusMessage,
  StatusTypes,
  TextInput,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useSWR, { mutate } from 'swr';

import { login } from '../../api';
import { environment } from '../../environment';
import useMobileAuthTokenStore from '../../features/stores/mobileAuthToken';
import useReceiveHandlerStore from '../../features/stores/receiveHandler';
import { USER_ENDPOINT } from '../../features/swr/index';
import { onFormError, registerInput } from '../../helpers/form';
import {
  FORGOT_PASSWORD_ROUTE,
  SIGN_UP_ROUTE,
  USER_FORM_ROUTE,
  VERIFY_EMAIL_ROUTE,
  getAppRoute,
  passAuthenticationBoundary,
} from '../../router/routes';
import { StyledCard, StyledCta, StyledForm, Title } from './SignUp.styles';

const Login = () => {
  const { t } = useTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendMessageToReactNative } = useReceiveHandlerStore();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setError,
    setFocus,
  } = useForm({ shouldUnregister: true });

  const navigate = useNavigate();
  const mobileAuthStore = useMobileAuthTokenStore();

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const onError = (e: any) => {
    setIsSubmitting(false);
    onFormError({ e, formFields: getValues(), setError });
  };

  const setAuthTokens = (
    accessToken: string | undefined | null,
    refreshToken: string | undefined | null,
  ) => {
    mobileAuthStore.setTokens(accessToken || null, refreshToken || null);
  };

  const { data: userData } = useSWR(USER_ENDPOINT);

  const accessToken = mobileAuthStore?.accessToken;

  useEffect(() => {
    if (accessToken) {
      mutate(USER_ENDPOINT);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!userData) {
      return;
    }

    passAuthenticationBoundary();
    if (!userData.emailVerified) {
      navigate(getAppRoute(VERIFY_EMAIL_ROUTE));
    } else if (!userData.userFormCompleted) {
      navigate(getAppRoute(USER_FORM_ROUTE));
    } else {
      // per default route to /app on successful login
      navigate(getAppRoute(''));
    }
  }, [userData, navigate]);

  const onFormSubmit = async (data: any) => {
    setIsSubmitting(true);

    login(data)
      .then(loginData => {
        mutate(USER_ENDPOINT, loginData, false);
        if (environment.isNative) {
          if (sendMessageToReactNative === null) {
            return;
          }
          sendMessageToReactNative({
            action: 'SET_AUTH_TOKENS',
            payload: {
              accessToken: loginData.token_access,
              refreshToken: loginData.token_refresh,
            },
          });
          setAuthTokens(loginData.token_access, loginData.token_refresh);
        }

        setIsSubmitting(false);
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
          visible={errors?.root?.serverError}
          type={StatusTypes.Error}
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

export default Login;
