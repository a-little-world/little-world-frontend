import {
  Button,
  ButtonAppearance,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardSizes,
  MessageTypes,
  StatusMessage,
  Text,
} from '@a-little-world/little-world-design-system';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';


import { updateUserSearchState } from '../../../api/profile.ts';
import { SEARCHING_STATES } from '../../../constants/index.ts';
import { updateSearchState } from '../../../features/userData.js';
import ButtonsContainer from '../../atoms/ButtonsContainer.jsx';
import { fetcher, USER_ENDPOINT } from '../../../features/swr/index.ts';
import useSWR from 'swr';

interface UpdateSearchStateCardProps {
  onClose: () => void;
}

function UpdateSearchStateCard({ onClose }: UpdateSearchStateCardProps) {
  const { t } = useTranslation();
  const { data: user } = useSWR(USER_ENDPOINT, fetcher)
  const isSearching = user?.isSearching;
  const currentState = isSearching
    ? SEARCHING_STATES.searching
    : SEARCHING_STATES.idle;
  const [error, setError] = useState(null);

  function activateSearching() {
    setError(null);
    const updatedState = isSearching
      ? SEARCHING_STATES.idle
      : SEARCHING_STATES.searching;
    updateUserSearchState({
      updatedState,
      onSuccess: () => {
        // TODO dispatch(updateSearchState(!isSearching));
        onClose();
      },
      onError: e => setError(e.message),
    });
  }

  return (
    <Card width={CardSizes.Medium}>
      <CardHeader>{t(`update_search_modal.${currentState}.title`)}</CardHeader>
      <CardContent>
        <Text>{t(`update_search_modal.${currentState}.description`)}</Text>
        {error && (
          <StatusMessage $visible={!!error} $type={MessageTypes.Error}>
            {error}
          </StatusMessage>
        )}
      </CardContent>
      <CardFooter>
        <ButtonsContainer>
          <Button appearance={ButtonAppearance.Secondary} onClick={onClose}>
            {t(`update_search_modal.${currentState}.cancel_btn`)}
          </Button>
          <Button onClick={activateSearching}>
            {t(`update_search_modal.${currentState}.confirm_btn`)}
          </Button>
        </ButtonsContainer>
      </CardFooter>
    </Card>
  );
}

export default UpdateSearchStateCard;
