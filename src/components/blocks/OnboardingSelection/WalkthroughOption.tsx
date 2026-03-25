import {
  ButtonAppearance,
  ButtonSizes,
  CardFooter,
  Link,
  TeacherImage,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';

import {
  FORM_WALKTHROUGH_ROUTE,
  WALKTHROUGH_ROUTE,
  getAppRoute,
} from '../../../router/routes';
import {
  OnboardingOptionComparison,
  OptionSubtext,
  OptionTitle,
  StatBox,
  StatLabel,
  StatValue,
  StatsGridV1,
} from './OnboardingSelection.styles';

function WalkthroughInProgressComparison({
  walkthroughProgress,
}: {
  walkthroughProgress: { completed: number; total: number };
}) {
  const { t } = useTranslation();
  return (
    <StatsGridV1>
      <StatBox>
        <StatLabel type={TextTypes.Body4}>
          {t('onboarding_selection.comparison_format_label')}
        </StatLabel>
        <StatValue type={TextTypes.Body4} bold>
          {t('onboarding_selection.walkthrough_format_value')}
        </StatValue>
      </StatBox>
      <StatBox>
        <StatLabel type={TextTypes.Body4}>
          {t('onboarding_selection.progress_label')}
        </StatLabel>
        <StatValue type={TextTypes.Body4} bold>
          {t('onboarding_selection.walkthrough_progress', {
            completed: walkthroughProgress.completed,
            total: walkthroughProgress.total,
          })}
        </StatValue>
      </StatBox>
    </StatsGridV1>
  );
}

function WalkthroughOption({
  isFormRoute,
  mockWalkthroughStarted,
  walkthroughProgress,
}: {
  isFormRoute: boolean;
  mockWalkthroughStarted: boolean;
  walkthroughProgress: { completed: number; total: number };
}) {
  const { t } = useTranslation();
  return (
    <>
      <TeacherImage label="teacher image" height={60} />
      <OptionTitle type={TextTypes.Body3} bold>
        {mockWalkthroughStarted
          ? t('onboarding_selection.walkthrough_in_progress_heading')
          : t('onboarding_selection.walkthrough_title')}
      </OptionTitle>
      <OptionSubtext type={TextTypes.Body4}>
        {mockWalkthroughStarted
          ? t('onboarding_selection.walkthrough_in_progress_description')
          : t('onboarding_selection.walkthrough_subtext')}
      </OptionSubtext>
      {!mockWalkthroughStarted && (
        <>
          <OnboardingOptionComparison variant="walkthrough" />
          <CardFooter>
            <Link
              buttonAppearance={ButtonAppearance.Primary}
              buttonSize={ButtonSizes.Stretch}
              to={getAppRoute(
                isFormRoute ? FORM_WALKTHROUGH_ROUTE : WALKTHROUGH_ROUTE,
              )}
            >
              {t('onboarding_selection.walkthrough_cta')}
            </Link>
          </CardFooter>
        </>
      )}
      {mockWalkthroughStarted && (
        <>
          <WalkthroughInProgressComparison
            walkthroughProgress={walkthroughProgress}
          />
          <CardFooter>
            <Link
              buttonAppearance={ButtonAppearance.Primary}
              buttonSize={ButtonSizes.Stretch}
              to={getAppRoute(
                isFormRoute ? FORM_WALKTHROUGH_ROUTE : WALKTHROUGH_ROUTE,
              )}
            >
              {t('onboarding_selection.walkthrough_continue_cta')}
            </Link>
          </CardFooter>
        </>
      )}
    </>
  );
}

export default WalkthroughOption;
