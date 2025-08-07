import {
  ContentTypes,
  TextContent,
  WavyLinesImage,
} from '@a-little-world/little-world-design-system';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { ResourcesListCard } from './shared.styles.tsx';

const German: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ResourcesListCard>
      <TextContent
        content={[
          {
            type: ContentTypes.Title,
            text: t('resources.german.title'),
            color: theme.color.text.title,
          },
          {
            type: ContentTypes.Paragraph,
            text: t('resources.german.description'),
            style: { marginBottom: theme.spacing.small },
          },
          {
            type: ContentTypes.Subtitle,
            text: t('resources.german.websites_heading'),
          },
          {
            type: ContentTypes.List,
            listItems: [
              t('resources.german.websites_1'),
              t('resources.german.websites_2'),
              t('resources.german.websites_3'),
              t('resources.german.websites_4'),
            ],
          },
          {
            type: ContentTypes.Subtitle,
            text: t('resources.german.podcasts_heading'),
          },
          {
            type: ContentTypes.List,
            listItems: [
              t('resources.german.podcasts_1'),
              t('resources.german.podcasts_2'),
              t('resources.german.podcasts_3'),
            ],
          },
          {
            type: ContentTypes.Image,
            text: 'WavyLines',
            Image: WavyLinesImage,
            color: theme.color.surface.bold,
          },
        ]}
      />
    </ResourcesListCard>
  );
};

export default German;
