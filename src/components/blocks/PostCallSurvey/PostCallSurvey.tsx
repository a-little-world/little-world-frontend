import {
  Button,
  ButtonSizes,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardSizes,
  MessageTypes,
  StarRating,
  StatusMessage,
  Text,
  TextArea,
  TextAreaSize,
} from '@a-little-world/little-world-design-system';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { TFunction, useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { submitCallFeedback } from '../../../api/livekit.ts';
import { registerInput } from '../../../helpers/form.ts';

const StyledCard = styled(Card)``;

const StyledStarRating = styled(StarRating)`
  margin: ${({ theme }) => theme.spacing.small} 0;
`;

const getRatingLabels = (t: TFunction) => [
  t('post_call_survey.rating_1'),
  t('post_call_survey.rating_2'),
  t('post_call_survey.rating_3'),
  t('post_call_survey.rating_4'),
  t('post_call_survey.rating_5'),
];

interface IFormInput {
  rating: number;
  review: string;
}

interface PostCallSurveyProps {
  onSubmit: () => void;
}

const PostCallSurvey: React.FC<PostCallSurveyProps> = ({ onSubmit }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const [submitError, setSubmitError] = useState(null);

  const { t } = useTranslation();

  const handleSubmitFeedback: SubmitHandler<IFormInput> = async ({
    rating,
    review,
  }) => {
    submitCallFeedback({
      rating,
      review,
      onSuccess: onSubmit,
      onError: error => setSubmitError(error),
    });
  };

  return (
    <StyledCard width={CardSizes.Medium}>
      <form onSubmit={handleSubmit(handleSubmitFeedback)}>
        <CardHeader>{t('post_call_survey.title')}</CardHeader>
        <CardContent>
          <Text tag="label" for="call_rating">
            {t('post_call_survey.description')}
          </Text>

          <Controller
            name="rating"
            control={control}
            render={({ field: { onChange, name } }) => (
              <StyledStarRating
                id="call_rating"
                name={name}
                onChange={onChange}
                ratings={getRatingLabels(t)}
              />
            )}
          />

          <TextArea
            {...registerInput({
              register,
              name: 'review',
            })}
            label={t('post_call_survey.comment_label')}
            inputMode="text"
            size={TextAreaSize.Medium}
            error={t(errors?.review?.message)}
            placeholder={t('post_call_survey.comment_placeholder')}
          />
          <StatusMessage $visible={!!submitError} $type={MessageTypes.Error}>
            {submitError}
          </StatusMessage>
        </CardContent>
        <CardFooter align="center">
          <Button type="submit" size={ButtonSizes.Large}>
            {t('post_call_survey.submit_button')}
          </Button>
        </CardFooter>
      </form>
    </StyledCard>
  );
};

export default PostCallSurvey;
