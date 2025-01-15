import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Text,
  TextArea,
  TextAreaSize,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { registerInput } from '../../../helpers/form.ts';

const StyledCard = styled(Card)``;

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
    <StyledCard>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>{t('post_call_survey.title')}</CardHeader>
        <CardContent>
          <Text>{t('post_call_survey.description')}</Text>
          <div>
            <label>Rating:</label>
            <select
              {...registerInput({
                register,
                name: 'rating',
                options: { required: true },
              })}
            >
              <option value="">Select...</option>
              {[1, 2, 3, 4, 5].map(star => (
                <option key={star} value={star}>
                  {star}
                </option>
              ))}
            </select>
            {errors.rating && <span>This field is required</span>}
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
        <CardFooter>
          <Button type="submit">{t('post_call_survey.submit_button')}</Button>
        </CardFooter>
      </form>
    </StyledCard>
  );
};

export default PostCallSurvey;
