import {
  ButtonAppearance,
  Link,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import useSWR, { mutate } from 'swr';

import {
  fetchSelfOnboardingCourse,
  SELF_ONBOARDING_COURSE_ENDPOINT,
} from '../../../api/courses';
import updateSelfOnboardingStep from '../../../api/onboarding';
import { USER_TYPES } from '../../../constants';
import { USER_ENDPOINT } from '../../../features/swr';
import {
  getCompletedChapterCountForStoredStep,
  getSelfOnboardingStepIdForChapter,
  mapChapter,
} from '../../../helpers/course';
import { getAppRoute, ONBOARDING_ROUTE } from '../../../router/routes';
import LoadingScreen from '../../atoms/LoadingScreen';
import NotFoundCard from '../../atoms/NotFound';
import Course from '../../blocks/Course/Course';

const OnboardingWalkthrough = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: user, isLoading: isUserLoading } = useSWR(USER_ENDPOINT);
  const {
    data: course,
    isLoading: isCourseLoading,
    error,
  } = useSWR(SELF_ONBOARDING_COURSE_ENDPOINT, fetchSelfOnboardingCourse);

  const currentStep = user?.selfOnboardingStepId;

  if (isUserLoading || isCourseLoading) return <LoadingScreen />;

  if (user?.profile?.user_type === USER_TYPES.learner) {
    return <Navigate to={getAppRoute()} replace />;
  }

  if (error || !course?.chapters?.length) {
    return (
      <NotFoundCard title={t('resources.trainings.not_found')}>
        <Link
          to={getAppRoute(ONBOARDING_ROUTE)}
          buttonAppearance={ButtonAppearance.Primary}
        >
          {t('onboarding_walkthrough.nav_back')}
        </Link>
      </NotFoundCard>
    );
  }

  const chapters = course.chapters.map(mapChapter);
  const completedChapterCount = getCompletedChapterCountForStoredStep(
    chapters,
    currentStep ?? '',
  );

  return (
    <Course
      backLabel={t('onboarding_walkthrough.nav_back')}
      chapters={chapters}
      completedChapterCount={completedChapterCount}
      courseTitle={course.title}
      onBack={() => navigate(getAppRoute(ONBOARDING_ROUTE))}
      onChapterComplete={async chapterId => {
        const chapter = chapters.find(ch => ch.id === chapterId);
        const stepId = chapter
          ? getSelfOnboardingStepIdForChapter(chapter)
          : chapterId;
        await updateSelfOnboardingStep(stepId);
      }}
      onCourseComplete={async () => {
        await mutate(USER_ENDPOINT);
        navigate(getAppRoute());
      }}
    />
  );
};

export default OnboardingWalkthrough;
