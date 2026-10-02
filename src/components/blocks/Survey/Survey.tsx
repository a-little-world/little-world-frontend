import React, { RefObject, useEffect, useRef } from 'react';

import {
  Button,
  ButtonSizes,
  Card,
  CardHeader,
  CardSizes,
  CheckboxGroup,
  InputError,
  Label,
  RadioGroup,
  StarRating,
  StarRatingSizes,
  StatusMessage,
  StatusTypes,
  Text,
  TextArea,
  TextAreaSize,
} from '@a-little-world/little-world-design-system';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

import {
  PendingSurvey,
  SurveyAnswers,
  SurveyAnswerValue,
  SurveyQuestion,
} from '../../../api/surveys';
import ScrollFade from '../../atoms/ScrollFade';

const SurveyCard = styled(Card)`
  min-height: 0;
  overflow: hidden;
`;

/**
 * The node ScrollFade clones a ref onto — it has to be a DOM element with overflow,
 * the same contract as SidebarContent. styled(CardContent) is a function component
 * and silently drops that ref.
 */
const ScrollBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  width: 100%;
`;

const SurveyForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  width: 100%;
`;

const QuestionBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Questions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  width: 100%;
`;

const RequiredAsterisk = styled.span`
  color: ${({ theme }) => theme.color.text.error};
`;

function QuestionLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: string;
}) {
  return (
    <Label bold htmlFor={htmlFor}>
      {children}
      {required ? <RequiredAsterisk aria-hidden="true"> *</RequiredAsterisk> : null}
    </Label>
  );
}

function scaleForQuestion(question: SurveyQuestion, fallback: number) {
  return question.scale ?? fallback;
}

interface QuestionProps {
  question: SurveyQuestion;
  /** Sizes the rating widget. */
  scale: number;
  value?: SurveyAnswerValue;
  onChange: (value: SurveyAnswerValue) => void;
  required?: boolean;
  error?: string;
}

type UnscaledQuestionProps = Omit<QuestionProps, 'scale'>;

const RatingQuestion: React.FC<QuestionProps> = ({
  question,
  scale,
  value,
  onChange,
  required,
  error,
}) => (
  <QuestionBlock aria-required={required || undefined}>
    <QuestionLabel required={required}>{question.label}</QuestionLabel>
    <StarRating
      id={`survey_${question.id}`}
      name={question.id}
      onChange={onChange}
      maxRating={scale}
      initialRating={(value as number) ?? 0}
      size={StarRatingSizes.Medium}
    />
    <InputError visible={Boolean(error)} textAlign="left">
      {error}
    </InputError>
  </QuestionBlock>
);

const TextQuestion: React.FC<UnscaledQuestionProps> = ({
  question,
  value,
  onChange,
  required,
  error,
}) => (
  <QuestionBlock>
    <QuestionLabel htmlFor={`survey_${question.id}`} required={required}>
      {question.label}
    </QuestionLabel>
    <TextArea
      id={`survey_${question.id}`}
      name={question.id}
      placeholder={question.placeholder}
      inputMode="text"
      size={TextAreaSize.Medium}
      value={(value as string) ?? ''}
      onChange={event => onChange(event.target.value)}
      required={required}
      error={error}
    />
  </QuestionBlock>
);

const ChoiceQuestion: React.FC<UnscaledQuestionProps> = ({
  question,
  value,
  onChange,
  required,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(
    null,
  ) as RefObject<HTMLInputElement>;

  return (
    <QuestionBlock>
      <QuestionLabel required={required}>{question.label}</QuestionLabel>
      <RadioGroup
        name={question.id}
        inputRef={inputRef}
        value={(value as string) ?? ''}
        onValueChange={onChange}
        orientation="vertical"
        required={required}
        error={error}
        items={(question.options ?? []).map(option => ({
          id: `survey_${question.id}_${option.value}`,
          value: option.value,
          label: option.label,
        }))}
      />
    </QuestionBlock>
  );
};

const MultiselectQuestion: React.FC<UnscaledQuestionProps> = ({
  question,
  value,
  onChange,
  required,
  error,
}) => (
  <QuestionBlock aria-required={required || undefined}>
    <QuestionLabel required={required}>{question.label}</QuestionLabel>
    <CheckboxGroup
      name={question.id}
      preSelected={Array.isArray(value) ? value : []}
      onSelection={onChange}
      error={error}
      options={(question.options ?? []).map(option => ({
        value: option.value,
        label: option.label,
      }))}
    />
  </QuestionBlock>
);

const QUESTION_COMPONENTS: Record<
  SurveyQuestion['type'],
  React.FC<QuestionProps>
> = {
  rating: RatingQuestion,
  text: TextQuestion,
  choice: ChoiceQuestion,
  multiselect: MultiselectQuestion,
};

const isAnswered = (value?: SurveyAnswerValue) => {
  if (typeof value === 'number') return value >= 1;
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value && value.trim());
};

const answeredEntries = (data: SurveyAnswers): SurveyAnswers =>
  Object.fromEntries(
    Object.entries(data).filter(([, value]) => isAnswered(value)),
  );

/**
 * Whether closing the modal should submit rather than dismiss: at least one answer, and every
 * required question answered. Without the first check an all-optional survey would record an
 * empty submission on a plain close.
 */
export const shouldSubmitOnClose = (
  questions: SurveyQuestion[],
  answers: SurveyAnswers,
) =>
  questions.some(question => isAnswered(answers[question.id])) &&
  questions
    .filter(question => question.required)
    .every(question => isAnswered(answers[question.id]));

interface SurveyProps {
  survey: PendingSurvey;
  /** Lets the parent submit what the user picked even if they close the modal. */
  onAnswersChange?: (answers: SurveyAnswers) => void;
  onSubmit: (answers: SurveyAnswers) => void | Promise<void>;
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
  const { questions } = survey;
  const scrollBodyRef = useRef<HTMLDivElement>(null);
  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<SurveyAnswers>({ shouldFocusError: false });

  useEffect(() => {
    const subscription = watch(values =>
      onAnswersChange?.(answeredEntries(values as SurveyAnswers)),
    );
    return () => subscription.unsubscribe();
  }, [watch, onAnswersChange]);

  const onValid = (data: SurveyAnswers) => onSubmit(answeredEntries(data));

  const onInvalid = () => {
    requestAnimationFrame(() => {
      scrollBodyRef.current?.scrollTo({ top: 0 });
      scrollBodyRef.current?.scrollIntoView({ block: 'start' });
    });
  };

  return (
    <SurveyCard width={CardSizes.Large}>
      <CardHeader textColor={theme.color.text.title}>{survey.title}</CardHeader>
      <ScrollFade axis="vertical" fill>
        <ScrollBody ref={scrollBodyRef}>
          <SurveyForm noValidate onSubmit={handleSubmit(onValid, onInvalid)}>
            {!!survey.description && (
              <Text tag="label">{survey.description}</Text>
            )}

            <Questions>
              {questions.map(question => {
                const QuestionField = QUESTION_COMPONENTS[question.type];
                if (!QuestionField) return null;
                const scale = scaleForQuestion(question, survey.scale);

                return (
                  <Controller
                    key={question.id}
                    name={question.id}
                    control={control}
                    rules={{
                      validate: value =>
                        !question.required ||
                        isAnswered(value) ||
                        t('error.required'),
                    }}
                    render={({ field, fieldState }) => (
                      <QuestionField
                        question={question}
                        scale={scale}
                        value={field.value}
                        onChange={field.onChange}
                        required={question.required}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                );
              })}
            </Questions>

            {!!submitError && (
              <StatusMessage visible type={StatusTypes.Error}>
                {submitError}
              </StatusMessage>
            )}
            <Button
              type="submit"
              size={ButtonSizes.Stretch}
              disabled={isSubmitting}
            >
              {survey.submit_button}
            </Button>
          </SurveyForm>
        </ScrollBody>
      </ScrollFade>
    </SurveyCard>
  );
};

export default Survey;
