import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  ProgressBar,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { completeForm, mutateUserData } from '../../../api';
import { updateProfile } from '../../../features/userData';
import { getAppRoute } from '../../../routes';
import {
  ComponentTypes,
  getFormComponent,
} from '../../../userForm/formContent';
import getFormPage from '../../../userForm/formPages';
import DropdownWithInput from '../DropdownWithInput/DropdownWithInput';
import Note from '../Note/Note';
import ProfilePic from '../ProfilePic/ProfilePic';
import RadioGroupWithInput from '../RadioGroupWithInput/RadioGroupWithInput';
import FormStep from './FormStep';
import {
  ButtonsSection,
  StyledCard,
  StyledForm,
  SubmitError,
  Title,
} from './styles';

const Form = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
  } = useForm({ shouldUnregister: true });

  const [formOptions, userData] = useSelector(state => [
    state.userData.formOptions,
    state.userData.user.profile,
  ]);
  const navigate = useNavigate();
  const location = useLocation();
  const slug = location.pathname.split('/').slice(-1)[0];

  const { title, note, step, totalSteps, components, nextPage, prevPage } =
    getFormPage({
      slug,
      formOptions,
      userData,
    });

  const onFormSuccess = response => {
    dispatch(updateProfile(response));
    if (step === totalSteps) completeForm();
    navigate(getAppRoute(nextPage));
  };

  const handleBackClick = e => {
    e.preventDefault();
    reset({ values: {} });
    navigate(getAppRoute(prevPage));
  };

  const onError = e => {
    if (e.message) {
      setError(
        e.cause ?? 'root.serverError',
        { type: 'custom', message: t(e.message) },
        { shouldFocus: true },
      );
    } else {
      setError('root.serverError', {
        type: 'custom',
        message: t(e.message) || t('validation.generic_try_again'),
      });
    }
  };

  const onFormSubmit = async data => {
    mutateUserData(data, onFormSuccess, onError);
  };

  return (
    <StyledCard>
      <Title tag="h2" type={TextTypes.Heading2}>
        {t(title)}
      </Title>
      <StyledForm onSubmit={handleSubmit(onFormSubmit)}>
        {step && <ProgressBar max={totalSteps} value={step} />}
        {note && <Note>{t(note)}</Note>}
        {components.map(component => {
          // ProfilePic updates multiple data fields
          if (component?.type === ComponentTypes.picture)
            return (
              <ProfilePic
                key={ProfilePic.name}
                control={control}
                setValue={setValue}
              />
            );

          if (component?.type === ComponentTypes.radioWithInput)
            return (
              <RadioGroupWithInput
                key={RadioGroupWithInput.name}
                control={control}
                {...component}
              />
            );

          if (component?.type === ComponentTypes.dropdownWithInput)
            return (
              <DropdownWithInput
                key={DropdownWithInput.name}
                control={control}
                {...component}
              />
            );

          return (
            <FormStep
              key={`FormStep Component ${component?.dataField}`}
              control={control}
              content={getFormComponent(component, t)}
            />
          );
        })}
        <SubmitError $visible={errors?.root?.serverError}>
          {errors?.root?.serverError?.message}
        </SubmitError>
        <ButtonsSection $hasBackBtn={Boolean(prevPage)}>
          {Boolean(prevPage) && (
            <Button
              appearance={ButtonAppearance.Secondary}
              onClick={handleBackClick}
              size={ButtonSizes.Small}
              type="button"
            >
              {t('btn.back')}
            </Button>
          )}
          <Button type="submit" size={ButtonSizes.Small}>
            {t('btn.next')}
          </Button>
        </ButtonsSection>
      </StyledForm>
    </StyledCard>
  );
};

export default Form;
