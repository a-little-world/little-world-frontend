import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import useSWR from 'swr';

import Cookies from 'js-cookie';
import { completeForm, mutateUserData } from '../../../api';
import { USER_FIELDS } from '../../../constants';
import {
  API_OPTIONS_ENDPOINT,
  USER_ENDPOINT,
} from '../../../features/swr/index';
import { onFormError } from '../../../helpers/form';
import {
  EDIT_FORM_ROUTE,
  PROFILE_ROUTE,
  USER_FORM_USER_TYPE,
  getAppRoute,
} from '../../../router/routes';
import {
  ComponentTypes,
  getFormComponent,
} from '../../../userForm/formContent';
import getFormPage from '../../../userForm/formPages';
import ProfilePic from '../Profile/ProfilePic/ProfilePic';
import CheckboxWithInput from '../WithInput/CheckboxWithInput/CheckboxWithInput';
import DropdownWithInput from '../WithInput/DropdownWithInput/DropdownWithInput';
import MultiCheckboxWithInput from '../WithInput/MultiCheckboxWithInput/MultiCheckboxWithInput';
import RadioGroupWithInput from '../WithInput/RadioGroupWithInput/RadioGroupWithInput';
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


// This is for Matomo, if enabled (default) it adds:
// a query param to the route when navigating from user-type -> self-info-1
// This allows to trigger seperate conversion on the 'self-info-1' step only for the selected user type
const MTM_ENABLE_CONVERSION_QUERY_PARAM = true;
// Serves the same purpose as the one above but instead users `_mtm.push` this is here for redundancy
const MTM_CUSTOM_USER_TYPE_EVENT_TRIGGER = true;
// Serves the same purpose as flags above, but instead uses a 'user-type' cookie
const MTM_ENABLE_USER_TYPE_COOKIE = true;

function runOptinalMatomoTriggers(userType: string, nextPage: string, navigate: (path: string) => void) {
  let matomoNavigationApplied = false;
  if (MTM_ENABLE_USER_TYPE_COOKIE) {
    Cookies.set('user-type', userType);
  }
  if (MTM_CUSTOM_USER_TYPE_EVENT_TRIGGER) {
    try {
      // eslint-disable-next-line no-underscore-dangle
      (window as any)._mtm.push({
        "event": userType === "volunteer" ? "userTypeVolunteerTrigger" : "userTypeLearnerTrigger",
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error setting custom Matomo triggers:', error);
    }
  }
  if (MTM_ENABLE_CONVERSION_QUERY_PARAM) {
    const [path, existingQuery] = nextPage.split('?');
    const searchParams = new URLSearchParams(existingQuery);
    searchParams.set('user-type', userType);
    const nextPageWithQueryParam = `${path}?${searchParams.toString()}`;
    navigate(getAppRoute(nextPageWithQueryParam));
    matomoNavigationApplied = true;
  }
  return matomoNavigationApplied;
}

const Form = () => {
  const { t } = useTranslation();

  const {
    control,
    clearErrors,
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
      forceMatchEligible: userData.forceMatchEligible,
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
    // (optional) run extra conversion triggers
    if (slug === USER_FORM_USER_TYPE && !isEditPath) {
      const userType = userData?.profile?.user_type;
      if (runOptinalMatomoTriggers(userType, nextPage, navigate)) {
        return; // If triggers where run we prevent further execution (else fallback to default behavior)
      }
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
          clearErrors={clearErrors}
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
      !component.allowedValues?.includes(watch(component.dataField));
    const warningTypeButHidden =
      component.type === ComponentTypes.warning && !displayWarning;

    return warningTypeButHidden ? null : (
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

  // Determine which error to display (prioritize server errors, then field errors)
  const serverError = errors?.root?.serverError;
  const imageError = errors?.[USER_FIELDS.image];
  const displayError = serverError || imageError;

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
        <SubmitError $visible={!!displayError}>
          {t(displayError?.message)}
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
