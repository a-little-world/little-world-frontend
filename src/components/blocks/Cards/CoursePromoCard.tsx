import {
  ButtonAppearance,
  ButtonSizes,
  Card,
  CardSizes,
  Link,
  ProgressRing,
  ProgressRingAppearances,
  ProgressRingSizes,
  ProgressRingTones,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import useSWR from 'swr';

import {
  CourseDetail,
  CourseProgress,
  fetchCourseDetail,
  fetchCourseProgress,
  getCourseEndpoint,
  getCourseProgressEndpoint,
} from '../../../api/courses';
import {
  fetchSurveyStatus,
  getSurveyStatusEndpoint,
} from '../../../api/surveys';
import { ApiError } from '../../../api/types';
import {
  getAppSubpageRoute,
  getSurveyRoute,
  TRAININGS_ROUTE,
} from '../../../router/routes';
import { PROFILE_CARD_HEIGHT } from './ProfileCard';

export const PROMOTED_COURSE_SLUG = 'interkulturelle-gespraechsfuehrung';
export const COURSE_SURVEY_SLUG =
  'interkulturelle-gespraechsfuehrung-feedback-umfrage';

type PromoState = 'start' | 'continue' | 'complete';

const getPromoState = (progress: CourseProgress | null): PromoState => {
  if (progress?.completed) return 'complete';
  if (progress) return 'continue';
  return 'start';
};

const StyledCard = styled(Card)`
  border-color: ${({ theme }) => theme.color.border.subtle};
  gap: ${({ theme }) => theme.spacing.small};
  order: 2;
  height: ${PROFILE_CARD_HEIGHT};
  padding: ${({ theme }) => theme.spacing.medium};
`;

const Title = styled(Text)`
  color: ${({ theme }) => theme.color.text.heading};
  margin-bottom: ${({ theme }) => theme.spacing.xxxsmall};
`;

const Description = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledProgressRing = styled(ProgressRing)`
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const PercentValue = styled(Text)`
  color: ${({ theme }) => theme.color.text.primary};
  line-height: 1;
`;

const StyledLink = styled(Link)`
  margin-top: auto;
`;

function CoursePromoCard() {
  const { t } = useTranslation();
  const coursePath = getAppSubpageRoute(TRAININGS_ROUTE, PROMOTED_COURSE_SLUG);

  const {
    data: progress,
    error: progressError,
    isLoading: progressLoading,
  } = useSWR<CourseProgress | null>(
    getCourseProgressEndpoint(PROMOTED_COURSE_SLUG),
    () => fetchCourseProgress(PROMOTED_COURSE_SLUG),
  );

  const state = getPromoState(progress ?? null);

  const { data: surveyStatus, isLoading: surveyStatusLoading } = useSWR<{
    submitted: boolean;
  } | null>(
    state === 'complete' ? getSurveyStatusEndpoint(COURSE_SURVEY_SLUG) : null,
    () => fetchSurveyStatus(COURSE_SURVEY_SLUG),
  );

  const shouldLoadCourse =
    state === 'continue' ||
    (state === 'complete' && surveyStatus?.submitted === false);

  const {
    data: course,
    error: courseError,
    isLoading: courseLoading,
  } = useSWR<CourseDetail>(
    shouldLoadCourse ? getCourseEndpoint(PROMOTED_COURSE_SLUG) : null,
    () => fetchCourseDetail(PROMOTED_COURSE_SLUG),
    {
      shouldRetryOnError: (error: ApiError) => error.status !== 404,
    },
  );

  if (
    progressLoading ||
    progressError ||
    state === 'start' ||
    // Missing campaign (null): hide rather than link to a survey that does not exist.
    (state === 'complete' &&
      (surveyStatusLoading ||
        surveyStatus === null ||
        surveyStatus?.submitted)) ||
    courseLoading ||
    courseError ||
    !course
  ) {
    return null;
  }

  const progressPercent = Math.round((progress?.progress_fraction ?? 0) * 100);
  const ctaProps = {
    to: state === 'complete' ? getSurveyRoute(COURSE_SURVEY_SLUG) : coursePath,
  };

  return (
    <StyledCard width={CardSizes.Small}>
      <InfoContainer>
        {state === 'continue' && (
          <StyledProgressRing
            label={t('course_promo.progress_label', {
              percent: progressPercent,
            })}
            value={progressPercent}
            max={100}
            size={ProgressRingSizes.XLarge}
          >
            <PercentValue tag="span" type={TextTypes.Heading4} bold center>
              {t('course_promo.progress_percent', { percent: progressPercent })}
            </PercentValue>
          </StyledProgressRing>
        )}
        {state === 'complete' && (
          <StyledProgressRing
            label={t('course_promo.complete_progress_label')}
            appearance={ProgressRingAppearances.Complete}
            tone={ProgressRingTones.Success}
            size={ProgressRingSizes.XLarge}
          >
            <PercentValue tag="span" type={TextTypes.Heading4} bold center>
              {t('course_promo.progress_percent', { percent: 100 })}
            </PercentValue>
          </StyledProgressRing>
        )}
        <Title tag="h3" type={TextTypes.Heading5} center>
          {t(`course_promo.${state}_title`, {
            courseName: course.title,
          })}
        </Title>
        <Description center>
          {t(`course_promo.${state}_description`)}
        </Description>
      </InfoContainer>

      <StyledLink
        buttonAppearance={ButtonAppearance.Primary}
        buttonSize={ButtonSizes.Stretch}
        {...ctaProps}
      >
        {t(`course_promo.${state}_cta`)}
      </StyledLink>
    </StyledCard>
  );
}

export default CoursePromoCard;
