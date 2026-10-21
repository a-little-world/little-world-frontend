import {
  Button,
  ButtonSizes,
  Modal,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';

import ModalCard, { Centred, ModalTitle } from '../Cards/ModalCard';

/**
 * Blocking content for clients that cannot encrypt call media. There is deliberately no
 * action to continue into a call: calls are only offered with end-to-end encryption, so
 * the client has to be updated instead.
 */
export function E2EEWarningCard() {
  const { t } = useTranslation();

  return (
    <ModalCard>
      <Centred>
        <ModalTitle>{t('e2ee.warning_title')}</ModalTitle>
        <Text center type={TextTypes.Body4}>
          {t('e2ee.warning_body')}
        </Text>
      </Centred>
      <Button size={ButtonSizes.Small} onClick={() => window.location.reload()}>
        {t('e2ee.warning_reload')}
      </Button>
    </ModalCard>
  );
}

type E2EEWarningModalProps = {
  open: boolean;
};

/**
 * Full-screen variant for the call route, in case it is reached without passing through
 * the call setup (e.g. a stale deep link). The call UI is never rendered for those clients.
 */
function E2EEWarningModal({ open }: E2EEWarningModalProps) {
  return (
    <Modal open={open} locked hideCloseButton>
      <E2EEWarningCard />
    </Modal>
  );
}

export default E2EEWarningModal;
