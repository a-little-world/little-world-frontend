import {
  Button,
  ButtonSizes,
  ButtonVariations,
  Text,
  TextInput,
  TextTypes,
} from "@a-little-world/little-world-design-system";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Provider, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";

import { login } from "../../api";
import { initialise } from "../../features/userData";
import { APP_ROUTE } from "../../routes";
import FormMessage, { MessageTypes } from "../atoms/FormMessage";
import { registerInput } from "./SignUp";
import { ChangeLocation, StyledCard, StyledCta, StyledForm, Title } from "./SignUp.styles";

const Login = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
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
      .then((data) => {
        data.json().then((data) => {
          console.log("INIT DATA", data);
          dispatch(initialise(data));
          setIsSubmitting(false);
          navigate(`/${APP_ROUTE}/`);
        });
      })
      .catch((error) => {
        onError(error);
        setIsSubmitting(false);
      });
  };

  return (
    <StyledCard>
      <Title tag="h2" type={TextTypes.Heading2}>
        {t("login.title")}
      </Title>
      <StyledForm onSubmit={handleSubmit(onFormSubmit)}>
        <TextInput
          {...registerInput({
            register,
            name: "email",
            options: { required: t("errorMsg.required") },
          })}
          id="email"
          label={t("login.email_label")}
          error={errors?.email?.message}
          placeholder={t("login.email_placeholder")}
          type="email"
        />
        <TextInput
          {...registerInput({
            register,
            name: "password",
            options: { required: t("errorMsg.required") },
          })}
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
          {t("login.forgot_password")}
        </Button>
        <FormMessage $visible={errors?.root?.serverError} $type={MessageTypes.Error}>
          {errors?.root?.serverError?.message}
        </FormMessage>
        <StyledCta
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
          size={ButtonSizes.Stretch}
        >
          {t("login.submit_btn")}
        </StyledCta>
        <ChangeLocation>
          <Text>{t("login.or")}</Text>
          <Text>{t("login.change_location_cta")}</Text>
        </ChangeLocation>
      </StyledForm>
    </StyledCard>
  );
};

export default Login;
