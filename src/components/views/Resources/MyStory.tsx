import {
  Card,
  ContentTypes,
  FriendshipImage,
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
`;

const MyStory: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ContentCard>
      <TextContent
        content={[
          {
            type: ContentTypes.Title,
            text: t('resources.my_story.title'),
            color: theme.color.text.title,
          },
          {
            type: ContentTypes.Paragraph,
            text: t('resources.my_story.intro'),
          },
          {
            type: ContentTypes.Paragraph,
            text: t('resources.my_story.description'),
            style: { marginBottom: theme.spacing.medium },
          },
          {
            type: ContentTypes.Subtitle,
            text: t('resources.my_story.subtitle'),
          },
          {
            type: ContentTypes.Sentence,
            text: t('resources.my_story.steps_intro'),
          },
          {
            type: ContentTypes.OrderedList,
            listItems: [
              t('resources.my_story.step_1'),
              t('resources.my_story.step_2'),
              t('resources.my_story.step_3'),
            ],
            style: { marginBottom: theme.spacing.medium },
          },
          {
            type: ContentTypes.Paragraph,
            text: t('resources.my_story.outro_1'),
          },
          {
            type: ContentTypes.Paragraph,
            text: t('resources.my_story.outro_2'),
          },
          {
            type: ContentTypes.Paragraph,
            text: t('resources.my_story.disclaimer'),
            style: { marginBottom: theme.spacing.medium },
          },
          {
            type: ContentTypes.Sentence,
            text: t('resources.my_story.examples'),
            style: { marginBottom: theme.spacing.medium },
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

export default MyStory;
