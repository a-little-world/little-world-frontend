import {
  ButtonAppearance,
  ButtonSizes,
  CardFooter,
  CardSizes,
  Link,
  TeacherImage,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { round } from 'lodash';
import { useTranslation } from 'react-i18next';

import { SELF_ONBOARDING_ROUTE, getAppRoute } from '../../../router/routes';
import {
  OptionCard,
  OptionSubtext,
  OptionTitle,
  ProgressValue,
  StatBoxFullWidth,
  StatLabel,
} from './Onboarding.styles';

function WalkthroughOption({
  started,
  progress,
}: {
  started: boolean;
  progress?: number;
}) {
  const { t } = useTranslation();

  return (
    <OptionCard $inProgress={started} width={CardSizes.Medium}>
      <TeacherImage label="teacher image" height={60} />
      <OptionTitle type={TextTypes.Body3} bold>
        {t('onboarding_selection.walkthrough_title')}
      </OptionTitle>
      <OptionSubtext type={TextTypes.Body4}>
        {started
          ? t('onboarding_selection.walkthrough_in_progress_description')
          : t('onboarding_selection.walkthrough_subtext')}
      </OptionSubtext>
      {!started && (
        <CardFooter>
          <Link
            buttonAppearance={ButtonAppearance.Primary}
            buttonSize={ButtonSizes.Stretch}
            to={getAppRoute(SELF_ONBOARDING_ROUTE)}
          >
            {t('onboarding_selection.walkthrough_cta')}
          </Link>
        </CardFooter>
      )}
      {started && progress && (
        <>
          <StatBoxFullWidth>
            <StatLabel type={TextTypes.Body4}>
              {t('onboarding_selection.walkthrough_in_progress')}
            </StatLabel>
            <ProgressValue type={TextTypes.Body4} bold>
              {t('onboarding_selection.walkthrough_progress', {
                count: round(progress * 100),
              })}
            </ProgressValue>
          </StatBoxFullWidth>
          <CardFooter>
            <Link
              buttonAppearance={ButtonAppearance.Primary}
              buttonSize={ButtonSizes.Stretch}
              to={getAppRoute(SELF_ONBOARDING_ROUTE)}
            >
              {t('onboarding_selection.walkthrough_continue_cta')}
            </Link>
          </CardFooter>
        </>
      )}
    </OptionCard>
  );
}

export default WalkthroughOption;
