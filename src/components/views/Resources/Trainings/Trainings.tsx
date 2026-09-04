import { FC } from 'react';

import { Text, TextTypes } from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import useSWR from 'swr';

import {
  Course,
  COURSES_ENDPOINT,
  fetchCourses,
} from '../../../../api/courses';
import { getAppSubpageRoute, TRAININGS_ROUTE } from '../../../../router/routes';
import ContentList, { ItemType } from '../../../blocks/ContentList/ContentList';
import { ContentCard } from '../shared.styles';
import { Method } from './Trainings.styles';

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

  return (
    <ContentCard>
      <Text
        color={theme.color.text.title}
        type={TextTypes.Heading4}
        bold
        tag="h2"
      >
        {t('resources.trainings.title')}
      </Text>
      <Text bold>{t('resources.trainings.description')}</Text>
      <Method>{t('resources.trainings.method')}</Method>
      <ContentList content={courseItems} />
    </ContentCard>
  );
};

export default Trainings;
