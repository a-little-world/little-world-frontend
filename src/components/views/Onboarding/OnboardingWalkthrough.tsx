import { useEffect, useState } from 'react';

import {
  ButtonAppearance,
  Link,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import useSWR, { mutate } from 'swr';

import {
  completeCourse,
  CourseDetail,
  CourseProgress,
  fetchCourseDetail,
  SELF_ONBOARDING_SLUG,
  startCourse,
  updateCourseProgress,
} from '../../../api/courses';
import { USER_TYPES } from '../../../constants';
import { USER_ENDPOINT } from '../../../features/swr';
import {
  getCompletedChapterCountForCourseProgress,
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
  } = useSWR<CourseDetail>(`/api/courses/${SELF_ONBOARDING_SLUG}/`, () =>
    fetchCourseDetail(SELF_ONBOARDING_SLUG),
  );

  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [progressReady, setProgressReady] = useState(false);

  useEffect(() => {
    if (!course) return;
    let cancelled = false;
    startCourse(SELF_ONBOARDING_SLUG)
      .then(next => {
        if (!cancelled) setProgress(next);
      })
      .catch(() => {
        if (!cancelled) setProgress(null);
      })
      .finally(() => {
        if (!cancelled) setProgressReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [course]);

  if (isUserLoading || isCourseLoading || !progressReady) return <LoadingScreen />;

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
  const completedChapterCount = progress?.completed
    ? chapters.length
    : getCompletedChapterCountForCourseProgress(
        chapters,
        progress?.current_chapter_id ?? '',
      );

  const handleStepComplete = async (chapterId: string, stepIndex: number) => {
    try {
      const updated = await updateCourseProgress(SELF_ONBOARDING_SLUG, {
        current_chapter_id: chapterId,
        current_step_index: stepIndex + 1,
      });
      setProgress(updated);
    } catch {
      // best-effort
    }
  };

  const handleChapterComplete = async (
    chapterId: string,
    chapterIndex: number,
  ) => {
    const nextChapter = chapters[chapterIndex + 1];
    try {
      const updated = await updateCourseProgress(SELF_ONBOARDING_SLUG, {
        current_chapter_id: nextChapter?.id ?? chapterId,
        current_step_index: 0,
      });
      setProgress(updated);
    } catch {
      // best-effort
    }
  };

  const handleCourseComplete = async () => {
    try {
      await completeCourse(SELF_ONBOARDING_SLUG);
      await mutate(USER_ENDPOINT);
    } catch {
      // best-effort
    }
    navigate(getAppRoute());
  };

  return (
    <Course
      backLabel={t('onboarding_walkthrough.nav_back')}
      chapters={chapters}
      completedChapterCount={completedChapterCount}
      initialStepIndex={progress?.current_step_index ?? 0}
      courseTitle={course.title}
      onBack={() => navigate(getAppRoute(ONBOARDING_ROUTE))}
      onStepComplete={handleStepComplete}
      onChapterComplete={handleChapterComplete}
      onCourseComplete={handleCourseComplete}
    />
  );
};

export default OnboardingWalkthrough;
