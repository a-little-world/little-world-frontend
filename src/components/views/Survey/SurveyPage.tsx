import { FC, useState } from 'react';

import {
  ButtonAppearance,
  ButtonSizes,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardSizes,
  Link,
  Loading,
  LoadingSizes,
  Text,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTheme } from 'styled-components';
import useSWR from 'swr';

import {
  fetchSurveyBySlug,
  getSurveyBySlugEndpoint,
  submitSurvey,
  SurveyAnswers,
} from '../../../api/surveys';
import { getAppRoute } from '../../../router/routes';
import { ErrorView } from '../../blocks/ErrorView/ErrorView';
import Survey from '../../blocks/Survey/Survey';
import { CardWrap, LoadingWrap, Page } from './SurveyPage.styles';

const SurveyPage: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const liveSession = searchParams.get('live_session');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const endpoint = slug ? getSurveyBySlugEndpoint(slug, liveSession) : null;
  const { data, isLoading, mutate } = useSWR(
    endpoint,
    () => fetchSurveyBySlug(slug as string, liveSession),
    { revalidateOnFocus: false },
  );

  const handleSubmit = async (answers: SurveyAnswers) => {
    if (!data?.survey) return;
    setSubmitError(null);
    try {
      await submitSurvey({ surveyId: data.survey.id, answers });
      await mutate(
        { state: 'already_submitted', survey: null },
        { revalidate: true },
      );
    } catch (err: any) {
      setSubmitError(err?.message ?? t('survey.state.error.body'));
    }
  };

  const isPending = isLoading && !data;
  const survey =
    data?.state === 'available' ? data.survey : null;
  const isSubmitted = data?.state === 'already_submitted';

  if (!isPending && !survey && !isSubmitted) {
    return <ErrorView />;
  }

  return (
    <Page>
      <CardWrap>
        {isPending && (
          <LoadingWrap>
            <Loading size={LoadingSizes.Medium} />
          </LoadingWrap>
        )}
        {survey && (
          <Survey
            key={survey.id}
            survey={survey}
            onSubmit={handleSubmit}
            submitError={submitError}
          />
        )}
        {isSubmitted && (
          <Card width={CardSizes.Medium}>
            <CardHeader textColor={theme.color.text.title}>
              {t('survey.state.already_submitted.title')}
            </CardHeader>
            <CardContent>
              <Text>{t('survey.state.already_submitted.body')}</Text>
            </CardContent>
            <CardFooter align="center">
              <Link
                buttonAppearance={ButtonAppearance.Primary}
                buttonSize={ButtonSizes.Stretch}
                to={getAppRoute()}
              >
                {t('survey.state.already_submitted.cta')}
              </Link>
            </CardFooter>
          </Card>
        )}
      </CardWrap>
    </Page>
  );
};

export default SurveyPage;
