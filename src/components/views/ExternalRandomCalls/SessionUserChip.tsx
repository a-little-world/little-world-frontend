import { ReactNode } from 'react';

import { ProfileIcon } from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import {
  PartnerPill,
  UserAvatar,
  UserChip,
  UserName,
} from './ExternalRandomCallsPortal.styles';

const initialOf = (firstName: string) =>
  firstName.trim().charAt(0).toLocaleUpperCase('de-DE');

type Props = {
  partnerName?: string | null;
  firstName: string;
  /** No full account: the chip says so. A signed-in user just sees their name. */
  isGuest: boolean;
};

/** Header end slot for the random-call pages: partner pill plus who is here. */
const SessionUserChip = ({ partnerName, firstName, isGuest }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const name = firstName.trim();
  // A guest without a name is still "G"; a signed-in user without one gets an
  // icon and no text, so the chip is always there.
  let avatar: ReactNode = initialOf(name) || (isGuest ? 'G' : null);
  if (!avatar) {
    avatar = (
      <ProfileIcon
        label=""
        width={14}
        height={14}
        color={theme.color.text.button}
      />
    );
  }
  let label = name;
  if (isGuest) {
    label = name
      ? t('external_random_calls.guest_named', { name })
      : t('external_random_calls.guest_anonymous');
  }

  return (
    <>
      {partnerName ? (
        <PartnerPill>
          {t('external_random_calls.partner_pill', { partner: partnerName })}
        </PartnerPill>
      ) : null}
      <UserChip $avatarOnly={!label}>
        <UserAvatar aria-hidden="true">{avatar}</UserAvatar>
        {label ? <UserName>{label}</UserName> : null}
      </UserChip>
    </>
  );
};

export default SessionUserChip;
