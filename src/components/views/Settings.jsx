import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  Card,
  Dropdown,
  Link,
  MessageTypes,
  Modal,
  PencilIcon,
  StatusMessage,
  Text,
  TextInput,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled, { css, useTheme } from 'styled-components';

import { DEVELOPMENT } from '../../ENVIRONMENT';
import { mutateUserData, setNewEmail, setNewPassword } from '../../api';
import { updateProfile } from '../../features/userData';
import { onFormError, registerInput } from '../../helpers/form.ts';
import { FORGOT_PASSWORD_ROUTE } from '../../router/routes.ts';
import ButtonsContainer from '../atoms/ButtonsContainer';
import PageHeader from '../atoms/PageHeader.tsx';
import DeleteAccountCard from '../blocks/Cards/DeleteAccountCard';
import ModalCard, { ModalTitle } from '../blocks/Cards/ModalCard';
import MailingLists from '../blocks/MailingLists/MailingLists.tsx';

const types = {
  first_name: 'text',
  second_name: 'text',
  email: 'email',
  password: 'password',
  phone_mobile: 'tel',
  postal_code: 'number',
  birth_year: 'number',
};

const displayLanguages = [
  { value: 'en', label: '🇬🇧 English' },
  { value: 'de', label: '🇩🇪 Deutsch' },
];

const repeaters = ['password', 'email'];

const StyledFormMessage = styled(StatusMessage)`
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const SettingsItem = styled.div`
  max-width: 360px;
  &:last-of-type {
    margin-top: ${({ theme }) => theme.spacing.small};
  }
`;

const Field = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FieldTitle = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
`;

const ForgotPasswordLink = styled(Link)`
  margin-bottom: ${({ theme }) => theme.spacing.xsmall};
`;

const SettingsWrapper = styled.div`
  ${({ theme }) => css`
    padding: ${theme.spacing.small};
    width: 100%;
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: 0;
    }
  `}
`;

const ContentPanel = styled(Card)`
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  width: 100%;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.small}) {
      padding: ${theme.spacing.small};
    }
    @media (min-width: ${theme.breakpoints.large}) {
      padding: ${theme.spacing.medium};
    }
  `}
`;

const Items = styled.div`
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  background: ${({ theme }) => theme.color.surface.secondary};
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`;

function ListItem({ section, label, value, setEditing }) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <SettingsItem>
      <FieldTitle tag="h3" type={TextTypes.Body5} bold>
        {t(`settings.${section}_${label}`)}
      </FieldTitle>
      <Field>
        <Text disableParser>{value}</Text>
        <Button
          variation={ButtonVariations.Inline}
          color={theme.color.text.link}
          onClick={() => setEditing(label)}
        >
          <PencilIcon height="12px" width="16px" />
          {t('settings.edit_button')}
        </Button>
      </Field>
    </SettingsItem>
  );
}

function EditFieldCard({ label, valueIn, setEditing }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const type = types[label];
  const needsRelogin = ['email', 'password'].includes(label);

  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setError,
    setFocus,
  } = useForm();

  const onResponseSuccess = data => {
    dispatch(updateProfile(data));
    setEditing(false);
    if (needsRelogin) window.location.reload();
  };

  const onError = e => {
    setIsSubmitting(false);
    onFormError({ e, formFields: getValues(), setError, t });
  };

  const onFormSubmit = data => {
    setIsSubmitting(true);
    if (label === 'password') {
      setNewPassword(data).then(onResponseSuccess).catch(onError);
    } else if (type === 'email') {
      // DISABLE; DANGEROUS
      if (!DEVELOPMENT)
        setNewEmail(data).then(onResponseSuccess).catch(onError);
    } else if (label === 'display_language') {
      Cookies.set('frontendLang', data.display_language);
      i18n.changeLanguage(data.display_language);
      mutateUserData(data, onResponseSuccess, onError);
    } else {
      mutateUserData(data, onResponseSuccess, onError);
    }
  };

  useEffect(() => {
    setFocus(label);
  }, [setFocus, label]);

  return (
    <ModalCard>
      <ModalTitle>
        {t('settings.edit_item', { item: t(`settings.personal_${label}`) })}
      </ModalTitle>
      {needsRelogin && (
        <Text>{t(`settings.personal_${label}_change_warning`)}</Text>
      )}
      <form onSubmit={handleSubmit(onFormSubmit)}>
        {label === 'display_language' && (
          <Controller
            defaultValue={valueIn}
            name={label}
            control={control}
            rules={{ required: 'error.required' }}
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { error },
            }) => (
              <Dropdown
                name={name}
                inputRef={ref}
                onValueChange={val => onChange({ target: { value: val } })}
                onBlur={onBlur}
                value={value}
                error={t(error?.message)}
                label={t('settings.personal_display_language')}
                options={displayLanguages}
              />
            )}
          />
        )}
        {label === 'password' && (
          <>
            <TextInput
              {...registerInput({
                register,
                name: 'password_old',
                options: {
                  required: 'error.required',
                  minLength: { message: 'error.password_min_length', value: 8 },
                },
              })}
              error={t(errors?.password_old?.message)}
              label={t('settings.personal_password_current')}
              type="password"
            />

            <ForgotPasswordLink to={`/${FORGOT_PASSWORD_ROUTE}/`}>
              {t('settings.personal_password_forgot')}
            </ForgotPasswordLink>
            <TextInput
              {...registerInput({
                register,
                name: 'password_new',
                options: {
                  required: 'error.required',
                  minLength: { message: 'error.password_min_length', value: 8 },
                },
              })}
              error={t(errors?.password_new?.message)}
              label={t('settings.personal_password_new')}
              type="password"
            />
            <TextInput
              {...registerInput({
                register,
                name: 'password_new2',
                options: {
                  required: 'error.required',
                  validate: (v, values) =>
                    values.password_new === v || 'error.passwords_do_not_match',
                  minLength: { message: 'error.password_min_length', value: 8 },
                },
              })}
              label={t('settings.personal_password_new_rpt')}
              error={t(errors?.password_new2?.message)}
              type="password"
            />
          </>
        )}
        {[
          'first_name',
          'second_name',
          'email',
          'phone_mobile',
          'postal_code',
          'birth_year',
        ].includes(label) && (
          <TextInput
            {...registerInput({
              register,
              name: label,
              options: { required: 'error.required' },
            })}
            error={t(errors?.[label]?.message)}
            label={t(`settings.personal_${label}`)}
            defaultValue={valueIn}
            type={types[label]}
          />
        )}
        <StyledFormMessage
          $visible={errors?.root?.serverError}
          $type={MessageTypes.Error}
        >
          {t(errors?.root?.serverError?.message)}
        </StyledFormMessage>
        <ButtonsContainer>
          <Button
            appearance={ButtonAppearance.Secondary}
            disabled={isSubmitting}
            onClick={() => setEditing(false)}
          >
            {t('btn_cancel')}
          </Button>
          <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
            {t('btn_save')}
          </Button>
        </ButtonsContainer>
      </form>
    </ModalCard>
  );
}

function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const profile = useSelector(state => ({
    email: state.userData.user.email,
    ...state.userData.user.profile,
  }));

  const [editing, setEditing] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const items = [
    // with ordering
    // "profilePicture",
    'display_language',
    'first_name',
    'second_name',
    'email',
    'password',
    'phone_mobile',
    'postal_code',
    'birth_year',
  ];

  const data = Object.fromEntries(
    items.map(item => {
      let val = profile[item];
      if (item === 'password') val = '********';
      return [item, val];
    }),
  );

  return (
    <>
      <PageHeader text={t('settings.title')} />
      <SettingsWrapper>
        <ContentPanel>
          <Items>
            {items.map(label => (
              <ListItem
                key={label}
                section="personal"
                label={label}
                value={
                  label === 'display_language'
                    ? t(`settings.display_language_${data[label]}`)
                    : data[label]
                }
                setEditing={
                  label !== 'profilePicture'
                    ? setEditing
                    : () => {
                        /* For profile picture we just open the userform frontend for now */
                        navigate('/formpage?pages=6');
                        navigate(0); /* Reload page */
                      }
                }
              />
            ))}
            <MailingLists />
            <SettingsItem>
              <Button
                appearance={ButtonAppearance.Secondary}
                color="red"
                backgroundColor="red"
                size={ButtonSizes.Large}
                onClick={() => {
                  setShowConfirm(true);
                }}
              >
                {t('settings.personal_delete_account_button')}
              </Button>
            </SettingsItem>
          </Items>
        </ContentPanel>
      </SettingsWrapper>
      <Modal open={editing} onClose={() => setEditing(false)}>
        <EditFieldCard
          label={editing}
          valueIn={data[editing]}
          repeat={repeaters.includes(editing)}
          setEditing={setEditing}
        />
      </Modal>
      <Modal open={showConfirm} onClose={() => setShowConfirm(false)}>
        <DeleteAccountCard setShowModal={setShowConfirm} />
      </Modal>
    </>
  );
}

export default Settings;
