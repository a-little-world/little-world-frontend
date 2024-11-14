import React from 'react';
import { useDispatch } from 'react-redux';

import { confirmMatch, partiallyConfirmMatch } from '../../../api/matches.ts';
import {
  addMatch,
  changeMatchCategory,
  removeMatch,
} from '../../../features/userData.js';
import ConfirmMatchCard from './ConfirmMatchCard.tsx';
import NewMatchCard from './NewMatchCard.jsx';

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
  const dispatch = useDispatch();

  return showNewMatch ? (
    <NewMatchCard
      name={profile.first_name}
      imageType={profile.image_type}
      image={usesAvatar ? profile.avatar_config : profile.image}
      onExit={() => {
        confirmMatch({
          userHash: profile.id,
          onSuccess: () =>
            dispatch(
              changeMatchCategory({
                match: { id: matchId },
                category: 'unconfirmed',
                newCategory: 'confirmed',
              }),
            ),
          onError: error => console.error(error),
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
          onSuccess: response => {
            dispatch(
              removeMatch({
                category: 'proposed',
                match: { id: matchId },
              }),
            );
            dispatch(
              addMatch({
                match: response.match,
                category: 'unconfirmed',
              }),
            );
          },
          onError: error => console.error(error),
        });
      }}
      onReject={() => {
        partiallyConfirmMatch({
          acceptDeny: false,
          matchId,
          onSuccess: () =>
            dispatch(
              removeMatch({
                category: 'proposed',
                match: { id: matchId },
              }),
            ),
          onError: error => console.error(error),
        });
      }}
      onClose={onClose}
    />
  );
};

export default MatchCardComponent;
