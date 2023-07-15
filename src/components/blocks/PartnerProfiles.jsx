import {
  Button,
  Card,
  CardSizes,
  Modal,
  Text,
  TextArea,
  TextTypes,
} from "@a-little-world/little-world-design-system";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { reportMatch, unmatch } from "../../api";
import { BACKEND_URL } from "../../ENVIRONMENT";
import { updateSearching } from "../../features/userData";
import { ProfileBox } from "../../profile";

export const PARTNER_ACTION_REPORT = "report";
export const PARTNER_ACTION_UNMATCH = "unmatch";

const PartnerActionForm = styled.form`
  display: flex;
  flex-direction: column;
  ${({ theme }) => `
  gap: ${theme.spacing.medium};
  `};
`;

function PartnerProfiles({ setCallSetupPartner, matchesOnlineStates, setShowCancel }) {
  const { t } = useTranslation();
  const { control, handleSubmit, setError, reset } = useForm();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.userData.users);
  const matchState = useSelector((state) => state.userData.self.stateInfo.matchingState);
  const [partnerActionData, setPartnerActionData] = useState(null);

  function updateUserMatchingState() {
    const updatedState = "searching";
    fetch(`${BACKEND_URL}/api/user/search_state/${updatedState}`, {
      method: "POST",
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        console.error("server error", response.status, response.statusText);
        return false;
      })
      .then((response) => {
        if (response) {
          // If this request works, we can safely update our state to 'searching'
          dispatch(updateSearching(updatedState));
        }
      })
      .catch((error) => console.error(error));
  }

  const handlePartnerAction = (formData) => {
    console.log({ formData });
    const action = partnerActionData.type === PARTNER_ACTION_UNMATCH ? unmatch : reportMatch;

    action({ userPk: partnerActionData.userPk, reason: formData.reason })
      .then(() => setPartnerActionData(null))
      .catch(() =>
        setError("root.serverError", {
          type: "server",
          message: t(`${partnerActionData.type}_modal_reason_error_server`),
        })
      );
  };

  const onModalClose = () => {
    setPartnerActionData(null);
    reset();
  };

  return (
    <div className="profiles">
      {users
        .filter(({ type }) => type !== "self")
        .map((user) => {
          return (
            <ProfileBox
              key={user.userPk}
              {...user}
              openPartnerModal={setPartnerActionData}
              setCallSetupPartner={setCallSetupPartner}
              isOnline={matchesOnlineStates[user.userPk]}
            />
          );
        })}
      {["idle"].includes(matchState) && (
        <button type="button" className="match-status find-new" onClick={updateUserMatchingState}>
          <img alt="plus" />
          {matchState === "idle" && t("matching_state_not_searching_trans")}
          {/* matchState === "confirmed" && t("matching_state_found_confirmed_trans") */}
        </button>
      )}
      {["searching"].includes(matchState) && (
        <div className="match-status searching">
          <img alt="" />
          {matchState === "searching" && t("matching_state_searching_trans")}
          {/* matchState === "pending" && t("matching_state_found_unconfirmed_trans") */}
          <a className="change-criteria" href="/form">
            {t("cp_modify_search")}
          </a>
          <button className="cancel-search" type="button" onClick={() => setShowCancel(true)}>
            {t("cp_cancel_search")}
          </button>
        </div>
      )}
      <Modal open={Boolean(partnerActionData)} onClose={onModalClose}>
        <Card width={CardSizes.Large}>
          {!!partnerActionData && (
            <PartnerActionForm onSubmit={handleSubmit(handlePartnerAction)}>
              <Text type={TextTypes.Heading2} tag="h2" center>
                {t(`${partnerActionData?.type}_modal_title`)}
              </Text>
              <Text>
                {t(`${partnerActionData?.type}_modal_description`, {
                  name: partnerActionData?.userName,
                })}
              </Text>
              <div>
                <Text type={TextTypes.Heading3} tag="h3" />
                <Controller
                  control={control}
                  name="reason"
                  rules={{
                    required: t(`${partnerActionData.type}_modal_reason_error_required`),
                    minLength: {
                      value: 50,
                      message: t(`${partnerActionData.type}_modal_reason_error_min_length`),
                    },
                  }}
                  render={({
                    field: { onChange, onBlur, value, name, ref },
                    fieldState: { error },
                  }) => (
                    <TextArea
                      inputRef={ref}
                      label={t(`${partnerActionData?.type}_modal_reason_subheading`)}
                      error={error?.message}
                      placeholder={t(`${partnerActionData?.type}_modal_title`)}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      name={name}
                    />
                  )}
                />
              </div>
              <Button type="submit">{t(`${partnerActionData?.type}_modal_button`)}</Button>
            </PartnerActionForm>
          )}
        </Card>
      </Modal>
    </div>
  );
}

export default PartnerProfiles;
