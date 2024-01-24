import {
  Button,
  ButtonAppearance,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import Cookies from 'js-cookie';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { BACKEND_URL } from '../../../ENVIRONMENT';
import ButtonsContainer from '../../atoms/ButtonsContainer';
import ModalCard, { Centred } from './ModalCard';

function DeleteAccountCard({ setShowModal }) {
  const { t } = useTranslation();

  return (
    <ModalCard>
      <Centred>
        <Text tag="h2" type={TextTypes.Heading4}>
          {t('settings.delete_account_modal_title')}
        </Text>
      </Centred>
      <ButtonsContainer>
        <Button
          appearance={ButtonAppearance.Secondary}
          onClick={() => setShowModal(false)}
        >
          {t('settings.delete_account_modal_cancel')}
        </Button>
        <Button
          backgroundColor="red"
          onClick={() => {
            // call deletion api ...
            // then reload page ...
            fetch(`${BACKEND_URL}/api/user/delete_account/`, {
              method: 'POST',
              headers: {
                'X-CSRFToken': Cookies.get('csrftoken'),
                'Content-Type': 'application/json',
              },
            }).then(res => {
              if (res.ok) {
                window.location.reload();
              } else {
                console.error(`Error ${res.status}: ${res.statusText}`);
              }
            });
          }}
        >
          {t('settings.delete_account_confirm_button')}
        </Button>
      </ButtonsContainer>
    </ModalCard>
  );
}

export default DeleteAccountCard;
