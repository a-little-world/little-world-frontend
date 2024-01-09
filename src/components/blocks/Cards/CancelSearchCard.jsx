import {
  Button,
  ButtonAppearance,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { changeSearchStatePost } from '../../../api';
import { updateSearchState } from '../../../features/userData';
import ButtonsContainer from '../../atoms/ButtonsContainer';
import ModalCard from './ModalCard';

const CancelSearchTitle = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

function CancelSearchCard({ onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const undoSearching = () => {
    changeSearchStatePost('idle').then(({ status, statusText }) => {
      if (status === 200) {
        dispatch(updateSearchState(false));
        onClose();
      } else {
        console.error(
          `Cancelling match searching failed with error ${status}: ${statusText}`,
        );
      }
    });
  };

  return (
    <ModalCard>
      <CancelSearchTitle tag="h2" center type={TextTypes.Heading2}>
        {t('cp_cancel_search_confirm')}
      </CancelSearchTitle>
      <ButtonsContainer>
        <Button appearance={ButtonAppearance.Secondary} onClick={onClose}>
          {t('cp_cancel_search_reject')}
        </Button>
        <Button onClick={undoSearching}>{t('cp_cancel_search')}</Button>
      </ButtonsContainer>
    </ModalCard>
  );
}

export default CancelSearchCard;
