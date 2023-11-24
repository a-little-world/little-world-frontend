import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  Text,
  TextInput,
  TextTypes,
} from "@a-little-world/little-world-design-system";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled, { useTheme } from "styled-components";

import { resendVerificationEmail, verifyEmail } from "../../api";
import { CHANGE_EMAIL_ROUTE, LOGIN_ROUTE } from "../../routes";
import FormMessage, { MessageTypes } from "../atoms/FormMessage";
import { registerInput } from "./SignUp";
import { Buttons, FormDescription, StyledCard, StyledForm, Title } from "./SignUp.styles";

const HelpText = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const VerifyEmail = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSuccessful, setRequestSuccessful] = useState(false);
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setFocus,
  } = useForm({ shouldUnregister: true });

  const navigate = useNavigate();

  useEffect(() => {
    setFocus("verificationCode");
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

  const onResendCode = async () => {
    setIsSubmitting(true);

    resendVerificationEmail()
      .then(() => setRequestSuccessful(true))
      .catch(onError);
  };

  const onFormSubmit = async ({ verificationCode }) => {
    setIsSubmitting(true);
    verifyEmail({ verificationCode }).catch(onError);
  };

  const email = "seanblundell@gmail.com";

  return (
    <StyledCard>
      <Title tag="h2" type={TextTypes.Heading2}>
        {t("verify_email.title")}
      </Title>
      <FormDescription>{t("verify_email.description", { email })}</FormDescription>
      <StyledForm onSubmit={handleSubmit(onFormSubmit)}>
        <TextInput
          {...registerInput({
            register,
            name: "verficationCode",
            options: { required: t("error.required") },
          })}
          id="text"
          label={t("verify_email.input_label")}
          error={errors?.verificationCode?.message}
          placeholder={t("verify_email.code_placeholder")}
          type="number"
        />
        <Button
          variation={ButtonVariations.Inline}
          color={theme.color.text.link}
          onClick={onResendCode}
        >
          {t("verify_email.resend_code")}
        </Button>
        <HelpText>{t("verify_email.help_text")}</HelpText>
        <FormMessage
          $visible={requestSuccessful || errors?.root?.serverError}
          $type={requestSuccessful ? MessageTypes.Success : MessageTypes.Error}
        >
          {requestSuccessful
            ? t("verify_email.success_message")
            : errors?.root?.serverError?.message}
        </FormMessage>
        <Buttons>
          <Button
            appearance={ButtonAppearance.Secondary}
            onClick={() => navigate(`/${CHANGE_EMAIL_ROUTE}`)}
            color={theme.color.text.link}
            size={ButtonSizes.Medium}
          >
            {t("verify_email.change_email_btn")}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            size={ButtonSizes.Medium}
          >
            {t("verify_email.submit_btn")}
          </Button>
        </Buttons>
      </StyledForm>
    </StyledCard>
  );
};

export default VerifyEmail;
