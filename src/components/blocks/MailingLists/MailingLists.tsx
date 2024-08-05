import { Switch } from '@a-little-world/little-world-design-system';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { mutateUserData } from '../../../api';
import { onFormError } from '../../../helpers/form.js';

const MailingListsWrapper = styled.div``;

const MailingLists = ({
  inline,
  hideLabel,
}: {
  inline?: boolean;
  hideLabel?: boolean;
}) => {
  const { t } = useTranslation();
  const { control, getValues, setError, watch, handleSubmit } = useForm();
  const subscribed = useSelector(
    state => state.userData.user.profile.newsletter_subscribed,
  );

  const onError = e => {
    onFormError({ e, formFields: getValues(), setError, t });
  };

  const onToggle = data => {
    mutateUserData(data, () => null, onError);
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

export default MailingLists;
