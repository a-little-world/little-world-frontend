import {
  Button,
  ButtonAppearance,
  Link,
  TextInput,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { resetPassword } from '../../api';
import { onFormError, registerInput } from '../../helpers/form';
import { LOGIN_ROUTE } from '../../routes';
import ButtonsContainer from '../atoms/ButtonsContainer';
import FormMessage, { MessageTypes } from '../atoms/FormMessage';
import { StyledCard, StyledForm, Title } from './SignUp.styles';

const ResetPassword = () => {
  const { t } = useTranslation();
  const { token } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSuccessful, setRequestSuccessful] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setError,
    setFocus,
  } = useForm({ shouldUnregister: true });

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const onError = e => {
    setIsSubmitting(false);
    onFormError({ e, formFields: getValues(), setError, t });
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
      <Title tag="h2" type={TextTypes.Heading4}>
        {t('reset_password.title')}
      </Title>
      <StyledForm onSubmit={handleSubmit(onFormSubmit)}>
        <TextInput
          {...registerInput({
            register,
            name: 'password',
            options: {
              required: 'error.required',
              minLength: { message: 'error.password_min_length', value: 8 },
            },
          })}
          id="password"
          error={t(errors?.password?.message)}
          label={t('reset_password.password_label')}
          placeholder={t('reset_password.password_placeholder')}
          type="password"
        />
        <TextInput
          {...registerInput({
            register,
            name: 'confirmPassword',
            options: {
              required: 'error.required',
              validate: (v, values) =>
                values.password === v || 'error.passwords_do_not_match',
              minLength: { message: 'error.password_min_length', value: 8 },
            },
          })}
          label={t('reset_password.confirm_password_label')}
          id="confirmPassword"
          error={t(errors?.confirmPassword?.message)}
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
        <ButtonsContainer>
          <Link
            buttonAppearance={ButtonAppearance.Secondary}
            to={`/${LOGIN_ROUTE}`}
          >
            {t('reset_password.to_login')}
          </Link>
          <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
            {t('reset_password.submit_btn')}
          </Button>
        </ButtonsContainer>
      </StyledForm>
    </StyledCard>
  );
};

export default ResetPassword;
