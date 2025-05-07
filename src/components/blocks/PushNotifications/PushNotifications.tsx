import { Button, Switch } from '@a-little-world/little-world-design-system';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { mutateUserData } from '../../../api/index.js';
import { updateProfile } from '../../../features/userData.js';
import { onFormError } from '../../../helpers/form.ts';

const NotificationForm = styled.form`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;

type Data = {
  push_notifications_enabled: boolean;
};

const PushNotifications = ({
  inline,
  hideLabel,
}: {
  inline?: boolean;
  hideLabel?: boolean;
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { control, getValues, setError, watch, handleSubmit } = useForm<Data>();
  const enabled = useSelector(
    state => state.userData.user.profile.push_notifications_enabled,
  );

  const onFormSuccess = (data: Data) => {
    dispatch(updateProfile(data));
  };

  const onError = e => {
    onFormError({ e, formFields: getValues(), setError, t });
  };

  const onToggle = (data: Data) => {
    mutateUserData(data, onFormSuccess, onError);
  };

  useEffect(() => {
    const subscription = watch(() => handleSubmit(onToggle)());

    return () => subscription.unsubscribe();
  }, [handleSubmit, watch]);

  useEffect(() => {
    if (enabled) {
      Notification.requestPermission().then(permission => {
        if (permission !== 'granted') {
          setError('push_notifications_enabled', {
            message: t('push_notifications.enable_error'),
          });
        }
      });
    }
  }, [enabled, setError, t]);

  return (
    <NotificationForm>
      <Controller
        defaultValue={enabled}
        name="push_notifications_enabled"
        control={control}
        render={({
          field: { onChange, onBlur, value, name, ref },
          fieldState: { error },
        }) => (
          <Switch
            id="push_notifications_enabled"
            name={name}
            inputRef={ref}
            onCheckedChange={val => onChange({ target: { value: val } })}
            onBlur={onBlur}
            value={value}
            defaultChecked={value}
            error={error?.message}
            label={hideLabel ? undefined : t('push_notifications')}
            labelInline={inline}
            required={false}
          />
        )}
      />
      <Button>Test</Button>
    </NotificationForm>
  );
};

export default PushNotifications;
