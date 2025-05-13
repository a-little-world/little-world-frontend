import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { completeForm, mutateUserData } from '../../../api';
import { updateProfile, updateUser } from '../../../features/userData';
import { onFormError } from '../../../helpers/form.ts';
import {
  EDIT_FORM_ROUTE,
  PROFILE_ROUTE,
  getAppRoute,
} from '../../../router/routes.ts';
import {
  ComponentTypes,
  getFormComponent,
} from '../../../userForm/formContent.ts';
import getFormPage from '../../../userForm/formPages';
import ProfilePic from '../Profile/ProfilePic/ProfilePic';
import CheckboxWithInput from '../WithInput/CheckboxWithInput/CheckboxWithInput.tsx';
import DropdownWithInput from '../WithInput/DropdownWithInput/DropdownWithInput.jsx';
import MultiCheckboxWithInput from '../WithInput/MultiCheckboxWithInput/MultiCheckboxWithInput.tsx';
import RadioGroupWithInput from '../WithInput/RadioGroupWithInput/RadioGroupWithInput.jsx';
import FormStep from './FormStep';
import {
  FormButtons,
  StyledCard,
  StyledForm,
  StyledNote,
  StyledProgress,
  SubmitError,
  Title,
} from './styles';

const Form = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
  } = useForm({ shouldUnregister: true });

  const [formOptions, userData] = useSelector(state => [
    state.userData.formOptions,
    state.userData.user,
  ]);

  const navigate = useNavigate();
  const location = useLocation();
  const paths = location.pathname.split('/');
  const slug = paths.slice(-1)[0];
  const isEditPath = paths[2] === EDIT_FORM_ROUTE;

  const { title, note, step, totalSteps, components, nextPage, prevPage } =
    getFormPage({
      slug,
      formOptions,
      userData: userData.profile,
    });
  const isLastStep = step === totalSteps;

  const onFormSuccess = response => {
    dispatch(updateProfile(response));
    if (isLastStep && !userData?.userFormCompleted) {
      completeForm().then(updatedUser => {
        dispatch(updateUser(updatedUser));
      });
    }
    navigate(getAppRoute(isEditPath ? PROFILE_ROUTE : nextPage));
  };

  const handleBackClick = e => {
    e.preventDefault();
    reset({ values: {} });
    navigate(getAppRoute(isEditPath ? PROFILE_ROUTE : prevPage));
  };

  const onError = e => {
    onFormError({ e, formFields: getValues(), setError });
  };

  const onFormSubmit = async data => {
    mutateUserData(data, onFormSuccess, onError);
  };

  return (
    <StyledCard>
      <Title tag="h2" type={TextTypes.Heading4}>
        {t(title)}
      </Title>
      <StyledForm onSubmit={handleSubmit(onFormSubmit)}>
        {step && !isEditPath && (
          <StyledProgress max={totalSteps} value={step} />
        )}
        {note && <StyledNote>{t(note)}</StyledNote>}
        {components.map(component => {
          // ProfilePic updates multiple data fields
          if (component?.type === ComponentTypes.picture)
            return (
              <ProfilePic
                key={ProfilePic.name}
                control={control}
                setValue={setValue}
                setError={setError}
              />
            );

          if (component?.type === ComponentTypes.radioWithInput)
            return (
              <RadioGroupWithInput
                key={`${RadioGroupWithInput.name} ${component?.id}`}
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

          if (component?.type === ComponentTypes.checkboxWithInput)
            return (
              <CheckboxWithInput
                key={CheckboxWithInput.name}
                control={control}
                {...component}
              />
            );

          if (component?.type === ComponentTypes.multiCheckboxWithInput)
            return (
              <MultiCheckboxWithInput
                key={MultiCheckboxWithInput.name}
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
          {t(errors?.root?.serverError?.message)}
        </SubmitError>
        <FormButtons $onlyOneBtn={Boolean(!prevPage)}>
          {Boolean(prevPage) && (
            <Button
              appearance={ButtonAppearance.Secondary}
              onClick={handleBackClick}
              size={ButtonSizes.Small}
              type="button"
            >
              {t('form.btn_back')}
            </Button>
          )}
          <Button type="submit" size={ButtonSizes.Small}>
            {t(`form.btn_${isLastStep ? 'complete' : 'next'}`)}
          </Button>
        </FormButtons>
      </StyledForm>
    </StyledCard>
  );
};

export default Form;
