import { FC, useState } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardSizes,
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
import PageHeader from '../../atoms/PageHeader';
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

  if (isLoading && !data) {
    return (
      <Page>
        <PageHeader canGoBack text={t('survey.page_title')} />
        <LoadingWrap>
          <Loading size={LoadingSizes.Medium} />
        </LoadingWrap>
      </Page>
    );
  }

  if (data?.state === 'available' && data.survey) {
    return (
      <Page>
        <PageHeader canGoBack text={t('survey.page_title')} />
        <CardWrap>
          <Survey
            key={data.survey.id}
            survey={data.survey}
            onSubmit={handleSubmit}
            submitError={submitError}
          />
        </CardWrap>
      </Page>
    );
  }

  if (data?.state === 'already_submitted') {
    return (
      <Page>
        <PageHeader canGoBack text={t('survey.page_title')} />
        <CardWrap>
          <Card width={CardSizes.Medium}>
            <CardHeader textColor={theme.color.text.title}>
              {t('survey.state.already_submitted.title')}
            </CardHeader>
            <CardContent>
              <Text>{t('survey.state.already_submitted.body')}</Text>
            </CardContent>
          </Card>
        </CardWrap>
      </Page>
    );
  }

  return <ErrorView />;
};

export default SurveyPage;
