import {
  Button,
  ButtonAppearance,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardSizes,
  StatusMessage,
  StatusTypes,
  Text,
} from '@a-little-world/little-world-design-system';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR, { mutate } from 'swr';

import { updateUserSearchState } from '../../../api/profile';
import { SEARCHING_STATES } from '../../../constants/index';
import { USER_ENDPOINT } from '../../../features/swr/index';
import ButtonsContainer from '../../atoms/ButtonsContainer';

interface UpdateSearchStateCardProps {
  onClose: () => void;
}

function UpdateSearchStateCard({ onClose }: UpdateSearchStateCardProps) {
  const { t } = useTranslation();
  const { data: user } = useSWR(USER_ENDPOINT);
  const isSearching = user?.isSearching;
  const currentState = isSearching ?
    SEARCHING_STATES.searching :
    SEARCHING_STATES.idle;
  const [error, setError] = useState(null);

  function activateSearching() {
    setError(null);
    const updatedState = isSearching ?
      SEARCHING_STATES.idle :
      SEARCHING_STATES.searching;
    updateUserSearchState({
      updatedState,
      onSuccess: () => {
        mutate(USER_ENDPOINT);
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
          <StatusMessage visible={!!error} type={StatusTypes.Error}>
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
