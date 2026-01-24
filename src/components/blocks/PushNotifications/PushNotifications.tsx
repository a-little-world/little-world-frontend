import { Button, Switch } from '@a-little-world/little-world-design-system';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import useSWR, { mutate } from 'swr';

import { mutateUserData } from '../../../api/index';
import { environment } from '../../../environment';
import { useDevelopmentFeaturesStore } from '../../../features/stores/index';
import { FIREBASE_ENDPOINT, USER_ENDPOINT } from '../../../features/swr/index';
import {
  registerFirebaseDeviceToken,
  sendDelayedFirebaseTestNotification,
  sendFirebaseTestNotification,
  unregisterFirebaseDeviceToken,
} from '../../../firebase-util';
import { onFormError } from '../../../helpers/form';

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
  const { control, getValues, setError, watch, handleSubmit } = useForm<Data>();
  const { data: user } = useSWR(USER_ENDPOINT);
  const enabled = user?.profile.push_notifications_enabled;

  const onFormSuccess = (_data: Data) => {
    mutate(USER_ENDPOINT);
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
    if (enabled && !environment.isNative) {
      // Check if Notification API is available (not available on iOS Safari outside PWA context)
      if (typeof Notification !== 'undefined') {
        Notification.requestPermission().then(permission => {
          if (permission !== 'granted') {
            setError('push_notifications_enabled', {
              message: t('push_notifications.enable_error'),
            });
          }
        });
      } else {
        // Notification API not supported in this browser/context
        setError('push_notifications_enabled', {
          message: t('push_notifications.enable_error'),
        });
      }
    }
  }, [enabled, setError, t]);

  const firebaseConfig = useSWR(FIREBASE_ENDPOINT);
  const firebasePublicVapidKey = firebaseConfig?.firebasePublicVapidKey;
  const areDevFeaturesEnabled = useDevelopmentFeaturesStore().enabled;

  return (
    <>
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
      </NotificationForm>
      {areDevFeaturesEnabled && (
        <>
          <Button
            onClick={() => registerFirebaseDeviceToken(firebasePublicVapidKey)}
          >
            Register
          </Button>
          <Button
            onClick={() =>
              unregisterFirebaseDeviceToken(firebasePublicVapidKey)
            }
          >
            Unregister
          </Button>
          <Button
            onClick={() => sendFirebaseTestNotification(firebasePublicVapidKey)}
          >
            Send test notification
          </Button>
          <Button
            onClick={() =>
              sendDelayedFirebaseTestNotification(firebasePublicVapidKey)
            }
          >
            Send delayed test notification
          </Button>
        </>
      )}
    </>
  );
};

export default PushNotifications;
