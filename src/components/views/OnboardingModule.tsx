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
    question: 'What is the capital of Germany?',
    required: true,
    options: [
      { id: 'a', label: 'Berlin' },
      { id: 'b', label: 'Munich' },
      { id: 'c', label: 'Hamburg' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q2',
    question: 'Which language is mainly spoken in Austria?',
    required: true,
    options: [
      { id: 'a', label: 'German' },
      { id: 'b', label: 'Polish' },
      { id: 'c', label: 'Spanish' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q3',
    question: 'How do you say “thank you” in German?',
    required: false,
    options: [
      { id: 'a', label: 'Bitte' },
      { id: 'b', label: 'Danke' },
      { id: 'c', label: 'Entschuldigung' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q4',
    question: 'Which one is a common German greeting?',
    required: true,
    options: [
      { id: 'a', label: 'Hello' },
      { id: 'b', label: 'Guten Tag' },
      { id: 'c', label: 'Adios' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q5',
    question: 'Pick the correct verb: “to be” in German is…',
    required: false,
    options: [
      { id: 'a', label: 'sein' },
      { id: 'b', label: 'haben' },
      { id: 'c', label: 'werden' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q6',
    question: 'Which word means “please” in German?',
    required: false,
    options: [
      { id: 'a', label: 'Bitte' },
      { id: 'b', label: 'Danke' },
      { id: 'c', label: 'Nein' },
    ],
    correctOptionId: 'a',
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
