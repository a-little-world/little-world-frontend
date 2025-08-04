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
import styled from 'styled-components';

import { confirmMatch } from '../../../api/matches.ts';
import { revalidateMatches } from '../../../features/swr/index.ts';
import ProfileImage from '../../atoms/ProfileImage.jsx';

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
  userHash: string;
}

const NewMatchCard: React.FC<NewMatchCardProps> = ({
  name,
  image,
  imageType,
  userHash,
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise<void>((resolve, reject) => {
        confirmMatch({
          userHash,
          onSuccess: () => {
            revalidateMatches();
            resolve();
          },
          onError: (apiError: any) => {
            reject(apiError);
          },
        });
      });
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

        <ProfileImage image={image} imageType={imageType} />
        <Text type={TextTypes.Body5}>
          {t('new_match_description', { name })}
        </Text>
        <Text tag="h3" type={TextTypes.Body5}>
          {t('new_match_instruction')}
        </Text>
      </Centred>
      {!!error && (
        <StatusMessage $visible={!!error} $type={StatusTypes.Error}>
          {error}
        </StatusMessage>
      )}
      <Button onClick={handleExit} loading={isLoading} disabled={isLoading}>
        {t('new_match_close_btn')}
      </Button>
    </Card>
  );
};

export default NewMatchCard;
