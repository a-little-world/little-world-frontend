import {
  Button,
  ButtonAppearance,
  ButtonVariations,
  TextInput,
  TextTypes,
} from "@a-little-world/little-world-design-system";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";

import { login } from "../../api";
import LanguageSelector from "../blocks/LanguageSelector/LanguageSelector";
import { StyledCard, StyledForm, SubmitError, Title } from "./Registration.styles";

const Login = () => {
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

    login(data)
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
        {t("login.title")}
      </Title>
      <StyledForm onSubmit={handleSubmit(onFormSubmit)}>
        <TextInput
          {...register("email", { required: t("errorMsg.required") })}
          id="email"
          label={t("login.email_label")}
          error={errors?.email?.message}
          placeholder={t("login.email_placeholder")}
          type="email"
        />
        <TextInput
          {...register("password", { required: t("errorMsg.required") })}
          id="password"
          error={errors?.password?.message}
          label={t("login.password_label")}
          placeholder={t("login.password_placeholder")}
          type="password"
        />

        <Button
          variation={ButtonVariations.Inline}
          onClick={() => navigate("/forgot-password")}
          color={theme.color.text.link}
        >
          {t(`${type}.forgotPassword`)}
        </Button>
        <SubmitError $visible={true || errors?.root?.serverError}>
          {errors?.root?.serverError?.message} Your Dad has issues bruv
        </SubmitError>
        <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
          {t(`${type}.submit-btn`)}
        </Button>
        <Button
          variation={ButtonVariations.Inline}
          onClick={() => navigate("/sign-up")}
          color={theme.color.text.link}
        >
          {t(`${type}.changeLocation.cta`)}
        </Button>
      </StyledForm>
    </StyledCard>
  );
};

export default Login;
