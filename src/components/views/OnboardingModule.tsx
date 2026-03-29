import {
  Loading,
  LoadingSizes,
  LoadingType,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';

import { apiFetch } from '../../api/helpers';
import { USER_ENDPOINT } from '../../features/swr';
import { getAppRoute } from '../../router/routes';
import CourseChaptersLayoutOptionA, {
  type CourseChapter,
} from '../blocks/Course/ChaptersLayout';
import type { QuizStep } from '../blocks/Quiz/Quiz';

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
    video: 'https://youtu.be/CvyPO9dWr_E?si=BnhMq2vTpTFvXe4x',
  },
  {
    id: '2',
    title: 'Video 2',
    description: 'Description 2',
    video: 'https://youtu.be/0lqCDuXPPjs?si=IXX8VAjCEzjTcLcC',
  },
  {
    id: '3',
    title: 'Video 3',
    description: 'Description 3',
    video: 'https://youtu.be/Ewqdy8sWzNU?si=0CWKJ8b8-K-kZH71',
  },
];

// Dummy quiz data to test the Quiz component UI/behavior.
// - At least 3 steps are marked `required`
// - Each step is multiple-choice with an explicit correct option id
const quizSteps: QuizStep[] = [
  {
    id: 'q1',
    question: 'Wofür steht Little World?',
    required: true,
    options: [
      { id: 'a', label: 'Perfekte Deutschkenntnisse vermitteln' },
      {
        id: 'b',
        label:
          'Sprachliche und soziale Integration durch Begegnung und Austausch ermöglichen',
      },
      {
        id: 'c',
        label: 'Ehrenamtliche zu professionellen Sprachtrainer*innen ausbilden',
      },
      {
        id: 'd',
        label:
          'Menschen aus verschiedenen Ländern für berufliche Zwecke vernetzen.',
      },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q2',
    question: 'Wie sind die Treffen organisiert?',
    required: true,
    options: [
      {
        id: 'a',
        label: 'Little World legt feste Termine und Zeiten für alle fest.',
      },
      {
        id: 'b',
        label:
          'Die lernende Person bucht selbständig einen Termin direkt im Kalender der ehrenamtlichen Person.',
      },
      {
        id: 'c',
        label:
          'Ihr entscheidet gemeinsam, wann ihr euch trefft. Wir empfehlen etwa 30 Minuten pro Woche für 10 Wochen.',
      },
      {
        id: 'd',
        label:
          'Die Treffen finden mehrmals pro Woche nach einem festen Lernplan statt.',
      },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q3',
    question: 'Wo findet die Kommunikation statt?',
    required: true,
    options: [
      {
        id: 'a',
        label:
          'Über die Plattform von Little World - vom Chat bis zum Video-Gespräch.',
      },
      {
        id: 'b',
        label: 'Über private Telefonnummern und persönliche E-Mail-Adressen.',
      },
      { id: 'c', label: 'Bei persönlichen Treffen vor Ort.' },
      {
        id: 'd',
        label: 'Über frei gewählte externe Apps wie WhatsApp oder Zoom.',
      },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q4',
    question: 'Welche dieser Optionen gehört nicht zu unseren Werten?',
    required: true,
    options: [
      { id: 'a', label: 'Respekt' },
      { id: 'b', label: 'Zuverlässigkeit' },
      { id: 'c', label: 'Offenheit' },
      { id: 'd', label: 'Sprachliche Perfektion' },
    ],
    correctOptionId: 'd',
  },
  {
    id: 'q5',
    question: 'Was passiert nach Abschluss der Einführung?',
    required: true,
    options: [
      {
        id: 'a',
        label: 'Du kannst sofort selbst eine lernende Person auswählen.',
      },
      {
        id: 'b',
        label:
          'Dein Konto wird freigeschaltet und unser System sucht ein passendes Match, das zusätzlich vom Team geprüft wird.',
      },
      {
        id: 'c',
        label:
          'Du wirst automatisch mit mehreren lernenden Personen gleichzeitig verbunden.',
      },
      {
        id: 'd',
        label:
          'Die lernende Person sucht dich direkt aus einer öffentlichen Liste aus.',
      },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q6',
    question: 'Was passiert, wenn die lernende Person das Match bestätigt?',
    required: true,
    options: [
      {
        id: 'a',
        label:
          'Ihr erhaltet beide eine Einladung zu einem persönlichen Treffen vor Ort.',
      },
      {
        id: 'b',
        label:
          'Du erhältst eine E-Mail und ihr seid auf der Plattform miteinander verbunden.',
      },
      {
        id: 'c',
        label: 'Das Support-Team vereinbart automatisch euren ersten Termin.',
      },
      {
        id: 'd',
        label:
          'Du musst eine externe App herunterladen, um Kontakt aufzunehmen.',
      },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q7',
    question: 'Wie finden eure Gespräche statt?',
    required: true,
    options: [
      {
        id: 'a',
        label:
          'Über persönliche Telefonnummern oder private Messenger-Dienste wie Whatsapp.',
      },
      {
        id: 'b',
        label: 'Über eine externe Videoplattform wie Zoom oder Skype.',
      },
      {
        id: 'c',
        label:
          'Direkt über die Little-World-Plattform - inklusive Chat, Video und zusätzlichen Tools.',
      },
      { id: 'd', label: 'Vor Ort in deiner Stadt.' },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q8',
    question: 'Was ist das Ziel der Gespräche?',
    required: true,
    options: [
      { id: 'a', label: 'Jeden Fehler sofort zu korrigieren.' },
      {
        id: 'b',
        label:
          'Für 10 Wochen regelmäßig zu sprechen - idealerweise etwa 30 Minuten pro Woche.',
      },
      {
        id: 'c',
        label: 'So schnell wie möglich perfektes Deutsch zu erreichen.',
      },
      { id: 'd', label: 'Möglichst viele Themen in kurzer Zeit zu behandeln.' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q9',
    question: 'Warum ist es wichtig, früh über Ziele zu sprechen?',
    required: true,
    options: [
      {
        id: 'a',
        label: 'Damit du einen festen Unterrichtsplan erstellen kannst.',
      },
      {
        id: 'b',
        label: 'Damit ihr Erwartungen klärt und entspannter zusammenarbeitet.',
      },
      {
        id: 'c',
        label: 'Damit das Support-Team eure Gespräche bewerten kann.',
      },
      { id: 'd', label: 'Damit ihr schneller mit dem Programm fertig seid.' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q10',
    question: 'Wie kannst du Little World zusätzlich unterstützen?',
    required: true,
    options: [
      { id: 'a', label: 'An Gruppengesprächen teilnehmen.' },
      {
        id: 'b',
        label:
          'Unsere Inhalte auf Social Media teilen und uns weiterempfehlen.',
      },
      { id: 'c', label: 'Dich als interne Ehrenamtliche engagieren.' },
      { id: 'd', label: 'Alle genannten Möglichkeiten.' },
    ],
    correctOptionId: 'd',
  },
];

const chapters: CourseChapter[] = [
  {
    id: 'chapter-1',
    title: 'Kapitel 1',
    video: {
      url: ONBOARDING_VIDEOS[0].video,
      title: ONBOARDING_VIDEOS[0].title,
    },
    quizSteps: quizSteps.slice(0, 3),
  },
  {
    id: 'chapter-2',
    title: 'Kapitel 2',
    video: {
      url: ONBOARDING_VIDEOS[1].video,
      title: ONBOARDING_VIDEOS[1].title,
    },
    quizSteps: quizSteps.slice(3, 6),
  },
  {
    id: 'chapter-3',
    title: 'Kapitel 3',
    video: {
      url: ONBOARDING_VIDEOS[2].video,
      title: ONBOARDING_VIDEOS[2].title,
    },
    quizSteps: quizSteps.slice(6),
  },
];

const OnboardingWalkthrough = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading } = useSWR(USER_ENDPOINT);

  const currentStep =
    typeof data?.walkhrough_step === 'number' ? data.walkhrough_step : 0;

  const persistWalkthroughStep = async (nextWalkthroughStep: number) => {
    // Best-effort persistence.
    try {
      await apiFetch('/api/user/walkthrough_step/', {
        method: 'POST',
        body: {
          onboarding_step: nextWalkthroughStep,
        },
      });
    } catch {
      // UX falls back to URL params + local state.
    }
  };

  if (isLoading)
    return <Loading type={LoadingType.Logo} size={LoadingSizes.XLarge} />;

  return (
    <CourseChaptersLayoutOptionA
      chapters={chapters}
      currentStep={currentStep}
      courseTitle={t('onboarding_walkthrough.title')}
      onBack={() => navigate(-1)}
      onPersistCourseStep={persistWalkthroughStep}
      onCourseComplete={() => navigate(getAppRoute())}
    />
  );
};

export default OnboardingWalkthrough;
