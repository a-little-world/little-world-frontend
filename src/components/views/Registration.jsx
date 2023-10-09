import {
  Button,
  ButtonAppearance,
  ButtonVariations,
  TextInput,
} from "@a-little-world/little-world-design-system";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { StyledCard, StyledForm, SubmitError, Title } from "../blocks/Form/styles";
import LanguageSelector from "../blocks/LanguageSelector/LanguageSelector";

const SIGN_UP = "sign-up";
const LOGIN = "login";

const Registration = () => {
  const { t } = useTranslation();
  const location = useLocation();
  console.log({ location });
  const isSignUp = location === SIGN_UP;
  const isLogin = location === LOGIN;
  const type = location;

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
  };

  return (
    <StyledCard>
      <LanguageSelector />
      <StyledForm onSubmit={handleSubmit(onFormSubmit)}>
        <Title>{t("registration.title")}</Title>
        <TextInput
          {...register("email", { required: t("errorMsg.required") })}
          id="email"
          error={errors.email.message}
          placeholder={t("registration.email_placeholder")}
          type="email"
        />
        <TextInput
          {...register("password", { required: t("errorMsg.required") })}
          id="password"
          error={errors.password.message}
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

        <Button variation={ButtonVariations.Inline} onClick={() => navigate("forgot-password")}>
          {t(`${type}.changeLocation.cta`)}
        </Button>
        {isLogin && (
          <Button variation={ButtonVariations.Inline} onClick={() => navigate("forgot-password")}>
            {t(`${type}.forgotPassword`)}
          </Button>
        )}
        <SubmitError $visible={errors?.root?.serverError}>
          {errors?.root?.serverError?.message}
        </SubmitError>
        <Button type="submit" disabled={false} text={t(`${type}.submitBtn`)} loading={false} />
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
