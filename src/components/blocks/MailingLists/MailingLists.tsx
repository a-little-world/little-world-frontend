import {
  Button,
  Loading,
  MessageTypes,
  StatusMessage,
  Switch,
} from '@a-little-world/little-world-design-system';
import { LoadingSizes } from '@a-little-world/little-world-design-system/dist/esm/components/Loading/Loading';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';

import { mutateUserData } from '../../../api/index.js';
import { updateProfile } from '../../../features/userData.js';
import { onFormError } from '../../../helpers/form.ts';

const MailingListsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  margin: ${({ theme }) => theme.spacing.small} auto 0;
  width: 100%;
  max-width: 400px;
  min-height: 232px; // height of content
`;

const CategoryForm = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xxsmall};

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
`;

const MailingLists = ({
  inline,
  hideLabel,
  categoriesToDisplay,
}: {
  categoriesToDisplay?: string[];
  inline?: boolean;
  hideLabel?: boolean;
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { control, getValues, setError, watch, handleSubmit } = useForm();
  const subscribed = useSelector(
    state => state.userData.user.profile.newsletter_subscribed,
  );

  const onFormSuccess = data => {
    dispatch(updateProfile(data));
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

const fetcher = url => fetch(url).then(r => r.json());

export const SingleCategoryToggle = ({ category, emailSettingsData }) => {
  const { t } = useTranslation();
  const { control, getValues, setError, watch, handleSubmit } = useForm();

  const onError = e => {
    onFormError({ e, formFields: getValues(), setError, t });
  };

  const { emailSettingsHash } = useParams();

  const onFormSuccess = data => {};

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
            label={t(`mailing_lists.${category}_label_toggle`)}
            labelInline
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
  const [saved, setSaved] = useState(false);

  const {
    data: emailSettingsData,
    error,
    isLoading,
  } = useSWR(`/api/email_settings/${emailSettingsHash}/`, fetcher);

  return (
    <MailingListsWrapper>
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
        $type={saved ? MessageTypes.Success : MessageTypes.Error}
      >
        {saved ? t('mailing_lists.success_message') : error?.message}
      </StatusMessage>
      <Button disabled={false} loading={false} onClick={() => setSaved(true)}>
        {t('mailing_lists.submit_btn')}
      </Button>
    </MailingListsWrapper>
  );
};

export default MailingLists;
