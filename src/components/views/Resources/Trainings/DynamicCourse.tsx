import { FC, useEffect, useState } from 'react';

import {
  Button,
  ButtonAppearance,
  Link,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useSWR, { mutate as mutateGlobal } from 'swr';

import {
  completeCourse,
  CourseDetail,
  CourseProgress,
  fetchCourseDetail,
  fetchCoursePreview,
  getCourseProgressEndpoint,
  startCourse,
  updateCourseProgress,
} from '../../../../api/courses';
import {
  getCompletedChapterCountForCourseProgress,
  mapChapter,
} from '../../../../helpers/course';
import { getAppRoute, TRAININGS_ROUTE } from '../../../../router/routes';
import LoadingScreen from '../../../atoms/LoadingScreen';
import NotFoundCard from '../../../atoms/NotFound';
import CourseChaptersLayout from '../../../blocks/Course/Course';

type DynamicCourseProps = {
  slug?: string;
  /** Staff preview: no progress persistence; permission enforced by preview API. */
  preview?: boolean;
};

function getCourseSwrKey(
  slug: string | undefined,
  preview: boolean,
): string | null {
  if (!slug) return null;
  return preview ? `/api/courses/preview/${slug}/` : `/api/courses/${slug}/`;
}

const CourseNotFound: FC = () => {
  const { t } = useTranslation();

  return (
    <NotFoundCard title={t('resources.trainings.not_found')}>
      <Link
        to={getAppRoute(TRAININGS_ROUTE)}
        buttonAppearance={ButtonAppearance.Primary}
      >
        {t('resources.trainings.return')}
      </Link>
    </NotFoundCard>
  );
};

const ProgressLoadError: FC<{ onRetry: () => void }> = ({ onRetry }) => {
  const { t } = useTranslation();

  return (
    <NotFoundCard title={t('resources.trainings.progress_error')}>
      <Button appearance={ButtonAppearance.Primary} onClick={onRetry}>
        {t('resources.trainings.progress_retry')}
      </Button>
      <Link
        to={getAppRoute(TRAININGS_ROUTE)}
        buttonAppearance={ButtonAppearance.Secondary}
      >
        {t('resources.trainings.return')}
      </Link>
    </NotFoundCard>
  );
};

const DynamicCourse: FC<DynamicCourseProps> = ({ slug, preview = false }) => {
  const navigate = useNavigate();

  const courseKey = getCourseSwrKey(slug, preview);

  const {
    data: course,
    isLoading,
    error,
  } = useSWR<CourseDetail>(courseKey, () =>
    preview ? fetchCoursePreview(slug!) : fetchCourseDetail(slug!),
  );

  const [progress, setProgress] = useState<CourseProgress | null>(null);
  // Course writes `?chapter=` on first mount from completedChapterCount. If we
  // render before startCourse returns, that count is 0 and the URL sticks on
  // chapter 1 even after progress arrives.
  const [progressLoadedForSlug, setProgressLoadedForSlug] = useState<string>();
  // Falling back to empty progress would silently restart the learner at chapter 1.
  const [progressFailed, setProgressFailed] = useState(false);
  const [startAttempt, setStartAttempt] = useState(0);
  const hasCourse = Boolean(course);

  // Other views (e.g. CoursePromoCard) read progress from the SWR cache.
  const syncProgress = (updated: CourseProgress) => {
    setProgress(updated);
    if (slug) {
      mutateGlobal(getCourseProgressEndpoint(slug), updated, {
        revalidate: false,
      });
    }
  };

  useEffect(() => {
    if (!hasCourse || preview || !slug) return undefined;
    let cancelled = false;
    setProgressFailed(false);
    startCourse(slug)
      .then(data => {
        if (cancelled) return;
        syncProgress(data);
        setProgressLoadedForSlug(slug);
      })
      .catch(() => {
        if (!cancelled) setProgressFailed(true);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCourse, slug, preview, startAttempt]);

  const isProgressReady = preview || progressLoadedForSlug === slug;

  if (!slug) return <CourseNotFound />;
  if (isLoading) return <LoadingScreen />;
  if (error || !course) return <CourseNotFound />;
  if (progressFailed) {
    return <ProgressLoadError onRetry={() => setStartAttempt(n => n + 1)} />;
  }
  if (!isProgressReady) return <LoadingScreen />;

  const chapters = course.chapters.map(mapChapter);
  const completedChapterCount = getCompletedChapterCountForCourseProgress(
    chapters,
    progress?.current_chapter_id ?? '',
    progress?.completed ?? false,
  );

  const handleStepComplete = async (chapterId: string, stepIndex: number) => {
    if (preview) return;
    try {
      const updated = await updateCourseProgress(slug, {
        current_chapter_id: chapterId,
        current_step_index: stepIndex + 1,
      });
      syncProgress(updated);
    } catch {
      // best-effort
    }
  };

  const handleChapterComplete = async (
    chapterId: string,
    chapterIndex: number,
  ) => {
    if (preview) return;
    const nextChapter = chapters[chapterIndex + 1];
    try {
      const updated = await updateCourseProgress(slug, {
        current_chapter_id: nextChapter?.id ?? chapterId,
        // Moving to a new chapter starts at its first step. On the last chapter there is
        // nowhere to advance to, so record its quiz as finished instead of rewinding to 0:
        // `Course` re-seeds its answered-step set from this value, and a 0 wipes the
        // answers the learner just gave out of the progress bar.
        current_step_index: nextChapter
          ? 0
          : (chapters[chapterIndex]?.quizSteps.length ?? 0),
      });
      syncProgress(updated);
    } catch {
      // best-effort
    }
  };

  const handleCourseComplete = async () => {
    if (!preview) {
      try {
        syncProgress(await completeCourse(slug));
      } catch {
        // best-effort
      }
    }
    navigate(getAppRoute(TRAININGS_ROUTE));
  };

  return (
    <CourseChaptersLayout
      chapters={chapters}
      completedChapterCount={completedChapterCount}
      initialStepIndex={progress?.current_step_index ?? 0}
      courseTitle={course.title}
      onBack={() => navigate(getAppRoute(TRAININGS_ROUTE))}
      onStepComplete={handleStepComplete}
      onChapterComplete={handleChapterComplete}
      onCourseComplete={handleCourseComplete}
    />
  );
};

export default DynamicCourse;
