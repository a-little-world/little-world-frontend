import React, { RefObject, useEffect, useRef, useState } from 'react';

import {
  Button,
  ButtonSizes,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardSizes,
  RadioGroup,
  StarRating,
  StarRatingSizes,
  StatusMessage,
  StatusTypes,
  Text,
  TextArea,
  TextAreaSize,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

import {
  PendingSurvey,
  SurveyAnswers,
  SurveyQuestion,
} from '../../../api/surveys';

const StyledStarRating = styled(StarRating)`
  margin-top: ${({ theme }) => theme.spacing.xxsmall};
`;

const Questions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  width: 100%;
`;

/**
 * The adjectives in the locale files describe the five points of a five-star scale.
 *
 * They cannot be stretched to fit another scale: spreading five words over ten stars labels
 * every value twice, and over six it repeats the middle one — the caption stops describing
 * the star it sits under. Any other scale renders bare stars instead, which reads as a plain
 * 1–N score rather than a mislabelled one.
 */
const STAR_LABEL_COUNT = 5;

function starLabelsForScale(
  scale: number,
  t: (key: string) => string,
): string[] | undefined {
  if (scale !== STAR_LABEL_COUNT) return undefined;
  return Array.from({ length: STAR_LABEL_COUNT }, (_, index) =>
    t(`survey.star.${index + 1}`),
  );
}

interface QuestionProps {
  question: SurveyQuestion;
  /** Sizes the rating widget. */
  scale: number;
  /** Star captions, or undefined when the scale has none to give. */
  ratingLabels?: string[];
  value?: number | string;
  onChange: (value: number | string) => void;
}

/** Only the rating widget is sized by the campaign's scale. */
type UnscaledQuestionProps = Omit<QuestionProps, 'scale' | 'ratingLabels'>;

const RatingQuestion: React.FC<QuestionProps> = ({
  question,
  scale,
  ratingLabels,
  value,
  onChange,
}) => (
  <StyledStarRating
    id={`survey_${question.id}`}
    name={question.id}
    onChange={onChange}
    ratings={ratingLabels}
    maxRating={scale}
    initialRating={(value as number) ?? 0}
    displayTextRatings={!!ratingLabels}
    size={StarRatingSizes.Medium}
  />
);

const TextQuestion: React.FC<UnscaledQuestionProps> = ({
  question,
  value,
  onChange,
}) => (
  <TextArea
    id={`survey_${question.id}`}
    name={question.id}
    label={question.label}
    placeholder={question.placeholder}
    inputMode="text"
    size={TextAreaSize.Medium}
    value={(value as string) ?? ''}
    onChange={event => onChange(event.target.value)}
  />
);

const ChoiceQuestion: React.FC<UnscaledQuestionProps> = ({
  question,
  value,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(
    null,
  ) as RefObject<HTMLInputElement>;

  return (
    <RadioGroup
      name={question.id}
      label={question.label}
      inputRef={inputRef}
      value={(value as string) ?? ''}
      onValueChange={onChange}
      items={(question.options ?? []).map(option => ({
        id: `survey_${question.id}_${option.value}`,
        value: option.value,
        label: option.label,
      }))}
    />
  );
};

const QUESTION_COMPONENTS: Record<
  SurveyQuestion['type'],
  React.FC<QuestionProps>
> = {
  rating: RatingQuestion,
  text: TextQuestion,
  choice: ChoiceQuestion,
};

const isAnswered = (value?: number | string) =>
  typeof value === 'number' ? true : Boolean(value && value.trim());

/**
 * Whether the survey can be submitted as it stands.
 *
 * Also used when the user closes the modal: a rating they already gave is worth keeping, so a
 * complete answer set is submitted rather than discarded as a dismissal.
 */
export const hasRequiredAnswers = (
  questions: SurveyQuestion[],
  answers: SurveyAnswers,
) =>
  questions
    .filter(question => question.required)
    .every(question => isAnswered(answers[question.id]));

interface SurveyProps {
  survey: PendingSurvey;
  /** Lets the parent submit what the user picked even if they close the modal. */
  onAnswersChange: (answers: SurveyAnswers) => void;
  onSubmit: (answers: SurveyAnswers) => void;
  submitError?: string | null;
}

const Survey: React.FC<SurveyProps> = ({
  survey,
  onAnswersChange,
  onSubmit,
  submitError,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const { questions, scale } = survey;
  const ratingLabels = starLabelsForScale(scale, t);

  useEffect(() => {
    onAnswersChange(answers);
  }, [answers, onAnswersChange]);

  const canSubmit = hasRequiredAnswers(questions, answers);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(answers);
  };

  return (
    <Card width={CardSizes.Medium}>
      <form onSubmit={handleSubmit}>
        <CardHeader textColor={theme.color.text.title}>
          {survey.title}
        </CardHeader>
        <CardContent>
          {!!survey.description && (
            <Text tag="label">{survey.description}</Text>
          )}

          <Questions>
            {questions.map(question => {
              const QuestionField = QUESTION_COMPONENTS[question.type];
              if (!QuestionField) return null;

              return (
                <QuestionField
                  key={question.id}
                  question={question}
                  scale={scale}
                  ratingLabels={ratingLabels}
                  value={answers[question.id]}
                  onChange={value =>
                    setAnswers(current => ({
                      ...current,
                      [question.id]: value,
                    }))
                  }
                />
              );
            })}
          </Questions>

          {!!submitError && (
            <StatusMessage visible type={StatusTypes.Error}>
              {submitError}
            </StatusMessage>
          )}
        </CardContent>
        <CardFooter align="center">
          <Button
            type="submit"
            size={ButtonSizes.Stretch}
            disabled={!canSubmit}
          >
            {survey.submit_button}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Survey;
