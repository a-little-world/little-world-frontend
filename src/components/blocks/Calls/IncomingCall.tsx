import {
  Button,
  ButtonAppearance,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ButtonsContainer from '../../atoms/ButtonsContainer.jsx';
import ProfileImage from '../../atoms/ProfileImage.jsx';
import ModalCard, { Centred } from '../Cards/ModalCard.jsx';

type IncomingCallProps = {
  userProfile: any;
  onAnswerCall: () => void;
  onRejectCall: () => void;
};

function IncomingCall({
  userProfile = {},
  onAnswerCall,
  onRejectCall,
}: IncomingCallProps) {
  const { t } = useTranslation();

  const usesAvatar = userProfile.image_type === 'avatar';

  return (
    <ModalCard>
      <Centred>
        <ProfileImage
          image={usesAvatar ? userProfile.avatar_config : userProfile.image}
          imageType={userProfile.image_type}
        />
        <Text tag="h3" type={TextTypes.Heading4}>
          {`${userProfile.first_name} ${t('pcs_waiting')}`}
        </Text>
      </Centred>
      <ButtonsContainer>
        <Button appearance={ButtonAppearance.Secondary} onClick={onRejectCall}>
          {t('pcs_btn_reject_call')}
        </Button>
        <Button onClick={onAnswerCall}>{t('pcs_btn_join_call')}</Button>
      </ButtonsContainer>
    </ModalCard>
  );
}

export default IncomingCall;
