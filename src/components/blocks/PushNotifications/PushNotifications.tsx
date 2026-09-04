import { useEffect } from 'react';

import { Button, Switch } from '@a-little-world/little-world-design-system';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import useSWR, { mutate } from 'swr';

import { USER_ENDPOINT } from '../../../api/endpoints';
import { mutateUserData } from '../../../api/index';
import { environment } from '../../../environment';
import { useDevelopmentFeaturesStore } from '../../../features/stores/index';
import useNotificationStore from '../../../features/stores/notification';
import {
  registerFirebaseDeviceToken,
  sendFirebaseTestNotification,
  unregisterFirebaseDeviceToken,
} from '../../../firebase-util';
import { onFormError } from '../../../helpers/form';

const NotificationsList = styled.form<{ $categoriesOpen: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $categoriesOpen, theme }) =>
    $categoriesOpen ? theme.spacing.small : 0};
  align-items: stretch;
  background: ${({ theme }) => theme.color.surface.secondary};
  border-radius: ${({ theme }) => theme.radius.medium};
  padding: ${({ theme }) => theme.spacing.small};
`;

const MasterRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;

const CategoryTogglesWrapper = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${({ $open }) => ($open ? '1fr' : '0fr')};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: translateY(${({ $open }) => ($open ? '0' : '-1fr')});
  transition:
    grid-template-rows 250ms ease,
    opacity 200ms ease,
    transform 250ms ease;
`;

const CategoryToggles = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  padding-left: ${({ theme }) => theme.spacing.medium};
  overflow: hidden;
`;

const CATEGORIES = [
  'chats',
  'matches',
  'random_calls',
  'announcements',
] as const;

type Data = {
  push_notifications_enabled: boolean;
} & Record<
  `push_notifications_${(typeof CATEGORIES)[number]}_enabled`,
  boolean
>;

const PushNotifications = ({ hideLabel }: { hideLabel?: boolean }) => {
  const { t } = useTranslation();
  const { control, getValues, setError, clearErrors, watch, handleSubmit } =
    useForm<Data>();
  const { data: user } = useSWR(USER_ENDPOINT);
  // notification store is not necessarily updated fast enough and only the initial value is used
  const userDataPushNotificationsEnabled =
    user?.profile.push_notifications_enabled;
  const globalEnabled = watch(
    'push_notifications_enabled',
    userDataPushNotificationsEnabled,
  );

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

  const areDevFeaturesEnabled = useDevelopmentFeaturesStore().enabled;

  const {
    deviceSupported,
    devicePermissionSet,
    devicePermissionGranted,
    notificationsEnabled,
    setDevicePermissionGranted,
    setDevicePermissionSet,
  } = useNotificationStore();

  const enabledWithoutPermissionSet =
    deviceSupported && notificationsEnabled && !devicePermissionSet;
  const enabledWithPermissionDenied =
    deviceSupported &&
    notificationsEnabled &&
    devicePermissionSet &&
    !devicePermissionGranted;

  useEffect(() => {
    if (environment.isNative) {
      return;
    }
    if (enabledWithPermissionDenied) {
      setError('push_notifications_enabled', {
        message: t('push_notifications.permission_denied'),
      });
    } else {
      clearErrors('push_notifications_enabled');
    }
  }, [enabledWithPermissionDenied, setError, clearErrors, t]);

  const requestNotificationPermission = async () => {
    const NotificationCtor = globalThis.Notification;
    if (typeof NotificationCtor?.requestPermission !== 'function') {
      return;
    }
    const permissionStatus = await NotificationCtor.requestPermission();
    setDevicePermissionSet(permissionStatus !== 'default');
    setDevicePermissionGranted(permissionStatus === 'granted');
  };

  return (
    <>
      <NotificationsList $categoriesOpen={Boolean(globalEnabled)}>
        <MasterRow>
          <Controller
            defaultValue={userDataPushNotificationsEnabled}
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
                cannotError={!error}
                label={hideLabel ? undefined : t('push_notifications')}
                labelInline
                required={false}
              />
            )}
          />
          {!environment.isNative && enabledWithoutPermissionSet && (
            <Button onClick={() => requestNotificationPermission()}>
              {t('push_notifications.request_permission')}
            </Button>
          )}
        </MasterRow>
        <CategoryTogglesWrapper $open={Boolean(globalEnabled)}>
          <CategoryToggles>
            {CATEGORIES.map(category => {
              const fieldName =
                `push_notifications_${category}_enabled` as const;
              return (
                <Controller
                  key={fieldName}
                  defaultValue={user?.profile[fieldName] ?? true}
                  name={fieldName}
                  control={control}
                  render={({
                    field: { onChange, onBlur, value, name, ref },
                    fieldState: { error },
                  }) => (
                    <Switch
                      id={fieldName}
                      name={name}
                      inputRef={ref}
                      disabled={!globalEnabled}
                      onCheckedChange={val =>
                        onChange({ target: { value: val } })
                      }
                      onBlur={onBlur}
                      value={value}
                      defaultChecked={value}
                      error={error?.message}
                      cannotError={!error}
                      label={t(`push_notifications.category.${category}`)}
                      labelInline
                      required={false}
                    />
                  )}
                />
              );
            })}
          </CategoryToggles>
        </CategoryTogglesWrapper>
      </NotificationsList>
      {areDevFeaturesEnabled && (
        <>
          <Button onClick={() => registerFirebaseDeviceToken()}>
            Register
          </Button>
          <Button onClick={() => unregisterFirebaseDeviceToken()}>
            Unregister
          </Button>
          <Button onClick={() => sendFirebaseTestNotification()}>
            Send test notification
          </Button>
          <Button onClick={() => sendFirebaseTestNotification(3000)}>
            Send delayed test notification
          </Button>
        </>
      )}
    </>
  );
};

export default PushNotifications;
