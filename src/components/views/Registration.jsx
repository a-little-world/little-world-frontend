import {
  Button,
  ButtonAppearance,
  ButtonVariations,
  Checkbox,
  Label,
  Text,
  TextInput,
  TextTypes,
} from "@a-little-world/little-world-design-system";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";

import { signUp } from "../../api";
import LanguageSelector from "../blocks/LanguageSelector/LanguageSelector";
import {
  NameContainer,
  NameInputs,
  StyledCard,
  StyledForm,
  SubmitError,
  Title,
} from "./Registration.styles";

const Registration = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { pathname } = useLocation();
  const type = pathname.slice(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setFocus,
  } = useForm({ shouldUnregister: true });

  const navigate = useNavigate();

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  const onError = (e) => {
    console.log({ e });
    if (e?.message) {
      setError(
        e.cause ?? "root.serverError",
        { type: "custom", message: t(e.message) },
        { shouldFocus: true }
      );
    } else {
      setError("root.serverError", {
        type: "custom",
        message: t(e?.message) || t("validation.generic_try_again"),
      });
    }
  };

  const onFormSubmit = async (data) => {
    setIsSubmitting(true);

    signUp(data)
      .then((res) => {
        const userHash = "";
        setIsSubmitting(false);
        navigate("/app");
      })
      .error((error) => {
        onError(error);
        setIsSubmitting(false);
      });
  };

  return (
    <StyledCard>
      <LanguageSelector />
      <Title tag="h2" type={TextTypes.Heading2}>
        {t("registration.title")}
      </Title>
      <StyledForm onSubmit={handleSubmit(onFormSubmit)}>
        <NameContainer>
          <Label bold htmlFor="name" toolTipText={t("registration.name_tooltip")}>
            {t("registration.name_label")}
          </Label>
          <NameInputs>
            <TextInput
              {...register("firstName", { required: t("errorMsg.required") })}
              id="firstName"
              error={errors?.email?.message}
              placeholder={t("registration.first_name_placeholder")}
              type="text"
            />
            <TextInput
              {...register("secondName", { required: t("errorMsg.required") })}
              id="secondName"
              error={errors?.email?.message}
              placeholder={t("registration.second_name_placeholder")}
              type="text"
            />
          </NameInputs>
        </NameContainer>
        <TextInput
          {...register("email", { required: t("errorMsg.required") })}
          id="email"
          label={t("registration.email_label")}
          error={errors?.email?.message}
          placeholder={t("registration.email_placeholder")}
          type="email"
        />
        <TextInput
          {...register("password", { required: t("errorMsg.required") })}
          id="password"
          error={errors?.password?.message}
          label={t("registration.password_label")}
          placeholder={t("registration.password_placeholder")}
          type="password"
        />
        <TextInput
          {...register("confirmPassword", {
            required: t("errorMsg.required"),
            passwordsMatch: (v) => getValues().password === v || t("confirmPasswordError"),
          })}
          label={t("registration.confirm_password_label")}
          id="confirmPassword"
          error={errors?.confirmPassword?.message}
          placeholder={t("registration.confirm_password_placeholder")}
          type="password"
        />
        <TextInput
          {...register("birthYear", { required: t("errorMsg.required") })}
          label={t("registration.birth_year_label")}
          id="birthYear"
          error={errors?.email?.message}
          placeholder={t("registration.birth_year_placeholder")}
          type="number"
          min={1900}
          max={2007}
        />
        <Checkbox
          {...register("terms", { required: t("errorMsg.required") })}
          label={t("registration.terms_label")}
        />
        <Text bold>{t("registration.privacy_policy")}</Text>
        <SubmitError $visible={true || errors?.root?.serverError}>
          {errors?.root?.serverError?.message} Your Dad has issues bruv
        </SubmitError>
        <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
          {t(`${type}.submit-btn`)}
        </Button>
        <Button
          variation={ButtonVariations.Inline}
          onClick={() => navigate("/login")}
          color={theme.color.text.link}
        >
          {t(`${type}.changeLocation.cta`)}
        </Button>
      </StyledForm>
    </StyledCard>
  );
};

export default Registration;

//   const handleOnChange = useCallback(
//     throttle(
//       (event) => {
//         clearErrors("submit");
//         onChange();
//         event.persist();
//       },
//       1000,
//       { trailing: false }
//     ),
//     [onChange, clearErrors]
//   );

//   const register = (name, validation) => {
//     const { onChange, ...rest } = register(name, {
//       required: t("errorMsg.required"),
//       ...validation,
//     });
//     return {
//       ...rest,
//       onChange: (e) => {
//         onChange(e);
//         handleOnChange(e);
//       },
//     };
//   };
