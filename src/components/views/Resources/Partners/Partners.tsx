import { Text, TextTypes } from '@a-little-world/little-world-design-system';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import ContentList, { ContentListLayouts } from '../../../blocks/ContentList/ContentList.tsx';
import { PARTNERS_DATA } from '../constants.ts';
import { Description } from './Partners.styles.tsx';
import { ContentCard } from '../shared.styles.tsx';

const Partners: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ContentCard>
      <Text color={theme.color.text.title} type={TextTypes.Body2} bold tag="h2">
        {t('resources.partners.title')}
      </Text>
      <Description>{t('resources.partners.description')}</Description>
      <ContentList content={PARTNERS_DATA} itemLayout={ContentListLayouts.Stacked} />
    </ContentCard>
  );
};

export default Partners;
