import {
  ButtonAppearance,
  ButtonSizes,
  Checkbox,
  InputWidth,
  Label,
  Link,
  Text,
  TextInput,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { signUp } from '../../api';
import { initialise } from '../../features/userData';
import { LOGIN_ROUTE, VERIFY_EMAIL_ROUTE } from '../../routes';
import FormMessage, { MessageTypes } from '../atoms/FormMessage';
import {
  NameContainer,
  NameInputs,
  StyledCard,
  StyledCta,
  StyledForm,
  Title,
} from './SignUp.styles';

export const registerInput = ({ register, name, options }) => {
  const { ref, ...rest } = register(name, options);

  return {
    ...rest,
    inputRef: ref,
  };
};

const SignUp = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setFocus,
  } = useForm({ shouldUnregister: true });

  useEffect(() => {
    setFocus('firstName');
  }, [setFocus]);

  const onError = e => {
    setIsSubmitting(false);
    console.log({ e });
    if (e?.message) {
      setError(
        e.cause ?? 'root.serverError',
        { type: 'custom', message: t(e.message) },
        { shouldFocus: true },
      );
    } else {
      setError('root.serverError', {
        type: 'custom',
        message: t('validation.generic_try_again'),
      });
    }
  };

  const onFormSubmit = async data => {
    setIsSubmitting(true);

    signUp(data)
      .then(signUpData => {
        console.log(signUpData);
        dispatch(initialise(signUpData));
        setIsSubmitting(false);
        navigate(`/${VERIFY_EMAIL_ROUTE}/`);
      })
      .catch(onError);
  };

  return (
    <StyledCard>
      <Title tag="h2" type={TextTypes.Heading2}>
        {t('sign_up.title')}
      </Title>
      <StyledForm onSubmit={handleSubmit(onFormSubmit)}>
        <NameContainer>
          <Label bold htmlFor="name" toolTipText={t('sign_up.name_tooltip')}>
            {t('sign_up.name_label')}
          </Label>
          <NameInputs>
            <TextInput
              {...registerInput({
                register,
                name: 'firstName',
                options: { required: 'error.required' },
              })}
              id="firstName"
              error={t(errors?.firstName?.message)}
              placeholder={t('sign_up.first_name_placeholder')}
              type="text"
            />
            <TextInput
              {...registerInput({
                register,
                name: 'lastName',
                options: { required: 'error.required' },
              })}
              id="lastName"
              error={t(errors?.lastName?.message)}
              placeholder={t('sign_up.second_name_placeholder')}
              type="text"
            />
          </NameInputs>
        </NameContainer>
        <TextInput
          {...registerInput({
            register,
            name: 'email',
            options: { required: 'error.required' },
          })}
          id="email"
          label={t('sign_up.email_label')}
          error={t(errors?.email?.message)}
          placeholder={t('sign_up.email_placeholder')}
          type="email"
        />
        <TextInput
          {...registerInput({
            register,
            name: 'password',
            options: {
              required: 'error.required',
              minLength: { message: 'error.password_min_length', value: 8 },
            },
          })}
          id="password"
          error={t(errors?.password?.message)}
          label={t('sign_up.password_label')}
          placeholder={t('sign_up.password_placeholder')}
          type="password"
        />
        <TextInput
          {...registerInput({
            register,
            name: 'confirmPassword',
            options: {
              required: 'error.required',
              validate: (v, values) =>
                values.password === v || t('error.passwords_do_not_match'),
              minLength: { message: 'error.password_min_length', value: 8 },
            },
          })}
          label={t('sign_up.confirm_password_label')}
          id="confirmPassword"
          error={t(errors?.confirmPassword?.message)}
          type="password"
        />
        <TextInput
          {...registerInput({
            register,
            name: 'birthYear',
            options: { required: 'error.required' },
          })}
          label={t('sign_up.birth_year_label')}
          labelTooltip={t('sign_up.birth_year_tooltip')}
          id="birthYear"
          error={t(errors?.birthYear?.message)}
          placeholder={t('sign_up.birth_year_placeholder')}
          type="number"
          width={InputWidth.Small}
          min={1900}
          max={2007}
        />
        <Controller
          defaultValue={false}
          name="mailingList"
          control={control}
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { error },
          }) => (
            <Checkbox
              id="mailingList"
              name={name}
              inputRef={ref}
              onCheckedChange={val => onChange({ target: { value: val } })}
              onBlur={onBlur}
              value={value}
              error={t(error?.message)}
              label={t('sign_up.mailing_list_label')}
              required={false}
            />
          )}
        />
        <Controller
          defaultValue={false}
          name="terms"
          control={control}
          rules={{ required: 'error.required' }}
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { error },
          }) => (
            <Checkbox
              id="terms"
              name={name}
              inputRef={ref}
              onCheckedChange={val => onChange({ target: { value: val } })}
              onBlur={onBlur}
              value={value}
              error={t(error?.message)}
              label={t('sign_up.terms_label')}
            />
          )}
        />
        <Text bold>{t('sign_up.privacy_policy')}</Text>
        <FormMessage
          $visible={errors?.root?.serverError}
          $type={MessageTypes.Error}
        >
          {errors?.root?.serverError?.message}
        </FormMessage>
        <StyledCta
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
          size={ButtonSizes.Stretch}
        >
          {t('sign_up.submit_btn')}
        </StyledCta>
        <Link
          to={`/${LOGIN_ROUTE}`}
          buttonAppearance={ButtonAppearance.Secondary}
        >
          {t('sign_up.change_location_cta')}
        </Link>
      </StyledForm>
    </StyledCard>
  );
};

export default SignUp;
