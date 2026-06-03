import {
  StatusMessage,
  StatusTypes,
} from '@a-little-world/little-world-design-system';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const FirefoxConnectionWarning = () => {
  const { t } = useTranslation();

  const isFirefox = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return /firefox/i.test(navigator.userAgent);
  }, []);

  if (!isFirefox) return null;

  return (
    <StatusMessage type={StatusTypes.Warning} visible withBorder>
      {t('video_call.firefox_warning')}
    </StatusMessage>
  );
};

export default FirefoxConnectionWarning;
