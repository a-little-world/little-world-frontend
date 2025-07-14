import React from 'react';

import ConfirmMatchCard from './ConfirmMatchCard.tsx';
import NewMatchCard from './NewMatchCard.tsx';

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
      userHash={profile.id}
    />
  ) : (
    <ConfirmMatchCard
      name={profile?.first_name}
      imageType={profile?.image_type}
      image={usesAvatar ? profile?.avatar_config : profile?.image}
      description={profile?.description}
      matchId={matchId}
      onClose={onClose}
    />
  );
};

export default MatchCardComponent;
