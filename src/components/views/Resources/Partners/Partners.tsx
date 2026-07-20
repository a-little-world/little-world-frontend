import { FC } from 'react';

import { Text, TextTypes } from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import ContentList from '../../../blocks/ContentList/ContentList';
import { ContentListLayouts } from '../../../blocks/ContentList/ContentList.styles';
import { PARTNERS_DATA } from '../constants';
import { ContentCard } from '../shared.styles';
import { Description } from './Partners.styles';

const Partners: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ContentCard>
      <Text
        color={theme.color.text.title}
        type={TextTypes.Heading4}
        bold
        tag="h2"
      >
        {t('resources.partners.title')}
      </Text>
      <Description>{t('resources.partners.description')}</Description>
      <ContentList
        content={PARTNERS_DATA}
        itemLayout={ContentListLayouts.Stacked}
      />
    </ContentCard>
  );
};

export default Partners;
