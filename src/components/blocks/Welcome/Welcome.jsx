import React from 'react';

import { Button, TextTypes } from '@a-little-world/little-world-design-system';
import { ButtonSizes } from '@a-little-world/little-world-design-system/dist/esm/components/Button/Button';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { sanitizeNext } from '../../../router/routes';
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
  const location = useLocation();
  // Carry a deep link through the multi-step user form.
  const nextTarget = sanitizeNext(
    new URLSearchParams(location.search).get('next'),
  );
  const firstStep = nextTarget
    ? `${FIRST_FORM_STEP}?next=${encodeURIComponent(nextTarget)}`
    : FIRST_FORM_STEP;

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
      <Button size={ButtonSizes.Large} onClick={() => navigate(firstStep)}>
        {t('welcome.button')}
      </Button>
    </WelcomeCard>
  );
};

export default Welcome;
