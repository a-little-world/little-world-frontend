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

import { reportMatch, unmatch } from '../../../api/matches';
import { revalidateMatches } from '../../../features/swr/index';
import ReportForm from '../ReportForm/ReportForm';

export const PARTNER_ACTION_REPORT = 'report';
export const PARTNER_ACTION_UNMATCH = 'unmatch';

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

const ConfimrationText = styled(Text)`
  line-height: 1.5;
`;

function PartnerActionCard({ data, onClose }) {
  const { t } = useTranslation();
  const [confirmed, setConfirmed] = useState(false);
  const isUnmatch = data.type === PARTNER_ACTION_UNMATCH;

  const handleOnClose = () => {
    onClose();
  };

  const handleUnmatch = formData => {
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

  const handleReport = formData => {
    reportMatch({
      reason: formData.reason,
      matchId: data.matchId,
      reportType: formData.reportType,
      keywords: formData.keywords || null,
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
            <UnmatchedImage height="120px" />
          ) : (
            <ExclamationIcon
              width="64px"
              height="64px"
              label={t('report_modal_exclamation_label')}
            />
          )}
          <ConfimrationText type={TextTypes.Body5} center>
            {t(`${data?.type}_modal_confirmation`, { name: data.userName })}
          </ConfimrationText>
          {isUnmatch && <Text center>{t('unmatch_modal_search_again')}</Text>}
          <Button
            type="button"
            appearance={ButtonAppearance.Secondary}
            onClick={handleOnClose}
          >
            {t(`${data?.type}_modal_close_btn`)}
          </Button>
        </Centred>
      );
    }

    return (
      <ReportForm
        data={data}
        onSubmit={isUnmatch ? handleUnmatch : handleReport}
        onClose={handleOnClose}
      />
    );
  };

  return <Card width={CardSizes.Medium}>{renderContent()}</Card>;
}

export default PartnerActionCard;
