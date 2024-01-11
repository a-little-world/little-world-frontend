import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  Dropdown,
  Modal,
  PencilIcon,
  Text,
  TextInput,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';

import { BACKEND_URL, DEVELOPMENT } from '../../ENVIRONMENT';
import { mutateUserData } from '../../api';
import { updateProfile } from '../../features/userData';
import { RESET_PASSWORD_ROUTE } from '../../routes';
import ButtonsContainer from '../atoms/ButtonsContainer';
import DeleteAccountCard from '../blocks/Cards/DeleteAccountCard';
import ModalCard from '../blocks/Cards/ModalCard';
import { SubmitError } from '../blocks/Form/styles';
import './settings.css';

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
  color: ${({ theme }) => theme.color.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xsmall};
`;

function ListItem({ section, label, value, setEditing }) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <SettingsItem>
      <FieldTitle
        tag="h3"
        type={TextTypes.Heading3}
        color={theme.color.text.primary}
      >
        {t(`settings.${section}_${label}`)}
      </FieldTitle>
      <Field>
        <Text>{value}</Text>
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

const types = {
  display_language: 'select',
  first_name: 'text',
  second_name: 'text',
  email: 'email',
  password: 'password',
  phone_mobile: 'tel',
  postal_code: 'numeric',
  birth_year: 'numeric',
};
const allowedChars = {
  tel: /^[+]?[0-9- ]*$/, // numbers spaces, dashes. can start with one +
  numeric: /^[0-9]*$/, // numbers only
  email: /^[a-z0-9@.+-]*$/i, // alphanumeric and @ . + -
};
const displayLanguages = [
  { value: 'en', label: '🇬🇧 English' },
  { value: 'de', label: '🇩🇪 Deutsch' },
];

const repeaters = ['password', 'email'];

const submitItem = (item, newValue) => {
  return submitData({ [item]: newValue }, '/api/profile/');
};

const submitData = (data, endpoint) => {
  return fetch(`${BACKEND_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-UseTagsOnly': true, // This automaticly requests error tags instead of direct translations!
    },
    body: JSON.stringify(data),
  }).then(response => {
    const { status, statusText } = response;
    if (status === 200) {
      return response.json();
    } else {
      throw new Error(`Error "${status}" submitting data: ${statusText}`);
    }
  });
};

const apiChangePw = (oldPass, newPass) => {
  const data = {
    password_old: oldPass,
    password_new: newPass,
    password_new2: newPass,
  };
  return submitData(data, '/api/user/changepw/');
};

const apiChangeEmail = email =>
  submitData({ email }, '/api/user/change_email/');
/* WARNING: this will log the user out of the dashboard and require to enter a new verification code ( impossible using only this frontend ) */

const allowedCodes = [
  // copied from profile.jsx. should globalise.
  8, // backspace
  16, // shift - for selection
  17, // ctrl - for word deletion
  33, // pageUp
  34, // pageDown
  35, // end
  36, // home
  37, // left arrow
  38, // up arrow
  39, // right arrow
  40, // down arrow
  46, // delete
];

function PassChange({ refIn = undefined }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <>
      <TextInput
        label={t('settings.personal_password_current')}
        inputRef={refIn}
        type="password"
      />
      <Button
        variation={ButtonVariations.Inline}
        onClick={() => navigate(`/${RESET_PASSWORD_ROUTE}/`)}
        color={theme.color.text.link}
      >
        {t('settings.personal_password_forgot')}
      </Button>
      <TextInput label={t('settings.personal_password_new')} type="password" />
      <TextInput
        label={t('settings.personal_password_new_rpt')}
        type="password"
      />
    </>
  );
}

function EditFieldCard({ label, valueIn, setEditing }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const type = types[label];
  const [value, setValue] = useState(valueIn);
  const [waiting, setWaiting] = useState(false);
  const [errors, setErrors] = useState([]);
  const textInput = useRef();
  console.log({ valueIn });
  const handleChange = e => {
    const val = e.target.value;
    if (
      !['tel', 'numeric', 'email'].includes(type) ||
      allowedChars[type].test(val)
    ) {
      setValue(val);
    } else {
      e.preventDefault();
    }
  };

  const onResponseSuccess = data => {
    dispatch(updateProfile(data));
    setEditing(false);
  };
  const onResponseFailure = error => {
    const backendLabel = label;
    const errorsList = error[backendLabel] || ['unknown error'];
    console.log({ backendLabel, error });
    setErrors(errorsList); // update error message(s)
    setWaiting(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setErrors([]); // clear existing errors
    const val = e.target.elements[0].value;
    setWaiting(true);

    if (label === 'password') {
      const values = Array.from(e.target.elements)
        .filter(({ tagName }) => tagName !== 'BUTTON')
        .map(x => x.value);

      const [currentPw, newPw, newPwCopy] = values;
      // we check the new passwords match on frontend, so only need to send one to backend
      if (newPw !== newPwCopy) {
        setErrors(['request_errors.fe_mismatch']);
        console.log(111, t('request_errors.fe_mismatch'));
        setWaiting(false);
      } else {
        // submit data
        apiChangePw(currentPw, newPw)
          .then(onResponseSuccess)
          .catch(onResponseFailure)
          .then(() => {
            window.location.reload();
          });
      }
    } else if (type === 'email') {
      // DISABLE; DANGEROUS
      if (!DEVELOPMENT)
        apiChangeEmail(value)
          .then(onResponseSuccess)
          .catch(onResponseFailure)
          .then(() => {
            window.location.reload();
          });
    } else {
      if (label === 'display_language') {
        dispatch(updateProfile({ display_language: val }));
        Cookies.set('frontendLang', val);
        i18n.changeLanguage(val);
      }
      mutateUserData({ [label]: val }, onResponseSuccess, onResponseFailure);
    }
  };

  useEffect(() => {
    if (textInput.current) {
      textInput.current.focus();
    }
  }, [textInput]);
  console.log({ errors });
  return (
    <ModalCard>
      <Text tag="h2" type={TextTypes.Heading2} center>
        {t('settings.edit_item', { item: t(`settings.personal_${label}`) })}
      </Text>
      <form onSubmit={handleSubmit}>
        <section className="inputs">
          {label === 'display_language' && (
            <Dropdown
              label={t('settings.personal_display_language')}
              inputRef={textInput}
              options={displayLanguages}
              value={valueIn}
            />
          )}
          {['email', 'password'].includes(label) && (
            <span className="warning-notice">
              {t(`settings.personal_${label}_change_warning`)}
            </span>
          )}
          {label === 'password' && <PassChange refIn={textInput} />}
          {[
            'first_name',
            'second_name',
            'email',
            'phone_mobile',
            'postal_code',
            'birth_year',
          ].includes(label) && (
            <TextInput
              label={t(`settings.personal_${label}`)}
              value={value}
              onChange={handleChange}
              inputRef={textInput}
            />
          )}
        </section>
        {/* errors?.root?.serverError */}
        <SubmitError $visible={errors.length}>
          {errors.map(errorTag => t(errorTag))}
          {/* {errors?.root?.serverError?.message} */}
        </SubmitError>
        <ButtonsContainer>
          <Button
            appearance={ButtonAppearance.Secondary}
            disabled={waiting}
            onClick={() => setEditing(false)}
          >
            {t('btn_cancel')}
          </Button>
          <Button type="submit" loading={waiting} disabled={waiting}>
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
      <div className="header">
        <Text tag="h2" type={TextTypes.Heading2} color="black">
          {t('settings.title')}
        </Text>
      </div>
      <div className="content panel">
        <section className="settings personal">
          <div className="settings-items">
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
          </div>
        </section>
      </div>
      <Modal open={editing} onClose={() => setEditing(false)}>
        {editing && (
          <EditFieldCard
            label={editing}
            valueIn={data[editing]}
            repeat={repeaters.includes(editing)}
            setEditing={setEditing}
          />
        )}
      </Modal>
      <Modal open={showConfirm} onClose={() => setShowConfirm(false)}>
        <DeleteAccountCard setShowModal={setShowConfirm} />
      </Modal>
    </>
  );
}

export default Settings;
