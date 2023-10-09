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
import styled, { useTheme } from "styled-components";

import LanguageSelector from "../blocks/LanguageSelector/LanguageSelector";
import { StyledCard, StyledForm, SubmitError, Title } from "./Registration.styles";

const SIGN_UP = "sign-up";
const LOGIN = "login";

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ResetPassword = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { pathname } = useLocation();
  const type = pathname.slice(1);

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
        {t("ResetPassword.title")}
      </Title>
      <StyledForm onSubmit={handleSubmit(onFormSubmit)}>
        <TextInput
          {...register("email", { required: t("errorMsg.required") })}
          id="email"
          label={t("ResetPassword.email_label")}
          error={errors?.email?.message}
          placeholder={t("ResetPassword.email_placeholder")}
          type="email"
        />
        <SubmitError $visible={true || errors?.root?.serverError}>
          {errors?.root?.serverError?.message} Your Dad has issues bruv
        </SubmitError>

        <Button type="submit" disabled={false} loading={false}>
          {t(`${type}.submit-btn`)}
        </Button>
      </StyledForm>
    </StyledCard>
  );
};

export default ResetPassword;
