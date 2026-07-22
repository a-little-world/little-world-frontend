import { FC, useEffect, useState } from 'react';

import {
  ButtonAppearance,
  Link,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';

import {
  completeCourse,
  CourseDetail,
  CourseProgress,
  fetchCourseDetail,
  fetchCoursePreview,
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

  useEffect(() => {
    if (!course || preview || !slug) return;
    startCourse(slug)
      .then(setProgress)
      .catch(() => setProgress(null));
  }, [course, slug, preview]);

  if (!slug) return <CourseNotFound />;
  if (isLoading) return <LoadingScreen />;
  if (error || !course) return <CourseNotFound />;

  const chapters = course.chapters.map(mapChapter);
  const completedChapterCount = getCompletedChapterCountForCourseProgress(
    chapters,
    progress?.current_chapter_id ?? '',
  );

  const handleStepComplete = async (chapterId: string, stepIndex: number) => {
    if (preview) return;
    try {
      const updated = await updateCourseProgress(slug, {
        current_chapter_id: chapterId,
        current_step_index: stepIndex + 1,
      });
      setProgress(updated);
    } catch {
      // best-effort
    }
  };

  const handleChapterComplete = async (
    _chapterId: string,
    chapterIndex: number,
  ) => {
    if (preview) return;
    const nextChapter = chapters[chapterIndex + 1];
    try {
      const updated = await updateCourseProgress(slug, {
        current_chapter_id: nextChapter?.id ?? _chapterId,
        current_step_index: 0,
      });
      setProgress(updated);
    } catch {
      // best-effort
    }
  };

  const handleCourseComplete = async () => {
    if (!preview) {
      try {
        await completeCourse(slug);
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
