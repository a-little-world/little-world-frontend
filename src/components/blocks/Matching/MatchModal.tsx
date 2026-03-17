import { Modal } from '@a-little-world/little-world-design-system';
import React, { useEffect, useRef, useState } from 'react';

import { MATCH_TYPES } from '../../../constants';
import { usesAvatar } from '../../../helpers/profile';
import ConfirmMatchCard from '../Cards/ConfirmMatchCard';
import type { ProposalItem } from './MatchProposals';
import ProposalsStackComponent from './MatchProposals';
import NewMatchCard from './NewMatchCard';

type MatchModalProps = {
  open: boolean; // Whether the match modal is open.
  /** Single unconfirmed match to show (NewMatchCard). When present, we show NewMatchCard unless proposals view is active. */
  unconfirmedMatch: { id: string; partner: any } | null;
  /** Proposed matches (1 = single ConfirmMatchCard, >1 = ProposalsStack). Order as from API; STANDARD first in UI. */
  proposals: ProposalItem[];
  onClose: () => void;
};

const allowedMatchTypes = [MATCH_TYPES.standard, MATCH_TYPES.random_call];

const MatchModal = ({
  open,
  unconfirmedMatch,
  proposals,
  onClose,
}: MatchModalProps) => {
  const hasNewMatch = Boolean(unconfirmedMatch?.partner);
  const [proposalsViewOpen, setProposalsViewOpen] = useState(false);
  const prevOpenRef = useRef(false);
  const filteredProposals = proposals.filter(p =>
    allowedMatchTypes.includes(p.match_type),
  );

  // Set proposalsViewOpen only when the modal first opens with 2+ proposals; clear when modal closes.
  useEffect(() => {
    if (!open) {
      setProposalsViewOpen(false);
      prevOpenRef.current = false;
      return;
    }
    if (!prevOpenRef.current && filteredProposals.length > 1) {
      setProposalsViewOpen(true);
    }
    prevOpenRef.current = open;
  }, [open, filteredProposals.length]);

  const handleClose = () => {
    setProposalsViewOpen(false);
    onClose();
  };

  const locked = hasNewMatch && !proposalsViewOpen;

  let content: React.ReactNode = null;
  if (proposalsViewOpen) {
    content = <ProposalsStackComponent proposals={filteredProposals} />;
  } else if (hasNewMatch) {
    const profile = unconfirmedMatch?.partner;
    content = (
      <NewMatchCard
        name={profile.first_name}
        imageType={profile.image_type}
        image={
          usesAvatar(profile.image_type) ? profile.avatar_config : profile.image
        }
        userHash={profile.id}
        onClose={handleClose}
      />
    );
  } else if (filteredProposals.length === 1) {
    const { id, match_type: matchType, partner } = filteredProposals[0];
    content = (
      <ConfirmMatchCard
        name={partner?.first_name ?? ''}
        imageType={partner?.image_type ?? 'image'}
        image={
          usesAvatar(partner?.image_type)
            ? partner?.avatar_config
            : partner?.image
        }
        description={partner?.description ?? ''}
        matchId={id}
        matchType={matchType}
        onClose={handleClose}
      />
    );
  }

  return (
    <Modal open={open} onClose={handleClose} locked={locked}>
      {content}
    </Modal>
  );
};

export default MatchModal;
