import React from 'react';
import { StyledCard, Title } from '../Form/styles';
import { useTranslation } from 'react-i18next';
import {
  Button,
  FriendshipImage,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ButtonSizes } from '@a-little-world/little-world-design-system/dist/esm/components/Button/Button';
import LanguageSelector from '../LanguageSelector/LanguageSelector';

const FIRST_FORM_STEP = 'user-type';

const WelcomeCard = styled(StyledCard)`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const Welcome = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <WelcomeCard>
      <LanguageSelector />
      <FriendshipImage />
      <Title tag="h2" center type={TextTypes.Heading2}>
        {t('welcome.title')}
      </Title>
      <Text center bold>
        {t('welcome.intro')}
      </Text>
      <Text center>{t('welcome.description')}</Text>
      <Text center type={TextTypes.Body4}>
        {t('welcome.note')}
      </Text>
      <Button
        size={ButtonSizes.Large}
        onClick={() => navigate(FIRST_FORM_STEP)}
      >
        {t('welcome.button')}
      </Button>
    </WelcomeCard>
  );
};

export default Welcome;
