import {
  Button,
  Card,
  CardSizes,
  StatusMessage,
  StatusTypes,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { confirmMatch } from '../../../api/matches';
import { revalidateMatches } from '../../../features/swr';
import { MESSAGES_ROUTE, getAppSubpageRoute } from '../../../router/routes';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await new Promise<any>((resolve, reject) => {
        confirmMatch({
          userUuid,
          onSuccess: resolve,
          onError: reject,
        });
      });

      const chatId = result?.matches?.[0]?.chatId;
      await revalidateMatches();
      onClose();
      if (chatId) {
        navigate(getAppSubpageRoute(MESSAGES_ROUTE, chatId));
      }
    } catch (apiError: any) {
      setError(apiError?.message || t('error.server_issue'));
    } finally {
      setIsLoading(false);
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
      </Centred>
      {!!error && (
        <StatusMessage visible={!!error} type={StatusTypes.Error}>
          {error}
        </StatusMessage>
      )}
      <Button onClick={handleExit} loading={isLoading} disabled={isLoading}>
        {t('new_match_go_to_chat_btn')}
      </Button>
    </Card>
  );
};

export default NewMatchCard;
