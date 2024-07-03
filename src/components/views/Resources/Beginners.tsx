import {
  Card,
  ContentTypes,
  TextContent,
} from '@a-little-world/little-world-design-system';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const ContentCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.small};
  padding-bottom: ${({ theme }) => theme.spacing.xlarge};

  ul {
    margin-bottom: ${({ theme }) => theme.spacing.medium};
  }

  h3 {
    color: ${({ theme }) => theme.color.text.highlight};
  }

  h4:first-of-type {
    margin-top: ${({ theme }) => theme.spacing.medium};
  }
`;

const Beginners: FC = () => {
  const { t } = useTranslation();

  return (
    <ContentCard>
      <TextContent
        content={[
          { type: ContentTypes.Title, text: t('resources.beginners.title') },
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
        ]}
      />
    </ContentCard>
  );
};

export default Beginners;
