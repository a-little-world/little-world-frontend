import {
  Button,
  ButtonAppearance,
  Card,
  CardSizes,
  ExclamationIcon,
  Text,
  TextArea,
  TextTypes,
  UnmatchedImage,
} from '@a-little-world/little-world-design-system';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { reportMatch, unmatch } from '../../../api/matches.ts';

export const PARTNER_ACTION_REPORT = 'report';
export const PARTNER_ACTION_UNMATCH = 'unmatch';

const PartnerActionForm = styled.form`
  display: flex;
  flex-direction: column;
  ${({ theme }) => `
  gap: ${theme.spacing.medium};
  `};
`;

const Centred = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;

  ${({ theme }) => `
  gap: ${theme.spacing.large};
  padding: ${theme.spacing.small} 0px;
  `}
`;

const ReasonWrapper = styled.div`
  ${({ theme }) => `
  margin-bottom: ${theme.spacing.xxsmall};
  `}
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) => `
  gap: ${theme.spacing.small};
  `}
`;

function PartnerActionCard({ data, onClose }) {
  const { t } = useTranslation();
  const { control, handleSubmit, setError, reset } = useForm();
  const [confirmed, setConfirmed] = useState(false);
  const isUnmatch = data.type === PARTNER_ACTION_UNMATCH;

  const handleOnClose = () => {
    onClose();
    reset();
  };

  const handlePartnerAction = formData => {
    const action = isUnmatch ? unmatch : reportMatch;

    action({ userPk: data.userPk, reason: formData.reason })
      .then(() => setConfirmed(true))
      .catch(() =>
        setError('root.serverError', {
          type: 'server',
          message: t(`${data.type}_modal_reason_error_server`),
        }),
      );
  };

  return (
    <Card width={CardSizes.Medium}>
      {confirmed ? (
        <Centred>
          {isUnmatch ? (
            <UnmatchedImage />
          ) : (
            <ExclamationIcon
              width="64px"
              height="64px"
              label={t('report_modal_exclamation_label')}
            />
          )}
          <Text type={TextTypes.Body3} tag="h3" center>
            {t(`${data?.type}_modal_confirmation`, { name: data.userName })}
          </Text>
          {isUnmatch && <Text center>{t('unmatch_modal_search_again')}</Text>}
          <Button
            type="button"
            appearance={ButtonAppearance.Secondary}
            onClick={handleOnClose}
          >
            {t(`${data?.type}_modal_close_btn`)}
          </Button>
        </Centred>
      ) : (
        <PartnerActionForm onSubmit={handleSubmit(handlePartnerAction)}>
          <Text type={TextTypes.Heading4} tag="h2" center>
            {t(`${data?.type}_modal_title`, { name: data.userName })}
          </Text>
          <Text>
            {t(`${data?.type}_modal_description`, {
              name: data?.userName,
            })}
          </Text>
          <ReasonWrapper>
            <Controller
              control={control}
              name="reason"
              rules={{
                required: t(`${data.type}_modal_reason_error_required`),
                minLength: {
                  value: 50,
                  message: t(`${data.type}_modal_reason_error_min_length`),
                },
              }}
              render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { error },
              }) => (
                <TextArea
                  inputRef={ref}
                  label={t(`${data?.type}_modal_reason_label`, {
                    name: data.userName,
                  })}
                  error={error?.message}
                  placeholder={t(`${data?.type}_modal_reason_placeholder`)}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  name={name}
                />
              )}
            />
          </ReasonWrapper>
          <ButtonsWrapper>
            <Button type="submit">
              {t(`${data?.type}_modal_confirm_btn`)}
            </Button>
            <Button
              type="button"
              appearance={ButtonAppearance.Secondary}
              onClick={handleOnClose}
            >
              {t(`${data?.type}_modal_cancel_btn`)}
            </Button>
          </ButtonsWrapper>
        </PartnerActionForm>
      )}
    </Card>
  );
}

export default PartnerActionCard;
