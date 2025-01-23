import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardSizes,
  StarRating,
  Text,
  TextArea,
  TextAreaSize,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TFunction, useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { registerInput } from '../../../helpers/form.ts';

const StyledCard = styled(Card)``;

const getRatingLabels = (t: TFunction) => [
  t('post_call_survey.rating_1'),
  t('post_call_survey.rating_2'),
  t('post_call_survey.rating_3'),
  t('post_call_survey.rating_4'),
  t('post_call_survey.rating_5'),
];

interface IFormInput {
  rating: number;
  comments: string;
}

const PostCallSurvey: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const { t } = useTranslation();

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    try {
      const response = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('Survey submitted successfully');
    } catch (error) {
      console.error('Error submitting survey:', error);
    }
  };

  return (
    <StyledCard width={CardSizes.Medium}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>{t('post_call_survey.title')}</CardHeader>
        <CardContent>
          <Text>{t('post_call_survey.description')}</Text>
          <div>
            <label>Rating:</label>

            {/* {...registerInput({
                register,
                name: 'rating',
                options: { required: true },
              })} */}

            <StarRating
              id="star-rating"
              name="rating"
              onChange={() => null}
              ratings={getRatingLabels(t)}
            />
          </div>
          <div>
            <TextArea
              {...registerInput({
                register,
                name: 'comments',
              })}
              label={t('help.contact_problem_label')}
              inputMode="text"
              // maxLength="300"
              size={TextAreaSize.Medium}
              error={t(errors?.message?.message)}
              placeholder={t('help.contact_problem_placeholder')}
            />
          </div>
        </CardContent>
        <CardFooter align="center">
          <Button type="submit">{t('post_call_survey.submit_button')}</Button>
        </CardFooter>
      </form>
    </StyledCard>
  );
};

export default PostCallSurvey;
