import { Switch } from '@a-little-world/little-world-design-system';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import useSWR from 'swr';
import { mutateUserData } from '../../../api';
import { updateProfile } from '../../../features/userData';
import { useParams } from 'react-router-dom';
import { onFormError } from '../../../helpers/form.ts';

const MailingListsWrapper = styled.div``;

export enum EmailCategories {
  Community = 'community',
  Marketing = 'marketing',
  Newsletter = 'newsletter',
  Partnerships = 'partnerships',
}

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

const fetcher = url => fetch(url).then(r => r.json())

export const SingleCategoryToggle = ({
  category,
  emailSettingsData
}) => {
  const { t } = useTranslation();
  const { control, getValues, setError, watch, handleSubmit } = useForm();

  const onError = e => {
    onFormError({ e, formFields: getValues(), setError, t });
  };

  const { emailSettingsHash } = useParams();

  const onFormSuccess = data => {
  };

  const onToggle = data => {
    console.log("TBS", data, "onToggle")
    
    const chageSubscribe = data[category] ? 'subscribe' : 'unsubscribe';
    
    fetch(`/api/email_settings/${emailSettingsHash}/${category}/${chageSubscribe}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
  };

  useEffect(() => {
    const subscription = watch(() => handleSubmit(onToggle)());

    return () => subscription.unsubscribe();
  }, [handleSubmit, watch]);

  return <form>
        <Controller
          defaultValue={!emailSettingsData.unsubscribed_categories.includes(category)}
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
              label={t('mailing_lists.category_toggle', { category })}
              labelInline={true}
              required={false}
            />
          )}
        />
      </form>
}

export const DynamicPublicMailingListsSettings = ({
  hideLabel,
}: {
  hideLabel?: boolean;
}) => {
  const { t } = useTranslation();
  
  const { emailSettingsHash } = useParams();


  const {
    data: emailSettingsData,
    error,
    isLoading,
  } = useSWR(`/api/email_settings/${emailSettingsHash}/`, fetcher)
  
  console.log("TBS", emailSettingsData)



  return (
    <MailingListsWrapper>
       {isLoading && <div>Loading...</div>}
       {!isLoading && emailSettingsData && emailSettingsData.categories.map((category) => {
        return <SingleCategoryToggle category={category} emailSettingsData={emailSettingsData}/>
       })}
    </MailingListsWrapper>
  );
};

export default MailingLists;