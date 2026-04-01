import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import useSWR from 'swr';

import updateSelfOnboardingStep from '../../../api/onboarding';
import {
  SELF_ONBOARDING_WALKTHROUGH_STEP_IDS,
  USER_TYPES,
} from '../../../constants';
import { USER_ENDPOINT } from '../../../features/swr';
import { getAppRoute } from '../../../router/routes';
import LoadingScreen from '../../atoms/LoadingScreen';
import CourseChaptersLayout, {
  type CourseChapter,
} from '../../blocks/Course/ChaptersLayout';
import type { QuizStep } from '../../blocks/Quiz/Quiz';

const ONBOARDING_VIDEOS: Array<{
  id: string;
  title: string;
  description: string;
  video: string;
}> = [
  {
    id: '1',
    title: 'Video 1',
    description: 'Description 1',
    video: 'https://youtu.be/2djMjpVy3ss',
  },
  {
    id: '2',
    title: 'Video 2',
    description: 'Description 2',
    video: 'https://youtu.be/MtjitzgSnm8',
  },
  {
    id: '3',
    title: 'Video 3',
    description: 'Description 3',
    video: 'https://youtu.be/DGejr3GCXKc',
  },
];

// Dummy quiz data to test the Quiz component UI/behavior.
// - At least 3 steps are marked `required`
// - Each step is multiple-choice with an explicit correct option id
const quizSteps: QuizStep[] = [
  {
    id: 'c1_q_1',
    question: 'Welche gehören zu unseren Werten?',
    required: true,
    options: [
      { id: 'a', label: 'Respekt, Zuverlässigkeit, Offenheit' },
      {
        id: 'b',
        label: 'Sprachliche Perfektion',
      },
      {
        id: 'c',
        label: 'Nichts davon',
      },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'c2_q_1',
    question: 'Wie kommunizieren wir miteinander?',
    required: true,
    options: [
      {
        id: 'a',
        label:
          'Über persönliche Telefonnummern oder private Messenger-Dienste wie WhatsApp.',
      },
      {
        id: 'b',
        label:
          'Direkt über die Little-World-Plattform – inklusive Chat, Video und zusätzlicher Tools.',
      },
      {
        id: 'c',
        label: 'Vor Ort in deiner Stadt.',
      },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'c3_q_1',
    question:
      'Wie lange soll ich pro Woche mit meinem Gesprächspartner sprechen?',
    required: true,
    options: [
      {
        id: 'a',
        label: 'Jeden Tag',
      },
      {
        id: 'b',
        label: '30 Minuten pro Woche für 10 Wochen',
      },
      { id: 'c', label: 'Einmal reicht' },
    ],
    correctOptionId: 'b',
  },
];

const OnboardingWalkthrough = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading } = useSWR(USER_ENDPOINT);

  const currentStep = data?.selfOnboardingStepId;

  if (isLoading) return <LoadingScreen />;

  if (data?.profile?.user_type === USER_TYPES.learner) {
    return <Navigate to={getAppRoute()} replace />;
  }

  const chapters: CourseChapter[] = [
    {
      id: SELF_ONBOARDING_WALKTHROUGH_STEP_IDS[0],
      title: t('onboarding_walkthrough.chapter_1_title'),
      video: {
        url: ONBOARDING_VIDEOS[0].video,
        title: ONBOARDING_VIDEOS[0].title,
      },
      quizSteps: quizSteps.slice(0, 1),
    },
    {
      id: SELF_ONBOARDING_WALKTHROUGH_STEP_IDS[1],
      title: t('onboarding_walkthrough.chapter_2_title'),
      video: {
        url: ONBOARDING_VIDEOS[1].video,
        title: ONBOARDING_VIDEOS[1].title,
      },
      quizSteps: quizSteps.slice(1, 2),
    },
    {
      id: SELF_ONBOARDING_WALKTHROUGH_STEP_IDS[2],
      title: t('onboarding_walkthrough.chapter_3_title'),
      video: {
        url: ONBOARDING_VIDEOS[2].video,
        title: ONBOARDING_VIDEOS[2].title,
      },
      quizSteps: quizSteps.slice(2),
      quizCompletedTitle: t('onboarding_walkthrough.course_completed_title'),
      quizCompletedDescription: t(
        'onboarding_walkthrough.course_completed_description',
      ),
      quizCompletedAdditionalText: t(
        'onboarding_walkthrough.course_complete_community_calls',
      ),
    },
  ];

  return (
    <CourseChaptersLayout
      chapters={chapters}
      currentStepId={currentStep}
      courseTitle={t('onboarding_walkthrough.title')}
      onBack={() => navigate(-1)}
      onUpdateCourseStep={updateSelfOnboardingStep}
      onCourseComplete={() => navigate(getAppRoute())}
    />
  );
};

export default OnboardingWalkthrough;
