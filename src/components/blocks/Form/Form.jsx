import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import useSWR from 'swr';

import { completeForm, mutateUserData } from '../../../api';
import {
  API_OPTIONS_ENDPOINT,
  USER_ENDPOINT,
} from '../../../features/swr/index.ts';
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
import ProfilePic from '../Profile/ProfilePic/ProfilePic.tsx';
import CheckboxWithInput from '../WithInput/CheckboxWithInput/CheckboxWithInput.tsx';
import DropdownWithInput from '../WithInput/DropdownWithInput/DropdownWithInput.jsx';
import MultiCheckboxWithInput from '../WithInput/MultiCheckboxWithInput/MultiCheckboxWithInput.tsx';
import RadioGroupWithInput from '../WithInput/RadioGroupWithInput/RadioGroupWithInput.jsx';
import FormStep from './FormStep';
import {
  FormButtons,
  GroupedRow,
  StyledCard,
  StyledForm,
  StyledNote,
  StyledProgress,
  SubmitError,
  Title,
} from './styles';

const Form = () => {
  const { t } = useTranslation();

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
    watch,
  } = useForm({ shouldUnregister: true });

  const { data: userData, mutate: mutateUserDataApi } = useSWR(USER_ENDPOINT, {
    revalidateOnMount: false,
    revalidateOnFocus: false,
  });
  const { data: apiOptions } = useSWR(API_OPTIONS_ENDPOINT, {
    revalidateOnMount: false,
    revalidateOnFocus: false,
  });
  const formOptions = apiOptions?.profile;

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
    mutateUserDataApi({
      ...userData,
      profile: { ...userData.profile, ...response },
    });
    if (isLastStep && !userData?.userFormCompleted) {
      completeForm().then(updatedUser => {
        mutateUserDataApi({
          ...userData,
          profile: { ...userData.profile, ...updatedUser },
        });
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

  const renderComponent = component => {
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

    const displayWarning =
      component.type === ComponentTypes.warning &&
      watch(component.dataField) &&
      watch(component.dataField) !== component.value;

    return component.type === ComponentTypes.warning &&
      !displayWarning ? null : (
      <FormStep
        key={`FormStep Component ${component?.dataField}`}
        control={control}
        content={getFormComponent(component, t)}
      />
    );
  };

  const renderComponents = () => {
    const result = [];
    let groupBuffer = [];

    components.forEach((component, index) => {
      if (component.grouped) {
        groupBuffer.push(renderComponent(component));
      } else {
        // If we have grouped components in buffer, render them first
        if (groupBuffer.length > 0) {
          result.push(
            <GroupedRow key={`group-${component.dataField || index}`}>
              {groupBuffer}
            </GroupedRow>,
          );

          groupBuffer = [];
        }

        // Render current ungrouped component
        result.push(renderComponent(component));
      }
    });

    // Don't forget any remaining grouped components
    if (groupBuffer.length > 0) {
      result.push(<GroupedRow key="group-final">{groupBuffer}</GroupedRow>);
    }

    return result;
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
        {renderComponents()}
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
