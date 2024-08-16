import {
  Button,
  FriendshipImage,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { ButtonSizes } from '@a-little-world/little-world-design-system/dist/esm/components/Button/Button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Title } from '../Form/styles';
import {
  IntroText,
  NoteText,
  WelcomeCard,
  WelcomeIllustration,
} from './styles';

const FIRST_FORM_STEP = 'user-type';

const Welcome = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <WelcomeCard>
      <WelcomeIllustration />
      <Title tag="h2" center type={TextTypes.Heading4}>
        {t('welcome.title')}
      </Title>
      <IntroText center bold>
        {t('welcome.intro')}
      </IntroText>
      <IntroText center>{t('welcome.description')}</IntroText>
      <NoteText center>{t('welcome.note')}</NoteText>
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
