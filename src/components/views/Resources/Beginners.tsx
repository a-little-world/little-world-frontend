import {
  ContentTypes,
  TextContent,
  WavyLinesImage,
} from '@a-little-world/little-world-design-system';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { ResourcesListCard } from './shared.styles.tsx';

const Beginners: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ResourcesListCard>
      <TextContent
        content={[
          {
            type: ContentTypes.Title,
            text: t('resources.beginners.title'),
            color: theme.color.text.title,
          },
          {
            type: ContentTypes.Emphasize,
            text: t('resources.beginners.intro'),
          },
          {
            type: ContentTypes.Paragraph,
            text: t('resources.beginners.description'),
            style: { marginBottom: theme.spacing.small },
          },
          {
            type: ContentTypes.Subtitle,
            text: t('resources.beginners.websites_heading'),
          },
          {
            type: ContentTypes.Paragraph,
            text: t('resources.beginners.websites_intro'),
          },
          {
            type: ContentTypes.List,
            listItems: [
              t('resources.beginners.websites_1'),
              t('resources.beginners.websites_2'),
              t('resources.beginners.websites_3'),
            ],
          },
          {
            type: ContentTypes.Subtitle,
            text: t('resources.beginners.apps_heading'),
          },
          {
            type: ContentTypes.Paragraph,
            text: t('resources.beginners.apps_intro'),
          },
          {
            type: ContentTypes.List,
            listItems: [
              t('resources.beginners.apps_1'),
              t('resources.beginners.apps_2'),
            ],
          },
          {
            type: ContentTypes.Emphasize,
            text: t('resources.beginners.disclaimer'),
            style: { marginBottom: theme.spacing.large },
          },
          {
            type: ContentTypes.Image,
            text: 'WavyLines',
            Image: WavyLinesImage,
            color: theme.color.text.accent,
          },
        ]}
      />
    </ResourcesListCard>
  );
};

export default Beginners;
