import React, { useState } from 'react';

import {
  Button,
  ButtonAppearance,
  Card,
  CardSizes,
  StatusMessage,
  StatusTypes,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { confirmMatch } from '../../../api/matches';
import { revalidateMatches } from '../../../features/swr';
import {
  getAppRoute,
  getAppSubpageRoute,
  MESSAGES_ROUTE,
  PROFILE_ROUTE,
} from '../../../router/routes';
import ButtonsContainer from '../../atoms/ButtonsContainer';
import Note from '../../atoms/Note';
import ProfileImage from '../../atoms/ProfileImage';

const Centred = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  text-align: center;

  ${({ theme }) => `
  margin-bottom: ${theme.spacing.medium};

  @media (min-width: ${theme.breakpoints.small}) {
    margin-bottom: ${theme.spacing.large};
  }
  `}
`;

interface NewMatchCardProps {
  name: string;
  image: any;
  imageType: string;
  userUuid: string;
  onClose: () => void;
}

const NewMatchCard: React.FC<NewMatchCardProps> = ({
  name,
  image,
  imageType,
  userUuid,
  onClose,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [pendingAction, setPendingAction] = useState<'chat' | 'profile' | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const isLoading = pendingAction !== null;

  const runAction = async (action: 'chat' | 'profile') => {
    setPendingAction(action);
    setError(null);

    try {
      const result = await new Promise<any>((resolve, reject) => {
        confirmMatch({
          userUuid,
          onSuccess: resolve,
          onError: reject,
        });
      });

      await revalidateMatches();
      onClose();

      if (action === 'profile') {
        navigate(getAppRoute(`${PROFILE_ROUTE}/${userUuid}`));
        return;
      }

      const chatId = result?.matches?.[0]?.chatId;
      if (chatId) {
        navigate(getAppSubpageRoute(MESSAGES_ROUTE, chatId));
      }
    } catch (apiError: any) {
      setError(apiError?.message || t('error.server_issue'));
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <Card width={CardSizes.Medium}>
      <Centred>
        <Text tag="h2" type={TextTypes.Heading4}>
          {t('new_match_title')}
        </Text>

        <ProfileImage
          image={image}
          imageType={imageType}
          circle
          size="medium"
        />
        <Text type={TextTypes.Body5}>
          {t('new_match_description', { name })}
        </Text>
        <Text tag="h3" type={TextTypes.Body5}>
          {t('new_match_instruction', { name })}
        </Text>
        <Note>{t('new_match_partners_hint', { name })}</Note>
      </Centred>
      {!!error && (
        <StatusMessage visible={!!error} type={StatusTypes.Error}>
          {error}
        </StatusMessage>
      )}
      <ButtonsContainer>
        <Button
          type="button"
          appearance={ButtonAppearance.Secondary}
          onClick={() => runAction('profile')}
          loading={pendingAction === 'profile'}
          disabled={isLoading}
        >
          {t('new_match_go_to_profile_btn')}
        </Button>
        <Button
          type="button"
          onClick={() => runAction('chat')}
          loading={pendingAction === 'chat'}
          disabled={isLoading}
        >
          {t('new_match_go_to_chat_btn')}
        </Button>
      </ButtonsContainer>
    </Card>
  );
};

export default NewMatchCard;
