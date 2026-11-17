import { useTranslation } from 'react-i18next';

import {
  GuestAvatar,
  GuestChip,
  GuestName,
  PartnerPill,
} from './ExternalRandomCallsPortal.styles';

const guestInitial = (firstName: string) => {
  const letter = firstName.trim().charAt(0);
  return letter ? letter.toLocaleUpperCase('de-DE') : 'G';
};

const GuestChrome = ({
  partnerName,
  firstName,
}: {
  partnerName: string | null;
  firstName: string;
}) => {
  const { t } = useTranslation();
  const label = firstName
    ? t('external_random_calls.guest_named', { name: firstName })
    : t('external_random_calls.guest_anonymous');

  return (
    <>
      {partnerName ? (
        <PartnerPill>
          {t('external_random_calls.partner_pill', { partner: partnerName })}
        </PartnerPill>
      ) : null}
      <GuestChip>
        <GuestAvatar aria-hidden="true">{guestInitial(firstName)}</GuestAvatar>
        <GuestName>{label}</GuestName>
      </GuestChip>
    </>
  );
};

export default GuestChrome;
