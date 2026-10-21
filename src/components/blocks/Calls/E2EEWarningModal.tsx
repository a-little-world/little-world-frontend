import {
  Button,
  ButtonSizes,
  Modal,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';

import ModalCard, { Centred, ModalTitle } from '../Cards/ModalCard';

type E2EEWarningModalProps = {
  open: boolean;
};

/**
 * Blocking warning for clients that cannot encrypt call media. There is deliberately no
 * way to dismiss it: calls are only offered with end-to-end encryption, so the client
 * has to be updated instead of continuing in plaintext.
 */
function E2EEWarningModal({ open }: E2EEWarningModalProps) {
  const { t } = useTranslation();

  return (
    <Modal open={open} locked hideCloseButton>
      <ModalCard>
        <Centred>
          <ModalTitle>{t('e2ee.warning_title')}</ModalTitle>
          <Text center type={TextTypes.Body4}>
            {t('e2ee.warning_body')}
          </Text>
        </Centred>
        <Button
          size={ButtonSizes.Small}
          onClick={() => window.location.reload()}
        >
          {t('e2ee.warning_reload')}
        </Button>
      </ModalCard>
    </Modal>
  );
}

export default E2EEWarningModal;
