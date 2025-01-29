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

const Beginners: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ContentCard>
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

export default Beginners;
