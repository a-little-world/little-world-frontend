import {
  Button,
  ButtonAppearance,
  Card,
  CardSizes,
  ExclamationIcon,
  Text,
  TextTypes,
  UnmatchedImage,
} from '@a-little-world/little-world-design-system';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { reportIssue, unmatch } from '../../../api/matches';
import { revalidateMatches } from '../../../features/swr/index';
import ReportForm from '../ReportForm/ReportForm';
import { REPORT_TYPE_UNMATCH, ReportType } from '../ReportForm/constants';

const Centred = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;

  ${({ theme }) => `
  gap: ${theme.spacing.medium};
  padding: ${theme.spacing.small} 0px;
  `}
`;

const ConfirmationText = styled(Text)`
  line-height: 1.5;
`;

interface PartnerActionCardProps {
  data: {
    matchId: string;
    userName: string;
    type: ReportType;
  };
  onClose: () => void;
}

interface FormData {
  reason: string;
  reportType?: ReportType;
  keywords?: [string];
}

function PartnerActionCard({ data, onClose }: PartnerActionCardProps) {
  const { t } = useTranslation();
  const [confirmed, setConfirmed] = useState(false);
  const isUnmatch = data.type === REPORT_TYPE_UNMATCH;
  const translationKeyPrefix = isUnmatch ? 'unmatch' : 'report';

  const handleOnClose = () => {
    onClose();
  };

  const handleUnmatch = (formData: FormData) => {
    unmatch({
      reason: formData.reason,
      matchId: data.matchId,
      onSuccess: () => {
        setConfirmed(true);
        revalidateMatches();
      },
      onError: () => {
        // Error handling will be done by ReportForm's internal error state
      },
    });
  };

  const handleReport = (formData: FormData) => {
    reportIssue({
      keywords: formData.keywords || undefined,
      kind: formData.reportType,
      matchId: data.matchId,
      reason: formData.reason,
      reportedUserId: undefined,
      onSuccess: () => {
        setConfirmed(true);
        revalidateMatches();
      },
      onError: () => {
        // Error handling will be done by ReportForm's internal error state
      },
    });
  };

  const renderContent = () => {
    if (confirmed) {
      return (
        <Centred>
          {isUnmatch ? (
            <UnmatchedImage height="120px" label="Unmatch with user" />
          ) : (
            <ExclamationIcon width="64px" height="64px" label="Report issue" />
          )}
          <ConfirmationText type={TextTypes.Body5} center>
            {t(`${translationKeyPrefix}.confirmation`, { name: data.userName })}
          </ConfirmationText>
          {isUnmatch && <Text center>{t('unmatch.search_again')}</Text>}
          <Button
            type="button"
            appearance={ButtonAppearance.Secondary}
            onClick={handleOnClose}
          >
            {t(`${translationKeyPrefix}.close_btn`)}
          </Button>
        </Centred>
      );
    }

    return (
      <ReportForm
        reportType={data.type}
        reportedUserName={data.userName}
        onSubmit={isUnmatch ? handleUnmatch : handleReport}
        onClose={handleOnClose}
      />
    );
  };

  return <Card width={CardSizes.Large}>{renderContent()}</Card>;
}

export default PartnerActionCard;
