import React from 'react';

import { mutate } from 'swr';
import { confirmMatch, partiallyConfirmMatch } from '../../../api/matches.ts';
import ConfirmMatchCard from './ConfirmMatchCard.tsx';
import NewMatchCard from './NewMatchCard.jsx';
import { MATCHES_ENDPOINT } from '../../../features/swr/index.ts';

type MatchCardProps = {
  showNewMatch: boolean;
  matchId: string;
  profile: any;
  onClose: () => void;
};

export const MatchCardComponent = ({
  showNewMatch,
  matchId,
  profile,
  onClose,
}: MatchCardProps) => {
  const usesAvatar = profile?.image_type === 'avatar';

  return showNewMatch ? (
    <NewMatchCard
      name={profile.first_name}
      imageType={profile.image_type}
      image={usesAvatar ? profile.avatar_config : profile.image}
      onExit={() => {
        confirmMatch({
          userHash: profile.id,
          onSuccess: () => {
            mutate(MATCHES_ENDPOINT);
          },
          onError: (_error) => console.error(_error),
        });
      }}
    />
  ) : (
    <ConfirmMatchCard
      name={profile?.first_name}
      imageType={profile?.image_type}
      image={usesAvatar ? profile?.avatar_config : profile?.image}
      description={profile?.description}
      onConfirm={() => {
        partiallyConfirmMatch({
          acceptDeny: true,
          matchId,
          onSuccess: (_response) => {
            mutate(MATCHES_ENDPOINT);
          },
          onError: (_error) => console.error(_error),
        });
      }}
      onReject={() => {
        partiallyConfirmMatch({
          acceptDeny: false,
          matchId,
          onSuccess: () => {
            mutate(MATCHES_ENDPOINT);
          },
          onError: (_error) => console.error(_error),
        });
      }}
      onClose={onClose}
    />
  );
};

export default MatchCardComponent;
