import { Text, TextTypes } from '@a-little-world/little-world-design-system';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import useSWR from 'swr';

import {
  COURSES_ENDPOINT,
  Course,
  fetchCourses,
} from '../../../../api/courses';
import { TRAININGS_ROUTE, getAppSubpageRoute } from '../../../../router/routes';
import ContentList, { ItemType } from '../../../blocks/ContentList/ContentList';
import { TRAININGS_DATA } from '../constants';
import { ContentCard } from '../shared.styles';
import { Method } from './Trainings.styles';

const hardcodedItems: ItemType[] = Object.values(TRAININGS_DATA).map(
  training => ({
    title: training.title,
    description: training.description,
    bio: training.bio,
    link: training.link,
    linkText: training.linkText,
    image: training.image,
    altImage: training.altImage,
    badge: {
      type: 'video' as const,
      label: 'resources.trainings.badge_video_only',
    },
  }),
);

function courseToItem(course: Course): ItemType {
  return {
    title: course.title,
    image: course.image,
    description: course.description,
    link: getAppSubpageRoute(TRAININGS_ROUTE, course.slug),
    linkText: 'resources.trainings.training_cta',
    badge: {
      type: 'interactive' as const,
      label: 'resources.trainings.badge_interactive',
    },
  };
}

const Trainings: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { data: apiCourses } = useSWR<Course[]>(COURSES_ENDPOINT, fetchCourses);

  const courseItems = (apiCourses ?? []).map(courseToItem);
  const allItems: ItemType[] = [...hardcodedItems, ...courseItems];

  return (
    <ContentCard>
      <Text color={theme.color.text.title} type={TextTypes.Body2} bold tag="h2">
        {t('resources.trainings.title')}
      </Text>
      <Text bold>{t('resources.trainings.description')}</Text>
      <Method>{t('resources.trainings.method')}</Method>
      <ContentList content={allItems} />
    </ContentCard>
  );
};

export default Trainings;
