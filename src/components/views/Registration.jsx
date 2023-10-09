import {
  Button,
  ButtonAppearance,
  ButtonVariations,
  TextInput,
  TextTypes,
} from "@a-little-world/little-world-design-system";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";

import LanguageSelector from "../blocks/LanguageSelector/LanguageSelector";
import { StyledCard, StyledForm, SubmitError, Title } from "./Registration.styles";

const SIGN_UP = "sign-up";
const LOGIN = "login";

const Registration = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { pathname } = useLocation();
  const type = pathname.slice(1);
  const isSignUp = type === SIGN_UP;
  const isLogin = type === LOGIN;

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
    console.log({ data });
  };
  console.log({ theme });

  return (
    <StyledCard>
      <LanguageSelector />
      <Title tag="h2" type={TextTypes.Heading2}>
        {t("registration.title")}
      </Title>
      <StyledForm onSubmit={handleSubmit(onFormSubmit)}>
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
        {isSignUp && (
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
        )}
        {isLogin && (
          <Button
            variation={ButtonVariations.Inline}
            onClick={() => navigate("/forgot-password")}
            color={theme.color.text.link}
          >
            {t(`${type}.forgotPassword`)}
          </Button>
        )}
        <SubmitError $visible={true || errors?.root?.serverError}>
          {errors?.root?.serverError?.message} Your Dad has issues bruv
        </SubmitError>
        <Button type="submit" disabled={false} loading={false}>
          {t(`${type}.submit-btn`)}
        </Button>
        <Button
          variation={ButtonVariations.Inline}
          onClick={() => navigate(isLogin ? SIGN_UP : LOGIN)}
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
