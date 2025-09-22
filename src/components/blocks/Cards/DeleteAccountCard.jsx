import {
  Button,
  ButtonAppearance,
  Card,
  CardContent,
  CardHeader,
  CardSizes,
  StatusMessage,
  StatusTypes,
} from '@a-little-world/little-world-design-system';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { deleteAccount } from '../../../api/profile';
import ButtonsContainer from '../../atoms/ButtonsContainer';

function DeleteAccountCard({ setShowModal }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [error, setError] = useState(null);

  const onDeleteAccount = () => {
    deleteAccount({
      onSuccess: () => {
        window.location.reload();
      },
      onError: e => {
        setError(e?.message || t('error.server_issue'));
      },
    });
  };

  return (
    <Card width={CardSizes.Medium}>
      <CardHeader>{t('settings.delete_account_modal_title')}</CardHeader>
      {error && (
        <CardContent>
          <StatusMessage type={StatusTypes.Error} visible>
            {error}
          </StatusMessage>
        </CardContent>
      )}
      <ButtonsContainer>
        <Button
          appearance={ButtonAppearance.Secondary}
          onClick={() => setShowModal(false)}
        >
          {t('settings.delete_account_modal_cancel')}
        </Button>
        <Button
          backgroundColor={theme.color.status.error}
          onClick={onDeleteAccount}
        >
          {t('settings.delete_account_confirm_button')}
        </Button>
      </ButtonsContainer>
    </Card>
  );
}

export default DeleteAccountCard;
