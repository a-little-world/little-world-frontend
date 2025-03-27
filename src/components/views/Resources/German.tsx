import {
  Card,
  ContentTypes,
  SwirlyLinesThinImage,
  TextContent,
} from '@a-little-world/little-world-design-system';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

const ContentCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.small};
  padding-bottom: ${({ theme }) => theme.spacing.xlarge};

  ul {
    margin-bottom: ${({ theme }) => theme.spacing.medium};
  }

  h4:first-of-type {
    margin-top: ${({ theme }) => theme.spacing.medium};
  }

  p:last-of-type {
    margin-bottom: ${({ theme }) => theme.spacing.medium};
  }
`;

const German: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ContentCard>
      <TextContent
        content={[
          {
            type: ContentTypes.Title,
            text: t('resources.german.title'),
            color: theme.color.text.title,
          },
          {
            type: ContentTypes.Emphasize,
            text: t('resources.german.intro'),
          },
          {
            type: ContentTypes.Paragraph,
            text: t('resources.german.description'),
          },
          {
            type: ContentTypes.Subtitle,
            text: t('resources.german.websites_heading'),
          },
          {
            type: ContentTypes.Paragraph,
            text: t('resources.german.websites_intro'),
          },
          {
            type: ContentTypes.List,
            listItems: [
              t('resources.german.websites_1'),
              t('resources.german.websites_2'),
              t('resources.german.websites_3'),
            ],
          },
          {
            type: ContentTypes.Subtitle,
            text: t('resources.german.apps_heading'),
          },
          {
            type: ContentTypes.Paragraph,
            text: t('resources.german.apps_intro'),
          },
          {
            type: ContentTypes.List,
            listItems: [
              t('resources.german.apps_1'),
              t('resources.german.apps_2'),
            ],
          },
          {
            type: ContentTypes.Emphasize,
            text: t('resources.german.disclaimer'),
          },
          {
            type: ContentTypes.Image,
            text: 'SwirlyLines',
            Image: SwirlyLinesThinImage,
          },
        ]}
      />
    </ContentCard>
  );
};

export default German;
