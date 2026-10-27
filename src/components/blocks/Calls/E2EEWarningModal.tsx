import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  Modal,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';

import ButtonsContainer from '../../atoms/ButtonsContainer';
import ModalCard, { Centred, ModalTitle } from '../Cards/ModalCard';

type E2EEWarningCardProps = {
  onContinue: () => void;
  /** the partner's client cannot encrypt, not this one */
  partner?: boolean;
};

function E2EEWarningCard({ onContinue, partner }: E2EEWarningCardProps) {
  const { t } = useTranslation();

  return (
    <ModalCard>
      <Centred>
        <ModalTitle>
          {t(partner ? 'e2ee.partner_warning_title' : 'e2ee.warning_title')}
        </ModalTitle>
        <Text center type={TextTypes.Body4}>
          {t(partner ? 'e2ee.partner_warning_body' : 'e2ee.warning_body')}
        </Text>
      </Centred>
      <ButtonsContainer>
        {!partner && (
          <Button
            appearance={ButtonAppearance.Secondary}
            size={ButtonSizes.Small}
            onClick={() => window.location.reload()}
          >
            {t('e2ee.warning_reload')}
          </Button>
        )}
        <Button size={ButtonSizes.Small} onClick={onContinue}>
          {t('e2ee.warning_continue')}
        </Button>
      </ButtonsContainer>
    </ModalCard>
  );
}

type E2EEWarningModalProps = E2EEWarningCardProps & {
  open: boolean;
};

function E2EEWarningModal({ open, ...cardProps }: E2EEWarningModalProps) {
  return (
    <Modal open={open} locked hideCloseButton>
      <E2EEWarningCard {...cardProps} />
    </Modal>
  );
}

export default E2EEWarningModal;
