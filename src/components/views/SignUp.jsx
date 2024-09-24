import {
  ButtonAppearance,
  ButtonSizes,
  Checkbox,
  InputWidth,
  Label,
  Link,
  MessageTypes,
  StatusMessage,
  Text,
  TextInput,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { signUp } from '../../api';
import { initialise } from '../../features/userData';
import { onFormError, registerInput } from '../../helpers/form.ts';
import {
  LOGIN_ROUTE,
  VERIFY_EMAIL_ROUTE,
  getAppRoute,
  passAuthenticationBoundary,
} from '../../routes.ts';
import {
  NameContainer,
  NameInputs,
  StyledCard,
  StyledCta,
  StyledForm,
  Title,
} from './SignUp.styles';

const SignUp = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // User can sign-up with a ?company='name' query
  // We take this query and store it as the 'lw-company' cookie so it doen't get lost on navigation
  const [searchParams, setSearchParams] = useSearchParams();
  const [company, setCompany] = useState(Cookies.get('lw-company', null));

  useEffect(() => {
    if (searchParams.has('company')) {
      Cookies.set('lw-company', searchParams.get('company'));
      setCompany(searchParams.get('company'));
      // Once the query param is stored in the cookie, we can remove it from the URL
      setSearchParams(new URLSearchParams());
    }
  }, [searchParams]);

  const {
    control,
    getValues,
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
    onFormError({ e, formFields: getValues(), setError });
  };

  const onFormSubmit = async data => {
    setIsSubmitting(true);

    signUp(data)
      .then(signUpData => {
        passAuthenticationBoundary();
        dispatch(initialise(signUpData));
        setIsSubmitting(false);
        const nextRoute = signUpData.user?.emailVerified ?
          getAppRoute() :
          getAppRoute(VERIFY_EMAIL_ROUTE);
        navigate(nextRoute);
      })
      .catch(onError);
  };

  return (
    <StyledCard>
      <Title tag="h2" type={TextTypes.Heading4}>
        {t('sign_up.title')}
      </Title>
      <StyledForm onSubmit={handleSubmit(onFormSubmit)}>
        <NameContainer>
          {company && (
            <>
              <Label
                bold
                htmlFor="company"
                toolTipText={t('sign_up.company_tooltip')}
              >
                {t('sign_up.company_name_label')}: {company}
              </Label>
              <div
                style={{
                  display: 'none',
                }}
              >
                <TextInput
                  {...registerInput({
                    register,
                    name: 'company',
                  })}
                  defaultValue={company}
                  style={{ display: 'none' }}
                  id="company"
                  error={t(errors?.company?.message)}
                  type="text"
                />
              </div>
            </>
          )}
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
        <Text>{t('sign_up.privacy_policy')}</Text>
        <StatusMessage
          $visible={errors?.root?.serverError}
          $type={MessageTypes.Error}
        >
          {t(errors?.root?.serverError?.message)}
        </StatusMessage>
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
          buttonSize={ButtonSizes.Stretch}
        >
          {t('sign_up.change_location_cta')}
        </Link>
      </StyledForm>
    </StyledCard>
  );
};

export default SignUp;
