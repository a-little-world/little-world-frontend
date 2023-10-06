import {
  Button,
  ButtonAppearance,
  ProgressBar,
  TextTypes,
} from "@a-little-world/little-world-design-system";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLoaderData, useNavigate } from "react-router-dom";

import { mutateUserData } from "../../../api";
import { ComponentTypes, getFormComponent } from "../../../userForm/formContent";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import Note from "../Note/Note";
import ProfilePic from "../ProfilePic/ProfilePic";
import FormStep from "./FormStep";
import { ButtonsSection, StyledCard, StyledForm, SubmitError, Title } from "./styles";

const Form = () => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm({ shouldUnregister: true });

  const {
    formContent: { title, note, step, totalSteps, components, nextPage, prevPage },
  } = useLoaderData();
  const navigate = useNavigate();

  const navigateNextClick = () => {
    navigate(nextPage);
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    navigate(prevPage);
  };

  const onError = (e) => {
    console.log({ e });
    if (e.message) {
      setError(
        e.cause ?? "root.serverError",
        { type: "custom", message: t(e.message) },
        { shouldFocus: true }
      );
    } else {
      setError("root.serverError", {
        type: "custom",
        message: t(e.message) || t("validation.generic_try_again"),
      });
    }
  };

  const onFormSubmit = async (data) => {
    console.log({ data });
    mutateUserData(data, navigateNextClick, onError);
  };

  return (
    <StyledCard>
      <LanguageSelector />
      <StyledForm onSubmit={handleSubmit(onFormSubmit)}>
        <Title tag="h2" type={TextTypes.Heading2}>
          {t(title)}
        </Title>
        {step && <ProgressBar max={totalSteps} value={step} />}
        {note && <Note>{t(note)}</Note>}
        {components.map((component, index) => {
          // ProfilePic updates multiple data fields
          if (component?.type === ComponentTypes.picture)
            return <ProfilePic key={ProfilePic.name} control={control} setValue={setValue} />;

          return (
            <FormStep
              key={`FormStep Component ${index} ${component?.dataField}`}
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
            <Button appearance={ButtonAppearance.Secondary} onClick={handleBackClick} type="button">
              {t("btn.back")}
            </Button>
          )}
          <Button type="submit">{t("btn.next")}</Button>
        </ButtonsSection>
      </StyledForm>
    </StyledCard>
  );
};

export default Form;
