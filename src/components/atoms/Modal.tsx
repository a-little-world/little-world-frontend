import { ComponentProps } from 'react';

import { Modal as DSModal } from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';

type ModalProps = ComponentProps<typeof DSModal>;

// The design-system Modal, with the dialog and its close button named in the
// user's language. Use this instead of importing Modal from the design system
// directly, and pass `label` (usually the card's visible title) so screen
// readers announce what opened; "Dialog" is only the fallback.
function Modal({ label, ...props }: ModalProps) {
  const { t } = useTranslation();

  return (
    <DSModal
      closeLabel={t('a11y.close_dialog')}
      label={label?.trim() ? label : t('a11y.dialog')}
      {...props}
    />
  );
}

export default Modal;
