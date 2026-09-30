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
import { ApiError } from '../../../api/types';
import { getAppSubpageRoute, TRAININGS_ROUTE } from '../../../router/routes';
import { PROFILE_CARD_HEIGHT, StyledProfileCard } from './ProfileCard';

export const PROMOTED_COURSE_SLUG = 'interkulturelle-gespraechsfhrung';
/** Replace with the post-course survey URL when it is ready. */
export const COURSE_PROMO_SURVEY_URL = '';

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

const Thumbnail = styled.img`
  width: 154px;
  height: 154px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.small};
  flex-shrink: 0;
  margin-bottom: ${({ theme }) => theme.spacing.xsmall};
`;

const InfoContainer = styled.div<{ $centered: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $centered }) => ($centered ? 'center' : 'stretch')};
  text-align: ${({ $centered }) => ($centered ? 'center' : 'left')};
`;

const StyledProgressRing = styled(ProgressRing)`
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const PercentValue = styled(Text)`
  color: ${({ theme }) => theme.color.text.heading};
  line-height: 1;
`;

const StyledLink = styled(Link)`
  margin-top: auto;
`;

const LoadingCard = styled(StyledProfileCard)`
  order: 2;
`;

function CoursePromoCard() {
  const { t } = useTranslation();
  const coursePath = getAppSubpageRoute(TRAININGS_ROUTE, PROMOTED_COURSE_SLUG);

  const {
    data: course,
    error: courseError,
    isLoading: courseLoading,
  } = useSWR<CourseDetail>(
    getCourseEndpoint(PROMOTED_COURSE_SLUG),
    () => fetchCourseDetail(PROMOTED_COURSE_SLUG),
    {
      shouldRetryOnError: (error: ApiError) => error.status !== 404,
    },
  );

  const {
    data: progress,
    error: progressError,
    isLoading: progressLoading,
  } = useSWR<CourseProgress | null>(
    getCourseProgressEndpoint(PROMOTED_COURSE_SLUG),
    () => fetchCourseProgress(PROMOTED_COURSE_SLUG),
  );

  if (courseLoading || progressLoading) {
    return <LoadingCard width={CardSizes.Small} $loading />;
  }

  if (courseError || progressError || !course) {
    return null;
  }

  const state = getPromoState(progress ?? null);
  const progressPercent = Math.round((progress?.progress_fraction ?? 0) * 100);
  const ctaProps =
    state === 'complete'
      ? { href: COURSE_PROMO_SURVEY_URL, target: '_blank' as const }
      : { to: coursePath };

  return (
    <StyledCard width={CardSizes.Small}>
      <InfoContainer $centered={state !== 'start'}>
        {state === 'start' && course.image && (
          <Thumbnail
            src={course.image}
            alt={t(`course_promo.${state}_title`)}
          />
        )}
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
        <Title tag="h3" type={TextTypes.Heading5} center={state !== 'start'}>
          {t(`course_promo.${state}_title`)}
        </Title>
        <Description center={state !== 'start'}>
          {t(`course_promo.${state}_description`, {
            courseName: t('course_promo.course_name'),
          })}
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
