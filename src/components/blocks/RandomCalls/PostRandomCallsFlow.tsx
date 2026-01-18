import {
  Button,
  ButtonAppearance,
  ButtonVariations,
  CardContent,
  CardFooter,
  CardHeader,
  Text,
} from '@a-little-world/little-world-design-system';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

import { reportIssue } from '../../../api/matches';
import { useConnectedCallStore } from '../../../features/stores';
import { CallSetupCard } from '../Calls/CallSetup';
import ReportForm, { ReportFormData } from '../ReportForm/ReportForm';
import { REPORT_TYPE_USER } from '../ReportForm/constants';

type PostCallState = 'initial' | 'report' | 'report_confirmed';

const PostCallCard = styled(CallSetupCard)`
  max-width: 500px;
`;

const ReportProblem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xsmall};
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

interface PostRandomCallsFlowProps {
  onReturnToStart: () => void;
  onReturnToLobby: () => void;
}

const PostRandomCallsFlow = ({
  onReturnToStart,
  onReturnToLobby,
}: PostRandomCallsFlowProps) => {
  const { t } = useTranslation();
  const [flowState, setFlowState] = useState<PostCallState>('initial');
  const { disconnectedFromUser } = useConnectedCallStore();
  const theme = useTheme();

  const handleReportClick = () => {
    setFlowState('report');
  };

  const handleCancelReport = () => {
    setFlowState('initial');
  };

  const onSubmitReport = (
    { reason, reportType, keywords }: ReportFormData,
    onError: (error: any) => void,
  ) => {
    reportIssue({
      reason,
      kind: reportType,
      keywords,
      origin: 'Post Random Call',
      reportedUserId:
        reportType === REPORT_TYPE_USER ? disconnectedFromUser : null,
      onSuccess: () => {
        setFlowState('report_confirmed');
      },
      onError,
    });
  };

  // Initial View
  if (flowState === 'initial') {
    return (
      <PostCallCard>
        <CardHeader>{t('random_calls.post_call_title')}</CardHeader>
        <CardContent>
          <Text>{t('random_calls.post_call_description')}</Text>
          <ReportProblem>
            <Text center>{t('random_calls.report_problem')}</Text>
            <Button
              variation={ButtonVariations.Inline}
              onClick={handleReportClick}
              color={theme.color.text.link}
            >
              {t('random_calls.report_btn')}
            </Button>
          </ReportProblem>
        </CardContent>
        <CardFooter align="space-between">
          <Button
            appearance={ButtonAppearance.Secondary}
            onClick={onReturnToStart}
          >
            {t('random_calls.return_to_start')}
          </Button>
          <Button onClick={onReturnToLobby}>
            {t('random_calls.search_again')}
          </Button>
        </CardFooter>
      </PostCallCard>
    );
  }

  // Report Card View
  if (flowState === 'report') {
    return (
      <PostCallCard>
        <CardHeader>{t('random_calls.report_card_title')}</CardHeader>
        <CardContent>
          <ReportForm
            hideTitle
            onSubmit={onSubmitReport}
            onClose={handleCancelReport}
          />
        </CardContent>
      </PostCallCard>
    );
  }

  // Report Confirmation View
  if (flowState === 'report_confirmed') {
    return (
      <PostCallCard>
        <CardHeader>{t('random_calls.report_confirmed_title')}</CardHeader>
        <CardContent>
          <Text center>{t('random_calls.report_confirmed_description')}</Text>
        </CardContent>
        <CardFooter align="space-between">
          <Button
            onClick={onReturnToStart}
            appearance={ButtonAppearance.Secondary}
          >
            {t('random_calls.return_to_start')}
          </Button>
          <Button onClick={onReturnToLobby}>
            {t('random_calls.search_again')}
          </Button>
        </CardFooter>
      </PostCallCard>
    );
  }

  return null;
};

export default PostRandomCallsFlow;
