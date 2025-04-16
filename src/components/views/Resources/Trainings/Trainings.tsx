import { Text, TextTypes } from '@a-little-world/little-world-design-system';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import ContentList from '../../../blocks/ContentList/ContentList.tsx';
import { TRAININGS_DATA } from '../constants.ts';
import { Method } from './Trainings.styles.tsx';
import { ContentCard } from '../shared.styles.tsx';

const Trainings: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ContentCard>
      <Text color={theme.color.text.title} type={TextTypes.Body2} bold tag="h2">
        {t('resources.trainings.title')}
      </Text>
      <Text bold>{t('resources.trainings.description')}</Text>
      <Method>{t('resources.trainings.method')}</Method>
      <ContentList content={TRAININGS_DATA} />
    </ContentCard>
  );
};

export default Trainings;
