import {
  Button,
  MessageTypes,
  StatusMessage,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { updateEmailPreferences } from '../../api/emails.ts';
import { onFormError, registerInput } from '../../helpers/form.ts';
import ButtonsContainer from '../atoms/ButtonsContainer.jsx';
import { DynamicPublicMailingListsSettings } from '../blocks/MailingLists/MailingLists.tsx';
import { StyledCard, StyledForm, Title } from './SignUp.styles.jsx';

const EmailPreferences = () => {
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
    onFormError({ e, formFields: getValues(), setError });
  };

  const onFormSubmit = async data => {
    setIsSubmitting(true);

    updateEmailPreferences({ ...data, token })
      .then(() => {
        setRequestSuccessful(true);
        setIsSubmitting(false);
      })
      .catch(onError);
  };

  return (
    <StyledCard>
      <Title tag="h2" type={TextTypes.Heading4}>
        {t('email_preferences.title')}
      </Title>
      <DynamicPublicMailingListsSettings />
      <StyledForm onSubmit={handleSubmit(onFormSubmit)}>
        <StatusMessage
          $visible={requestSuccessful || errors?.root?.serverError}
          $type={requestSuccessful ? MessageTypes.Success : MessageTypes.Error}
        >
          {requestSuccessful
            ? t('email_preferences.success_message')
            : t(errors?.root?.serverError?.message)}
        </StatusMessage>
        <ButtonsContainer>
          <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
            {t('email_preferences.submit_btn')}
          </Button>
        </ButtonsContainer>
      </StyledForm>
    </StyledCard>
  );
};

export default EmailPreferences;
