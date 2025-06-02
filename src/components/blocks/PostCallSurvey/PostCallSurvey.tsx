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
  StarRatingSizes,
  StatusMessage,
  Text,
  TextArea,
  TextAreaSize,
} from '@a-little-world/little-world-design-system';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { TFunction, useTranslation } from 'react-i18next';

import styled, { useTheme } from 'styled-components';

import { updatePostCallSurvey } from '../../../features/userData.js';
import { registerInput } from '../../../helpers/form.ts';

const StyledCard = styled(Card)``;

const StyledStarRating = styled(StarRating)`
  margin-top: ${({ theme }) => theme.spacing.xxsmall};
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
  onSubmit: (params: {
    rating?: number;
    review?: string;
    onError?: (error: any) => void;
  }) => void;
}

const PostCallSurvey: React.FC<PostCallSurveyProps> = ({ onSubmit }) => {
  const dispatch = useDispatch();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IFormInput>();
  const [submitError, setSubmitError] = useState(null);

  const { t } = useTranslation();
  const theme = useTheme();
  const watchedRating = watch('rating');

  useEffect(() => {
    if (watchedRating)
      dispatch(
        updatePostCallSurvey({
          rating: watchedRating,
        }),
      );
  }, [watchedRating, dispatch]);

  const handleSubmitFeedback: SubmitHandler<IFormInput> = async ({
    rating,
    review,
  }) => {
    onSubmit({
      rating,
      review,
      onError: error => setSubmitError(error?.message),
    });
  };

  return (
    <StyledCard width={CardSizes.Medium}>
      <form onSubmit={handleSubmit(handleSubmitFeedback)}>
        <CardHeader textColor={theme.color.text.title}>
          {t('post_call_survey.title')}
        </CardHeader>
        <CardContent>
          <Text tag="label">{t('post_call_survey.description')}</Text>

          <Controller
            name="rating"
            control={control}
            render={({ field: { onChange, name } }) => (
              <StyledStarRating
                id="call_rating"
                name={name}
                onChange={onChange}
                ratings={getRatingLabels(t)}
                displayTextRatings
                size={StarRatingSizes.Medium}
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
            onBlur={e =>
              dispatch(updatePostCallSurvey({ review: e?.target.value }))
            }
          />
          {!!submitError && (
            <StatusMessage $visible $type={MessageTypes.Error}>
              {submitError}
            </StatusMessage>
          )}
        </CardContent>
        <CardFooter align="center">
          <Button
            type="submit"
            size={ButtonSizes.Stretch}
            disabled={!watchedRating}
          >
            {t('post_call_survey.submit_button')}
          </Button>
        </CardFooter>
      </form>
    </StyledCard>
  );
};

export default PostCallSurvey;
