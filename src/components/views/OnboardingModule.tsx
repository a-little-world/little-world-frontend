import {
  ArrowLeftIcon,
  Button,
  ButtonVariations,
  Loading,
  LoadingSizes,
  LoadingType,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';

import { USER_ENDPOINT } from '../../features/swr';
import { getAppRoute } from '../../router/routes';
import Video from '../atoms/Video';
import Quiz, { QuizAnswer, type QuizStep } from '../blocks/Quiz/Quiz';

const ONBOARDING_VIDEOS = [
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

const OnboardingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  width: 100%;
  align-items: center;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  width: 100%;
`;

const BackButton = styled(Button)`
  justify-self: start;
`;

const HeaderTitle = styled(Text)`
  justify-self: center;
  text-align: center;
`;

const HeaderSpacer = styled.div`
  width: 40px;
  height: 40px;
`;

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
      { id: 'a', label: 'Little World legt feste Termine und Zeiten für alle fest.' },
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
    required: false,
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
    required: false,
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
    required: false,
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
        label:
          'Das Support-Team vereinbart automatisch euren ersten Termin.',
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
    required: false,
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
    required: false,
    options: [
      { id: 'a', label: 'Jeden Fehler sofort zu korrigieren.' },
      {
        id: 'b',
        label:
          'Für 10 Wochen regelmäßig zu sprechen - idealerweise etwa 30 Minuten pro Woche.',
      },
      { id: 'c', label: 'So schnell wie möglich perfektes Deutsch zu erreichen.' },
      { id: 'd', label: 'Möglichst viele Themen in kurzer Zeit zu behandeln.' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q9',
    question: 'Warum ist es wichtig, früh über Ziele zu sprechen?',
    required: false,
    options: [
      { id: 'a', label: 'Damit du einen festen Unterrichtsplan erstellen kannst.' },
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
    required: false,
    options: [
      { id: 'a', label: 'An Gruppengesprächen teilnehmen.' },
      {
        id: 'b',
        label: 'Unsere Inhalte auf Social Media teilen und uns weiterempfehlen.',
      },
      { id: 'c', label: 'Dich als interne Ehrenamtliche engagieren.' },
      { id: 'd', label: 'Alle genannten Möglichkeiten.' },
    ],
    correctOptionId: 'd',
  },
];

const OnboardingWalkthrough = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { data, isLoading } = useSWR(USER_ENDPOINT);
  // const isFinalStep = currentStep === ONBOARDING_VIDEOS.length - 1;
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setCurrentStep(data.onboarding_step || 0);
    }
  }, [data]);

  // const completeOnboarding = () => {};

  // const handleNextStep = () => {
  //   if (isFinalStep) {
  //     completeOnboarding();
  //   } else if (currentStep < ONBOARDING_VIDEOS.length - 1) {
  //     setCurrentStep(currentStep + 1);
  //   }
  // };

  const handleAnswer = (_answer: QuizAnswer) => {};
  const onBackButton = () => navigate(-1);

  if (isLoading)
    return <Loading type={LoadingType.Logo} size={LoadingSizes.XLarge} />;

  return (
    <OnboardingWrapper>
      <Header>
        <BackButton variation={ButtonVariations.Icon} onClick={onBackButton}>
          <ArrowLeftIcon label="return to selection" width="16" height="16" />
        </BackButton>
        <HeaderTitle type={TextTypes.Heading2}>
          {t('onboarding_walkthrough.title')}
        </HeaderTitle>
        <HeaderSpacer />
      </Header>
      <Video
        src={ONBOARDING_VIDEOS[currentStep].video}
        title={ONBOARDING_VIDEOS[currentStep].title}
        maxWidth="450px"
      />
      <Quiz
        steps={quizSteps}
        currentStep={1}
        exitRoute={getAppRoute()}
        onAnswer={handleAnswer}
      />
    </OnboardingWrapper>
  );
};

export default OnboardingWalkthrough;
