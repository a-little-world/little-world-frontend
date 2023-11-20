import {
  ButtonSizes,
  Checkbox,
  InputWidth,
  Label,
  Text,
  TextInput,
  TextTypes,
} from "@a-little-world/little-world-design-system";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { signUp } from "../../api";
import FormMessage, { MessageTypes } from "../atoms/FormMessage";
import {
  NameContainer,
  NameInputs,
  StyledCard,
  StyledCta,
  StyledForm,
  Title,
} from "./SignUp.styles";

export const registerInput = ({ register, name, options }) => {
  const { ref, ...rest } = register(name, options);
  return {
    ...rest,
    inputRef: ref,
  };
};

const SignUp = () => {
  const { t } = useTranslation();
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

    signUp(data)
      .then(() => {
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
      <Title tag="h2" type={TextTypes.Heading2}>
        {t("sign_up.title")}
      </Title>
      <StyledForm onSubmit={handleSubmit(onFormSubmit)}>
        <NameContainer>
          <Label bold htmlFor="name" toolTipText={t("sign_up.name_tooltip")}>
            {t("sign_up.name_label")}
          </Label>
          <NameInputs>
            <TextInput
              {...registerInput({
                register,
                name: "firstName",
                options: { required: t("errorMsg.required") },
              })}
              id="firstName"
              error={errors?.firstName?.message}
              placeholder={t("sign_up.first_name_placeholder")}
              type="text"
            />
            <TextInput
              {...registerInput({
                register,
                name: "lastName",
                options: { required: t("errorMsg.required") },
              })}
              id="lastName"
              error={errors?.lastName?.message}
              placeholder={t("sign_up.second_name_placeholder")}
              type="text"
            />
          </NameInputs>
        </NameContainer>
        <TextInput
          {...registerInput({
            register,
            name: "email",
            options: { required: t("errorMsg.required") },
          })}
          id="email"
          label={t("sign_up.email_label")}
          error={errors?.email?.message}
          placeholder={t("sign_up.email_placeholder")}
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
          label={t("sign_up.password_label")}
          placeholder={t("sign_up.password_placeholder")}
          type="password"
        />
        <TextInput
          {...registerInput({
            register,
            name: "confirmPassword",
            options: {
              required: t("errorMsg.required"),
              passwordsMatch: (v) => getValues().password === v || t("confirmPasswordError"),
            },
          })}
          label={t("sign_up.confirm_password_label")}
          id="confirmPassword"
          error={errors?.confirmPassword?.message}
          type="password"
        />
        <TextInput
          {...registerInput({
            register,
            name: "birthYear",
            options: { required: t("errorMsg.required") },
          })}
          label={t("sign_up.birth_year_label")}
          labelTooltip={t("sign_up.birth_year_tooltip")}
          id="birthYear"
          error={errors?.birthYear?.message}
          placeholder={t("sign_up.birth_year_placeholder")}
          type="number"
          width={InputWidth.Small}
          min={1900}
          max={2007}
        />
        <Checkbox
          {...registerInput({
            register,
            name: "terms",
            options: { required: t("errorMsg.required") },
          })}
          error={errors?.terms?.message}
          label={t("sign_up.terms_label")}
        />
        <Text bold>{t("sign_up.privacy_policy")}</Text>
        <FormMessage $visible={errors?.root?.serverError} $type={MessageTypes.Error}>
          {errors?.root?.serverError?.message}
        </FormMessage>
        <StyledCta
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
          size={ButtonSizes.Stretch}
        >
          {t("sign_up.submit_btn")}
        </StyledCta>
        <Text>{t("sign_up.change_location_cta")}</Text>
      </StyledForm>
    </StyledCard>
  );
};

export default SignUp;

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
