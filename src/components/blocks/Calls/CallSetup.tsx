/* eslint-disable jsx-a11y/media-has-caption */
import {
  Button,
  ButtonVariations,
  CloseIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { LocalUserChoices, PreJoin } from '@livekit/components-react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { requestVideoAccessToken } from '../../../api/livekit';
import { cancelCallSetup, initActiveCall } from '../../../features/userData';
import { getAppRoute } from '../../../routes';
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

    .lk-device-menu {
      background-color: ${({ theme }) => theme.color.surface.primary};
      border-color: ${({ theme }) => theme.color.border.subtle};
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);

      > ul {
        list-style-type: none;
        padding: 0;
        margin: 0;

        > li {
          border-radius: ${({ theme }) => theme.radius.xsmall};
        }
      }

      li[data-lk-active='true'] {
        background: ${({ theme }) => theme.color.surface.bold};
        color: ${({ theme }) => theme.color.text.reversed};
      }
    }
  `}
`;

function CallSetup({ userPk, removeCallSetupPartner }) {
  const { t } = useTranslation();
  const location = useLocation();
  const [authData, setAuthData] = useState({
    token: null,
    livekitServerUrl: null,
  });

  const quality = 'good';
  const qualityText = t(`pcs_signal_${quality}`);
  const updateText = t('pcs_signal_update');
  const signalInfo = { quality, qualityText, updateText };

  const username = useSelector(
    state => state?.userData?.user?.profile?.first_name,
  );
  const mediaStream = useRef<MediaStream>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleJoin = (values: LocalUserChoices) => {
    clearActiveTracks();
    dispatch(initActiveCall({ userPk, tracks: values }));
    dispatch(cancelCallSetup());
    navigate(getAppRoute('live-kit'), {
      state: {
        userPk,
        token: authData.token,
        tracks: values,
        livekitServerUrl: authData.livekitServerUrl,
        origin: location.pathname,
      },
    });
  };

  useEffect(() => {
    // Request the video room access token
    console.log('Requesting video access token for user:', userPk);
    requestVideoAccessToken({
      partnerId: userPk,
    })
      .then(res => {
        console.log('Token request response:', res);
        setAuthData({
          token: res.token,
          livekitServerUrl: res.server_url,
        });
      })
      .catch(err => {
        // TODO: handle token request rejection
        console.error('Error requesting video access token:', err);
      });
  }, []);

  const handleValidate = (values: LocalUserChoices) => {
    console.log({ values });
    return Boolean(
      (values.audioDeviceId || values.videoDeviceId) && authData.token,
    );
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
        onValidate={handleValidate}
        defaults={{ username }}
        persistUserChoices={false}
      />
    </CallSetupCard>
  );
}

export default CallSetup;
