import {
  Card,
  CardHeader,
  CardSizes,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { DynamicPublicMailingListsSettings } from '../blocks/MailingLists/MailingLists';

const EmailPreferences = () => {
  const { t } = useTranslation();

  return (
    <Card width={CardSizes.Medium}>
      <CardHeader>{t('mailing_lists.title')}</CardHeader>
      <DynamicPublicMailingListsSettings />
    </Card>
  );
};

export default EmailPreferences;
