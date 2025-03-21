import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  MessageTypes,
  StatusMessage,
  Text,
  TextInput,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';

import { resendVerificationEmail, verifyEmail } from '../../api';
import { onFormError, registerInput } from '../../helpers/form.ts';
import {
  CHANGE_EMAIL_ROUTE,
  USER_FORM_ROUTE,
  getAppRoute,
} from '../../routes.ts';
import ButtonsContainer from '../atoms/ButtonsContainer';
import {
  FormDescription,
  StyledCard,
  StyledForm,
  Title,
} from './SignUp.styles';

const HelpText = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const ResendButton = styled(Button)`
 margin-bottom: ${({ theme }) => theme.spacing.xsmall};
`

const VerifyEmail = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSuccessful, setRequestSuccessful] = useState(false);
  const theme = useTheme();
  const email = useSelector(state => state.userData.user.email);
  const userFormCompleted = useSelector(
    state => state.userData.user.userFormCompleted,
  );

  const [searchParams] = useSearchParams();

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
    setFocus('verificationCode');
  }, [setFocus]);

  const onError = e => {
    setIsSubmitting(false);
    onFormError({ e, formFields: getValues(), setError });
  };

  const onResendCode = async () => {
    setIsSubmitting(true);

    resendVerificationEmail()
      .then(() => {
        setRequestSuccessful(true);
        setIsSubmitting(false);
      })
      .catch(onError);
  };

  const onFormSubmit = async ({ verificationCode }) => {
    setIsSubmitting(true);
    verifyEmail({ verificationCode })
      .then(() => {
        setIsSubmitting(false);
        setRequestSuccessful(true);

        if (!userFormCompleted) {
          // only navigate to /user-form when it's not completed
          // when a user changes email they see verify-email again but can go directly to /app after
          navigate(getAppRoute(USER_FORM_ROUTE));
        } else if (searchParams.get('next')) {
          // users can be redirected from /login?next=<url>
          // consider this route after the requried for entry forms verify-email / user-form
          navigate(searchParams.get('next'));
        } else {
          navigate(getAppRoute());
        }
      })
      .catch(onError);
  };

  return (
    <StyledCard>
      <Title tag="h2" type={TextTypes.Heading4}>
        {t('verify_email.title')}
      </Title>
      <FormDescription>
        {t('verify_email.description', { email })}
      </FormDescription>
      <StyledForm onSubmit={handleSubmit(onFormSubmit)}>
        <TextInput
          {...registerInput({
            register,
            name: 'verificationCode',
            options: { required: t('error.required') },
          })}
          id="text"
          label={t('verify_email.input_label')}
          error={t(errors?.verificationCode?.message)}
          placeholder={t('verify_email.code_placeholder')}
          type="number"
        />
        <ResendButton
          variation={ButtonVariations.Inline}
          color={theme.color.text.link}
          onClick={onResendCode}
        >
          {t('verify_email.resend_code')}
        </ResendButton>
        <HelpText>{t('verify_email.help_text')}</HelpText>
        <StatusMessage
          $visible={requestSuccessful || errors?.root?.serverError}
          $type={requestSuccessful ? MessageTypes.Success : MessageTypes.Error}
        >
          {requestSuccessful ?
            t('verify_email.success_message') :
            t(errors?.root?.serverError?.message)}
        </StatusMessage>
        <ButtonsContainer>
          <Button
            appearance={ButtonAppearance.Secondary}
            onClick={() => navigate(getAppRoute(CHANGE_EMAIL_ROUTE))}
            color={theme.color.text.link}
            size={ButtonSizes.Medium}
          >
            {t('verify_email.change_email_btn')}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            size={ButtonSizes.Medium}
          >
            {t('verify_email.submit_btn')}
          </Button>
        </ButtonsContainer>
      </StyledForm>
    </StyledCard>
  );
};

export default VerifyEmail;
