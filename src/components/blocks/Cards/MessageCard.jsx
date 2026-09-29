import React from 'react';

import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  Card,
  Link,
  Text,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { useInRouterContext } from 'react-router-dom';
import styled from 'styled-components';

import { getAppLinkProps } from '../../../helpers/links';
import ButtonsContainer from '../../atoms/ButtonsContainer';
import { ModalTitle } from './ModalCard';

const StyledCard = styled(Card)`
  text-align: center;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxlarge};
  gap: ${({ theme }) => theme.spacing.large};
  width: 100%;
  max-width: 800px;
  max-height: 320px;
  margin: 0 auto;
`;

const MessageCard = ({
  title,
  content,
  confirmText,
  rejectText,
  onConfirm,
  onReject,
  linkText,
  linkTo,
}) => {
  const { t } = useTranslation();
  const inRouter = useInRouterContext();

  return (
    <StyledCard>
      <ModalTitle>{t(title)}</ModalTitle>
      {content && <Text>{t(content)}</Text>}
      {(onConfirm || onReject) && (
        <ButtonsContainer>
          {onReject && (
            <Button
              size={ButtonSizes.Large}
              appearance={ButtonAppearance.Secondary}
              onClick={onReject}
            >
              {t(rejectText)}
            </Button>
          )}
          {onConfirm && (
            <Button size={ButtonSizes.Large} onClick={onConfirm}>
              {t(confirmText)}
            </Button>
          )}
        </ButtonsContainer>
      )}
      {linkTo && (
        <Link
          {...getAppLinkProps(linkTo, inRouter)}
          buttonAppearance={ButtonAppearance.Primary}
          buttonSize={ButtonSizes.Stretch}
        >
          {t(linkText)}
        </Link>
      )}
    </StyledCard>
  );
};

export default MessageCard;
