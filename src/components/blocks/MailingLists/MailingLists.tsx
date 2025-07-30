import {
  Loading,
  LoadingSizes,
  StatusMessage,
  StatusTypes,
  Switch,
} from '@a-little-world/little-world-design-system';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import styled, { css } from 'styled-components';
import useSWR, { mutate } from 'swr';

import { apiFetch } from '../../../api/helpers.ts';
import { mutateUserData } from '../../../api/index.js';
import { USER_ENDPOINT } from '../../../features/swr/index.ts';
import { onFormError } from '../../../helpers/form.ts';

const MailingListsWrapper = styled.div<{ $centred?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  width: 100%;
  max-width: 400px;

  ${({ theme, $centred }) =>
    $centred &&
    css`
      min-height: 232px; // height of content
      margin: ${theme.spacing.small} auto 0;
    `}
`;

const CategoryForm = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

const MailingLists = ({
  inline,
  hideLabel,
}: {
  inline?: boolean;
  hideLabel?: boolean;
}) => {
  const { t } = useTranslation();
  const { control, getValues, setError, watch, handleSubmit } = useForm();
  const { data: user } = useSWR(USER_ENDPOINT);

  const subscribed = user?.profile.newsletter_subscribed;

  const onFormSuccess = _data => {
    mutate(USER_ENDPOINT);
  };

  const onError = e => {
    onFormError({ e, formFields: getValues(), setError, t });
  };

  const onToggle = data => {
    mutateUserData(data, onFormSuccess, onError);
  };

  useEffect(() => {
    const subscription = watch(() => handleSubmit(onToggle)());

    return () => subscription.unsubscribe();
  }, [handleSubmit, watch]);

  return (
    <MailingListsWrapper>
      <form>
        <Controller
          defaultValue={subscribed}
          name="newsletter_subscribed"
          control={control}
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { error },
          }) => (
            <Switch
              id="newsletter_subscribed"
              name={name}
              inputRef={ref}
              onCheckedChange={val => onChange({ target: { value: val } })}
              onBlur={onBlur}
              value={value}
              defaultChecked={value}
              error={error?.message}
              label={
                hideLabel
                  ? undefined
                  : t('mailing_lists.newsletter_subscription_toggle')
              }
              labelInline={inline}
              required={false}
            />
          )}
        />
      </form>
    </MailingListsWrapper>
  );
};

export const SingleCategoryToggle = ({ category, emailSettingsData }) => {
  const { t } = useTranslation();
  const { control, watch, handleSubmit } = useForm();

  // const onError = e => {
  //   onFormError({ e, formFields: getValues(), setError, t });
  // };

  const { emailSettingsHash } = useParams();

  // const onFormSuccess = data => {};

  const onToggle = data => {
    const chageSubscribe = data[category] ? 'subscribe' : 'unsubscribe';

    fetch(
      `/api/email_settings/${emailSettingsHash}/${category}/${chageSubscribe}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      },
    );
  };

  useEffect(() => {
    const subscription = watch(() => handleSubmit(onToggle)());

    return () => subscription.unsubscribe();
  }, [handleSubmit, watch]);

  return (
    <CategoryForm>
      <Controller
        defaultValue={
          !emailSettingsData.unsubscribed_categories.includes(category)
        }
        name={category}
        control={control}
        render={({
          field: { onChange, onBlur, value, name, ref },
          fieldState: { error },
        }) => (
          <Switch
            id={category}
            name={name}
            inputRef={ref}
            onCheckedChange={val => onChange({ target: { value: val } })}
            onBlur={onBlur}
            value={value}
            defaultChecked={value}
            error={error?.message}
            description={t(`mailing_lists.${category}_description`)}
            label={t(`mailing_lists.${category}_label_toggle`)}
            labelInline
            fullWidth
            required={false}
          />
        )}
      />
    </CategoryForm>
  );
};

export const DynamicPublicMailingListsSettings = () => {
  const { t } = useTranslation();

  const { emailSettingsHash } = useParams();
  const [saved] = useState(false);

  const {
    data: emailSettingsData,
    error,
    isLoading,
  } = useSWR(`/api/email_settings/${emailSettingsHash}/`, apiFetch);

  return (
    <MailingListsWrapper $centred>
      {isLoading ? (
        <Loading size={LoadingSizes.Medium} />
      ) : (
        emailSettingsData?.categories.map((category: string) => (
          <SingleCategoryToggle
            key={category}
            category={category}
            emailSettingsData={emailSettingsData}
          />
        ))
      )}
      <StatusMessage
        $visible={saved || error?.message}
        $type={saved ? StatusTypes.Success : StatusTypes.Error}
      >
        {saved ? t('mailing_lists.success_message') : error?.message}
      </StatusMessage>
    </MailingListsWrapper>
  );
};

export default MailingLists;
