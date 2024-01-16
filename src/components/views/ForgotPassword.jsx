import {
  Button,
  ButtonAppearance,
  Text,
  TextInput,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';

import { requestPasswordReset } from '../../api';
import { onFormError, registerInput } from '../../helpers/form';
import { LOGIN_ROUTE } from '../../routes';
import ButtonsContainer from '../atoms/ButtonsContainer';
import FormMessage, { MessageTypes } from '../atoms/FormMessage';
import { StyledCard, StyledForm, Title } from './SignUp.styles';

export const ForgotPasswordDescription = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSuccessful, setRequestSuccessful] = useState(false);
  const theme = useTheme();

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
    onFormError({ e, formFields: getValues(), setError, t });
  };

  const onFormSubmit = async data => {
    setIsSubmitting(true);

    requestPasswordReset(data)
      .then(() => {
        setRequestSuccessful(true);
        setIsSubmitting(false);
      })
      .catch(onError);
  };

  return (
    <StyledCard>
      <Title tag="h2" type={TextTypes.Heading2}>
        {t('forgot_password.title')}
      </Title>
      <ForgotPasswordDescription>
        {t('forgot_password.description')}
      </ForgotPasswordDescription>
      <StyledForm onSubmit={handleSubmit(onFormSubmit)}>
        <TextInput
          {...registerInput({
            register,
            name: 'email',
            options: { required: t('error.required') },
          })}
          id="email"
          label={t('forgot_password.email_label')}
          error={errors?.email?.message}
          placeholder={t('forgot_password.email_placeholder')}
          type="email"
        />
        <FormMessage
          $visible={requestSuccessful || errors?.root?.serverError}
          $type={requestSuccessful ? MessageTypes.Success : MessageTypes.Error}
        >
          {requestSuccessful
            ? t('forgot_password.success_message')
            : errors?.root?.serverError?.message}
        </FormMessage>
        <ButtonsContainer>
          <Button
            appearance={ButtonAppearance.Secondary}
            onClick={() => navigate(`/${LOGIN_ROUTE}`)}
            color={theme.color.text.link}
          >
            {t('forgot_password.cancel_btn')}
          </Button>
          <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
            {t('forgot_password.submit_btn')}
          </Button>
        </ButtonsContainer>
      </StyledForm>
    </StyledCard>
  );
};

export default ForgotPassword;
