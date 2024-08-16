import {
  FriendshipImage,
  Text,
} from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

import { StyledCard } from '../Form/styles';

export const WelcomeCard = styled(StyledCard)`
  align-items: center;
  justify-content: center;
  padding-top: ${({ theme }) => theme.spacing.large};
  padding-bottom: ${({ theme }) => theme.spacing.large};

  > svg {
    ${({ theme }) => css`
      margin-bottom: ${theme.spacing.small};
      width: 200px;

      @media (min-width: ${theme.breakpoints.large}) {
        width: 240px;
        margin-bottom: 0;
      }
    `};
  }
`;

export const WelcomeIllustration = styled(FriendshipImage)``;

export const IntroText = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.small};
  max-width: 500px;
`;

export const NoteText = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;
