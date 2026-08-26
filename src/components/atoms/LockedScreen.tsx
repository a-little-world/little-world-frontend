import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const LockedContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  min-height: 60vh;
  height: 100%;
  width: 100%;
  flex: 1;
  padding: 24px;
  text-align: center;
`;

const Title = styled.h2`
  margin: 0;
`;

const Body = styled.p`
  margin: 0;
  opacity: 0.7;
`;

/**
 * Shown when the app is only on screen because a call arrived on a locked phone
 * and the user navigated outside the call. Unlocking the device lifts the
 * restriction - native clears the flag as soon as the keyguard is gone.
 */
const LockedScreen = () => {
  const { t } = useTranslation();

  return (
    <LockedContainer>
      <Title>{t('locked_session.title')}</Title>
      <Body>{t('locked_session.body')}</Body>
    </LockedContainer>
  );
};

export default LockedScreen;
