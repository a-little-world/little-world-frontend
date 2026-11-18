import { useState } from 'react';

import {
  ArrowLeftIcon,
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardSizes,
  ExclamationIcon,
  Link,
  MessageIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { submitFeedback } from '../../../api/feedback';
import { PendingSurvey, SurveyAnswers } from '../../../api/surveys';
import { getAppRoute, HELP_CONTACT_ROUTE } from '../../../router/routes';
import Survey from '../Survey/Survey';
import BugReportForm from './BugReportForm';
import {
  BackButton,
  FeedbackContainer,
  OptionButton,
  OptionCopy,
} from './Feedback.styles';

type FeedbackKind = 'general' | 'bug';

const FEEDBACK_KINDS = [
  { kind: 'general', Icon: MessageIcon },
  { kind: 'bug', Icon: ExclamationIcon },
] as const;

function Feedback() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [selectedKind, setSelectedKind] = useState<FeedbackKind | null>(null);
  const [isSent, setIsSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const showKinds = () => {
    setSelectedKind(null);
    setIsSent(false);
    setSubmitError(null);
  };

  const generalSurvey: PendingSurvey = {
    id: 0,
    campaign: 'feedback-general',
    scale: 5,
    context_key: '',
    title: t('help.feedback.general.title'),
    description: '',
    submit_button: t('help.feedback.general.submit'),
    questions: [
      {
        id: 'rating',
        type: 'rating',
        required: true,
        label: t('help.feedback.general.rating'),
      },
      {
        id: 'message',
        type: 'text',
        label: t('help.feedback.general.message'),
        placeholder: t('help.feedback.general.message_placeholder'),
      },
    ],
  };

  const submitGeneral = async (answers: SurveyAnswers) => {
    setSubmitError(null);
    try {
      await submitFeedback({
        kind: 'general',
        rating: answers.rating as number,
        message: answers.message as string | undefined,
      });
      setIsSent(true);
    } catch (error: any) {
      setSubmitError(t(error?.message || 'error.server_error'));
    }
  };

  if (isSent) {
    return (
      <FeedbackContainer>
        <Card width={CardSizes.Large}>
          <CardHeader textColor={theme.color.text.title}>
            {t('help.feedback.thanks_title')}
          </CardHeader>
          <CardContent>
            <Text center>{t('help.feedback.thanks_body')}</Text>
          </CardContent>
          <CardFooter align="center">
            <Button size={ButtonSizes.Stretch} onClick={showKinds}>
              {t('help.feedback.thanks_cta')}
            </Button>
          </CardFooter>
        </Card>
      </FeedbackContainer>
    );
  }

  if (selectedKind) {
    return (
      <FeedbackContainer>
        <BackButton
          variation={ButtonVariations.Inline}
          appearance={ButtonAppearance.Secondary}
          onClick={showKinds}
        >
          <ArrowLeftIcon label={t('help.feedback.back')} width={12} />
          {t('help.feedback.back')}
        </BackButton>
        {selectedKind === 'general' ? (
          <Survey
            survey={generalSurvey}
            onSubmit={submitGeneral}
            submitError={submitError}
          />
        ) : (
          <BugReportForm onSent={() => setIsSent(true)} />
        )}
      </FeedbackContainer>
    );
  }

  return (
    <FeedbackContainer>
      <Card width={CardSizes.Large}>
        <CardHeader textColor={theme.color.text.title}>
          {t('help.feedback.title')}
        </CardHeader>
        <CardContent>
          <Text center>{t('help.feedback.intro')}</Text>
          {FEEDBACK_KINDS.map(({ kind, Icon }) => (
            <OptionButton
              key={kind}
              variation={ButtonVariations.Option}
              size={ButtonSizes.Stretch}
              onClick={() => setSelectedKind(kind)}
            >
              <Icon label={t(`help.feedback.${kind}.title`)} width={24} />
              <OptionCopy>
                <Text bold tag="span">
                  {t(`help.feedback.${kind}.title`)}
                </Text>
                <Text
                  type={TextTypes.Body6}
                  color={theme.color.text.tertiary}
                  tag="span"
                >
                  {t(`help.feedback.${kind}.description`)}
                </Text>
              </OptionCopy>
            </OptionButton>
          ))}
          <Text type={TextTypes.Body6} center>
            {t('help.feedback.support_hint')}{' '}
            <Link
              to={getAppRoute(HELP_CONTACT_ROUTE)}
              textType={TextTypes.Body6}
            >
              {t('help.feedback.support_link')}
            </Link>
          </Text>
        </CardContent>
      </Card>
    </FeedbackContainer>
  );
}

export default Feedback;
