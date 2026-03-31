import {
  ArrowLeftIcon,
  Button,
  ButtonVariations,
  Card,
  CardContent,
  CardHeader,
  CardSizes,
  CheckIcon,
  CloseIcon,
  Text,
  TextArea,
  TextAreaSize,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NiceAvatarProps } from 'react-nice-avatar';
import styled, { useTheme } from 'styled-components';

import { confirmMatch, confirmOrDenyMatch } from '../../../api/matches';
import { MATCH_TYPES } from '../../../constants';
import { revalidateMatches } from '../../../features/swr';
import { registerInput } from '../../../helpers/form';
import useToast from '../../../hooks/useToast';
import ProfileImage from '../../atoms/ProfileImage';

const SectionTitle = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
  width: 100%;
`;

const ListScroll = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1 1 auto;
  min-height: 0;
  padding-right: ${({ theme }) => theme.spacing.xsmall};
  margin-bottom: ${({ theme }) => theme.spacing.medium};

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.medium}) {
      max-height: min(55vh, 480px);
    }
  `}
`;

const SectionBlock = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.large};

  &:last-child {
    margin-bottom: 0;
  }
`;

const ProposalRow = styled.div<{
  $isResolved?: boolean;
  $isRejectForm?: boolean;
}>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => `${theme.spacing.xxxsmall} ${theme.spacing.xsmall}`};
  padding: ${({ theme, $isRejectForm }) => `${theme.spacing.small}
    ${theme.spacing.xsmall}${$isRejectForm ? ` 0` : ''}`};
  border-radius: ${({ theme }) => theme.radius?.medium ?? '8px'};
  background: ${({ theme }) => theme.color.surface.secondary};
  opacity: ${({ $isResolved }) => ($isResolved ? 0.75 : 1)};
  flex-wrap: wrap;

  & + & {
    margin-top: ${({ theme }) => theme.spacing.small};
  }
`;

const RowMain = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.small};
`;

const RowImage = styled.div`
  flex-shrink: 0;
`;

const RowLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  flex-shrink: 0;
`;

const RowText = styled.div`
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const RowActions = styled.div<{ $hasMarginBottom?: boolean }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  align-self: flex-end;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.xsmall};
  justify-content: flex-end;

  ${({ theme, $hasMarginBottom }) => `
    margin-bottom: ${$hasMarginBottom ? theme.spacing.small : 0};

    @media (min-width: ${theme.breakpoints.medium}) {
      justify-content: center;
      width: unset;
    }
  `}
`;

export type ProposalItem = {
  id: string;
  match_type: string;
  partner: {
    id: string;
    first_name: string;
    description?: string;
    image?: string;
    avatar_config?: NiceAvatarProps;
    image_type: string;
  };
};

interface MatchProposalsProps {
  proposals: ProposalItem[];
}

type ProposalStatus = 'idle' | 'accepted' | 'rejected' | 'reject-form';

interface ProposalState {
  status: ProposalStatus;
  loading: boolean;
  error: string | null;
}

interface RejectFormData {
  rejectReason: string;
}

const getSectionTitleKey = (matchType: string) =>
  matchType === MATCH_TYPES.standard
    ? 'confirm_match.section_standard'
    : 'confirm_match.section_random_call';

function groupProposalsByType(proposals: ProposalItem[]) {
  const standard = proposals.filter(p => p.match_type === MATCH_TYPES.standard);
  const randomCall = proposals.filter(
    p => p.match_type === MATCH_TYPES.random_call,
  );
  return { standard, randomCall };
}

function ProposalRowContent({
  proposal,
  state,
  onAccept,
  onRejectClick,
  onRejectDirect,
  onRejectSubmit,
  onCancelReject,
}: {
  proposal: ProposalItem;
  state: ProposalState;
  onAccept: () => void;
  onRejectClick: () => void;
  onRejectDirect: () => void;
  onRejectSubmit: (data: RejectFormData) => void;
  onCancelReject: () => void;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RejectFormData>();
  const { partner, match_type } = proposal;
  const usesAvatar = partner?.image_type === 'avatar';
  const image = usesAvatar ? partner?.avatar_config : partner?.image;
  const isStandard = match_type === MATCH_TYPES.standard;
  const resolved = state.status === 'accepted' || state.status === 'rejected';

  const isRejectForm = state.status === 'reject-form' && isStandard;

  return (
    <ProposalRow
      as={isRejectForm ? 'form' : 'div'}
      onSubmit={isRejectForm ? handleSubmit(onRejectSubmit) : undefined}
      $isResolved={resolved && !isRejectForm}
      $isRejectForm={isRejectForm}
    >
      <RowMain>
        <RowLeft>
          <RowImage>
            <ProfileImage
              image={image as string | NiceAvatarProps}
              imageType={partner?.image_type}
              size="xsmall"
              circle
            />
          </RowImage>
        </RowLeft>
        <RowText>
          {isRejectForm ? (
            <TextArea
              {...registerInput({
                register,
                name: 'rejectReason',
                options: {
                  required: 'error.required',
                  minLength: {
                    value: 20,
                    message: 'error.reject_reason_min_length',
                  },
                },
              })}
              id="rejectReason"
              label={t('confirm_match.reject_reason_label')}
              placeholder={t('confirm_match.reject_reason_placeholder')}
              size={TextAreaSize.Small}
              error={
                errors?.rejectReason?.message
                  ? t(errors.rejectReason.message)
                  : undefined
              }
              maxLength={500}
              displayCount={false}
              disabled={state.loading}
            />
          ) : (
            partner?.description && (
              <>
                <Text type={TextTypes.Body4} bold>
                  {partner?.first_name ?? ''}
                </Text>
                <Text type={TextTypes.Body5}>{partner.description}</Text>
              </>
            )
          )}
        </RowText>
      </RowMain>
      <RowActions $hasMarginBottom={isRejectForm}>
        {isRejectForm ? (
          <>
            <Button
              type="button"
              variation={ButtonVariations.Circle}
              onClick={onCancelReject}
              disabled={state.loading}
              aria-label={t('btn_cancel')}
              borderColor={theme.color.border.moderate}
              color={theme.color.text.secondary}
            >
              <ArrowLeftIcon label={t('btn_cancel')} width={16} height={16} />
            </Button>
            <Button
              type="submit"
              variation={ButtonVariations.Circle}
              disabled={state.loading}
              loading={state.loading}
              aria-label={t('confirm_match.reject_button')}
              backgroundColor={theme.color.surface.reject}
              color={theme.color.text.button}
            >
              <CheckIcon
                label={t('confirm_match.reject_button')}
                width={16}
                height={16}
              />
            </Button>
          </>
        ) : (
          state.status === 'idle' && (
            <>
              <Button
                type="button"
                variation={ButtonVariations.Circle}
                onClick={isStandard ? onRejectClick : onRejectDirect}
                disabled={state.loading}
                aria-label={t('confirm_match.reject_button')}
                borderColor={theme.color.border.reject}
                color={theme.color.surface.reject}
              >
                <CloseIcon
                  label={t('confirm_match.reject_button')}
                  width={16}
                  height={16}
                />
              </Button>
              <Button
                type="button"
                variation={ButtonVariations.Circle}
                onClick={onAccept}
                disabled={state.loading}
                loading={state.loading}
                aria-label={t('confirm_match.confirm_button')}
                backgroundColor={theme.color.surface.confirm}
                borderColor={theme.color.surface.confirm}
                color={theme.color.text.button}
              >
                <CheckIcon
                  label={t('confirm_match.confirm_button')}
                  width={16}
                  height={16}
                />
              </Button>
            </>
          )
        )}
      </RowActions>
      {!isRejectForm && state.status === 'accepted' && (
        <Text
          type={TextTypes.Body5}
          style={{ color: theme.color.text.success }}
        >
          {t('confirm_match.status_accepted')}
        </Text>
      )}
      {!isRejectForm && state.status === 'rejected' && (
        <Text type={TextTypes.Body5} style={{ color: theme.color.text.error }}>
          {t('confirm_match.status_declined')}
        </Text>
      )}
    </ProposalRow>
  );
}

export const MatchProposals: React.FC<MatchProposalsProps> = ({
  proposals,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [states, setStates] = useState<Record<string, ProposalState>>(() =>
    Object.fromEntries(
      proposals.map(p => [
        p.id,
        { status: 'idle', loading: false, error: null },
      ]),
    ),
  );

  const setProposalState = (matchId: string, patch: Partial<ProposalState>) => {
    setStates(prev => ({ ...prev, [matchId]: { ...prev[matchId], ...patch } }));
  };

  const showErrorToast = (message: string) => {
    toast.showToast({
      headline: t('error.server_issue'),
      title: message,
      showClose: true,
    });
  };

  const handleAccept = (proposal: ProposalItem) => () => {
    setProposalState(proposal.id, { loading: true, error: null });
    confirmOrDenyMatch({
      matchId: proposal.id,
      acceptDeny: true,
      onSuccess: () => {
        setProposalState(proposal.id, { status: 'accepted', loading: false });
        // on proposals view, automatically confirm the match for the partner
        confirmMatch({
          userHash: proposal.partner?.id,
          onSuccess: revalidateMatches,
          onError: () => {},
        });
      },
      onError: (err: any) => {
        setProposalState(proposal.id, { loading: false });
        showErrorToast(err?.message ?? t('error.server_issue'));
      },
    });
  };

  const handleRejectClick = (proposal: ProposalItem) => {
    if (proposal.match_type !== MATCH_TYPES.standard) return;
    setProposalState(proposal.id, { status: 'reject-form' });
  };

  const handleRejectSubmitStandard = (
    data: RejectFormData,
    proposal: ProposalItem,
  ) => {
    setProposalState(proposal.id, { loading: true });
    confirmOrDenyMatch({
      matchId: proposal.id,
      acceptDeny: false,
      denyReason: data.rejectReason,
      onSuccess: () => {
        setProposalState(proposal.id, { status: 'rejected', loading: false });
      },
      onError: (err: any) => {
        setProposalState(proposal.id, { loading: false });
        showErrorToast(err?.message ?? t('error.server_issue'));
      },
    });
  };

  const handleRejectRandomCall = (proposal: ProposalItem) => () => {
    setProposalState(proposal.id, { loading: true });
    confirmOrDenyMatch({
      matchId: proposal.id,
      acceptDeny: false,
      onSuccess: () => {
        setProposalState(proposal.id, { status: 'rejected', loading: false });
      },
      onError: (err: any) => {
        setProposalState(proposal.id, { loading: false });
        showErrorToast(err?.message ?? t('error.server_issue'));
      },
    });
  };

  const handleCancelReject = (proposal: ProposalItem) => {
    setProposalState(proposal.id, { status: 'idle' });
  };

  const { standard, randomCall } = groupProposalsByType(proposals);

  const renderSection = (titleKey: string, items: ProposalItem[]) => {
    if (items.length === 0) return null;
    return (
      <SectionBlock key={titleKey}>
        <SectionTitle type={TextTypes.Heading6}>{t(titleKey)}</SectionTitle>
        {items.map(proposal => (
          <ProposalRowContent
            key={proposal.id}
            proposal={proposal}
            state={
              states[proposal.id] ?? {
                status: 'idle',
                loading: false,
                error: null,
              }
            }
            onAccept={handleAccept(proposal)}
            onRejectClick={() => handleRejectClick(proposal)}
            onRejectDirect={handleRejectRandomCall(proposal)}
            onRejectSubmit={data => handleRejectSubmitStandard(data, proposal)}
            onCancelReject={() => handleCancelReject(proposal)}
          />
        ))}
      </SectionBlock>
    );
  };

  return (
    <Card width={CardSizes.Large}>
      <CardHeader>{t('confirm_match.title_proposals')}</CardHeader>
      <CardContent marginBottom={0}>
        <CardBody>
          <ListScroll>
            {renderSection(getSectionTitleKey(MATCH_TYPES.standard), standard)}
            {renderSection(
              getSectionTitleKey(MATCH_TYPES.random_call),
              randomCall,
            )}
          </ListScroll>
        </CardBody>
      </CardContent>
    </Card>
  );
};

export default MatchProposals;
