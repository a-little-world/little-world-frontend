import {
  ButtonAppearance,
  Link,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { last } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTheme } from 'styled-components';
import useSWR from 'swr';

import {
  ApiCourseChapter,
  ApiQuizStep,
  CourseDetail,
  CourseProgress,
  completeCourse,
  fetchCourseDetail,
  startCourse,
  updateCourseProgress,
} from '../../../../api/courses';
import useScrollToTop from '../../../../hooks/useScrollToTop';
import { TRAININGS_ROUTE, getAppRoute } from '../../../../router/routes';
import LoadingScreen from '../../../atoms/LoadingScreen';
import Stepper from '../../../atoms/Stepper';
import Video from '../../../atoms/Video';
import CourseChaptersLayout, {
  CourseChapter,
} from '../../../blocks/Course/ChaptersLayout';
import type { QuizStep } from '../../../blocks/Quiz/Quiz';
import { TRAININGS_DATA, TRAINING_IDS, getDataBySlug } from '../constants';
import {
  Container,
  ContentCard,
  NotFoundCard,
  VideoDescription,
} from '../shared.styles';
import { CheckInText } from './Trainings.styles';

// ---------------------------------------------------------------------------
// Hardcoded (video-only) training view — unchanged behaviour
// ---------------------------------------------------------------------------

type HardcodedTrainingData = (typeof TRAININGS_DATA)[keyof typeof TRAININGS_DATA];

const HardcodedTraining: FC<{ training: HardcodedTrainingData }> = ({
  training,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const scrollToTop = useScrollToTop();
  const [videoId, setVideoId] = useState(training.video[0].id);

  const handleVideoSelect = (id: string) => {
    setVideoId(id);
    scrollToTop();
  };

  const title = training.video.find(item => item.id === videoId)!.label;
  const isLastStep = videoId === last(training.video)?.id;

  return (
    <ContentCard>
      <Text color={theme.color.text.title} type={TextTypes.Body2} bold tag="h2">
        {title}
      </Text>
      <Container>
        <Video src={videoId} title={title} />
        <VideoDescription>
          <Text>{t(`resources.trainings.${training.id}.description`)}</Text>
          {training.hasHandout && (
            <Text>{t(`resources.trainings.${training.id}.handout`)}</Text>
          )}
          <Text>{t(`resources.trainings.${training.id}.glossary`)}</Text>
          <Text>{t(`resources.trainings.${training.id}.teacher`)}</Text>
        </VideoDescription>
        <Stepper
          steps={training.video}
          activeStep={videoId}
          onSelectStep={handleVideoSelect}
        />
        {isLastStep && training.id === TRAINING_IDS.intercultural && (
          <CheckInText center>{t('resources.self_check_in')}</CheckInText>
        )}
      </Container>
    </ContentCard>
  );
};

// ---------------------------------------------------------------------------
// Data mapping helpers: API shapes → ChaptersLayout shapes
// ---------------------------------------------------------------------------

function mapQuizStep(step: ApiQuizStep, chapterId: string): QuizStep {
  const options = step.answers.map((answer, idx) => ({
    id: String(idx),
    label: answer,
  }));
  const correctIndex = step.answers.indexOf(step.correct_answer);
  return {
    id: `${chapterId}_q_${step.order}`,
    question: step.question,
    required: true,
    options,
    correctOptionId: String(correctIndex >= 0 ? correctIndex : 0),
  };
}

function mapChapter(ch: ApiCourseChapter): CourseChapter {
  return {
    id: ch.chapter_id,
    title: ch.title,
    video: {
      url: ch.video_url,
      title: ch.video_title || undefined,
    },
    quizSteps: ch.quiz_steps.map(step => mapQuizStep(step, ch.chapter_id)),
    quizCompletedTitle: ch.completed_title || undefined,
    quizCompletedDescription: ch.completed_description || undefined,
    quizCompletedAdditionalText: ch.completed_additional_text || undefined,
    quizCompletedCtaLabel: ch.completed_cta_label || undefined,
  };
}

function getCompletedChapterCount(
  chapters: CourseChapter[],
  currentChapterId: string,
): number {
  if (!currentChapterId) return 0;
  const idx = chapters.findIndex(ch => ch.id === currentChapterId);
  return idx > 0 ? idx : 0;
}

// ---------------------------------------------------------------------------
// Dynamic (API-sourced) course view
// ---------------------------------------------------------------------------

const DynamicCourseTraining: FC<{ slug: string }> = ({ slug }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';

  const { data: course, isLoading, error } = useSWR<CourseDetail>(
    `/api/courses/${slug}/${isPreview ? '?preview=1' : ''}`,
    () => fetchCourseDetail(slug, isPreview),
  );

  const [progress, setProgress] = useState<CourseProgress | null>(null);

  useEffect(() => {
    if (!course || isPreview) return;
    startCourse(slug)
      .then(setProgress)
      .catch(() => setProgress(null));
  }, [course, slug, isPreview]);

  if (isLoading) return <LoadingScreen />;

  if (error || !course) {
    return (
      <NotFoundCard>
        <Text
          color={theme.color.text.title}
          type={TextTypes.Body2}
          tag="h2"
          bold
          center
        >
          {t('resources.trainings.not_found')}
        </Text>
        <Link
          to={getAppRoute(TRAININGS_ROUTE)}
          buttonAppearance={ButtonAppearance.Primary}
        >
          {t('resources.trainings.return')}
        </Link>
      </NotFoundCard>
    );
  }

  const chapters = course.chapters.map(mapChapter);
  const completedChapterCount = getCompletedChapterCount(
    chapters,
    progress?.current_chapter_id ?? '',
  );

  const handleStepComplete = async (chapterId: string, stepIndex: number) => {
    if (isPreview) return;
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
    if (isPreview) return;
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
    if (!isPreview) {
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

// ---------------------------------------------------------------------------
// Route-level component — dispatches to hardcoded or dynamic view
// ---------------------------------------------------------------------------

const Training: FC = () => {
  const { trainingSlug } = useParams();
  const hardcoded = getDataBySlug(TRAININGS_DATA, trainingSlug);

  if (hardcoded) {
    return <HardcodedTraining training={hardcoded} />;
  }

  if (!trainingSlug) {
    return null;
  }

  return <DynamicCourseTraining slug={trainingSlug} />;
};

export default Training;
