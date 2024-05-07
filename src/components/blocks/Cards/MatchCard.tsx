import React from 'react';
import { useDispatch } from 'react-redux';

import { confirmMatch, partiallyConfirmMatch } from '../../../api/index.js';
import {
  changeMatchCategory,
  removeMatch,
} from '../../../features/userData.js';
import ConfirmMatchCard from './ConfirmMatchCard.jsx';
import NewMatchCard from './NewMatchCard.jsx';

type MatchCardProps = {
  showNewMatch: boolean;
  matchId: string;
  profile: any;
};

export const MatchCardComponent = ({
  showNewMatch,
  matchId,
  profile,
}: MatchCardProps) => {
  const usesAvatar = profile.image_type === 'avatar';
  const dispatch = useDispatch();

  return showNewMatch ? (
    <NewMatchCard
      name={profile.first_name}
      imageType={profile.image_type}
      image={usesAvatar ? profile.avatar_config : profile.image}
      onExit={() => {
        confirmMatch({ userHash: profile.id })
          .then(res => {
            if (res.ok) {
              dispatch(
                changeMatchCategory({
                  match: { id: matchId },
                  category: 'unconfirmed',
                  newCategory: 'confirmed',
                }),
              );
            }
          })
          .catch(error => console.error(error));
      }}
    />
  ) : (
    <ConfirmMatchCard
      name={profile.first_name}
      imageType={profile.image_type}
      image={usesAvatar ? profile.avatar_config : profile.image}
      onConfirm={() => {
        partiallyConfirmMatch({ acceptDeny: true, matchId }).then(res => {
          if (res.ok) {
            res.json().then(() => {
              // Change 'proposed' to 'unconfirmed' so it will render the 'new match' popup next
              dispatch(
                changeMatchCategory({
                  match: { id: matchId },
                  category: 'proposed',
                  newCategory: 'unconfirmed',
                }),
              );
            });
          } else {
            // TODO: Add toast error explainer or some error message
          }
        });
      }}
      onReject={() => {
        partiallyConfirmMatch({ acceptDeny: false, matchId }).then(res => {
          if (res.ok) {
            res.json().then(() => {
              dispatch(
                removeMatch({
                  category: 'proposed',
                  match: { id: matchId },
                }),
              );
            });
          } else {
            // TODO: Add toast error explainer or some error message
          }
        });
      }}
      onExit={() => {
        // TODO IMPORTANT: Now it's impossible to 'ingnore' confirming a match
      }}
    />
  );
};
