/* eslint-disable jsx-a11y/media-has-caption */
import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  CloseIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { PreJoin } from '@livekit/components-react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { cancelCallSetup, initActiveCall } from '../../../features/userData';
import { CALL_ROUTE, getAppRoute } from '../../../routes';
import {
  getAudioTrack,
  getVideoTrack,
  toggleLocalTracks,
} from '../../../twilio-helper';
import ModalCard from '../Cards/ModalCard';

if (!window.activeTracks) window.activeTracks = [];

export const clearActiveTracks = () => {
  console.log('CLEARING ACTIVE TRACKS', window.activeTracks);
  window.activeTracks.forEach(track => {
    track.stop();
  });
  window.activeTracks = [];
};

const CloseButton = styled(Button)`
  position: absolute;

  ${({ theme }) => css`
    right: ${theme.spacing.small};
    top: ${theme.spacing.small};
    @media (min-width: ${theme.breakpoints.medium}) {
      right: ${theme.spacing.medium};
      top: ${theme.spacing.medium};
    }
  `}
`;

const CallSetupCard = styled(ModalCard)`
  ${({ theme }) => css`
    padding: ${theme.spacing.large};
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.medium};
    }

    .lk-prejoin {
      margin: 0;
      padding: 0;
      width: 100%;

      .lk-video-container {
        border-radius: ${theme.radius.large};
      }

      .lk-form-control {
        display: none;
      }
    }

    .lk-join-button {
      font-weight: 700;
      border-radius: 90px;
      padding: ${theme.spacing.xsmall} ${theme.spacing.small};
      height: 49px;
      width: 100%;
      color: ${theme.color.text.reversed};
      border: none;
      background: ${theme.color.gradient.orange10};
      transition: background-color 0.5s ease, filter 0.5s ease,
        border-color 0.5s ease, color 0.5s ease, 0.4s;

      &:not(:disabled):hover {
        filter: brightness(80%);
        transition: background-color 0.5s ease, filter 0.5s ease,
          border-color 0.5s ease, color 0.5s ease, 0.4s;
      }
    }
  `}
`;

function CallSetup({ userPk, removeCallSetupPartner }) {
  const { t } = useTranslation();
  const quality = 'good';
  const qualityText = t(`pcs_signal_${quality}`);
  const updateText = t('pcs_signal_update');
  const username = useSelector(
    state => state?.userData?.user?.profile?.first_name,
  );
  const signalInfo = { quality, qualityText, updateText };
  const mediaStream = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log({ username });
  const handleJoin = values => {
    console.log({ values });
    clearActiveTracks();
    dispatch(initActiveCall({ userPk, tracks: values }));
    dispatch(cancelCallSetup());
    navigate(getAppRoute('live-kit'), { state: { userPk, tracks: values } });
  };

  return (
    <CallSetupCard>
      <CloseButton
        variation={ButtonVariations.Icon}
        onClick={() => {
          removeCallSetupPartner();
          if (mediaStream.current)
            mediaStream.current.getTracks().forEach(track => {
              track.stop();
            });
          clearActiveTracks();
        }}
      >
        {
          <CloseIcon
            label="close modal"
            labelId="close_icon"
            width="24"
            height="24"
          />
        }
      </CloseButton>
      <div>
        <Text center type={TextTypes.Heading4}>
          {t('pcs_main_heading')}
        </Text>
        <Text center type={TextTypes.Body4}>
          {t('pcs_sub_heading')}
        </Text>
      </div>
      <PreJoin
        onSubmit={handleJoin}
        joinLabel={t('pcs_btn_join_call')}
        defaults={{ username }}
        persistUserChoices={false}
      />
    </CallSetupCard>
  );
}

export default CallSetup;
