import { Text } from "@a-little-world/little-world-design-system";
import styled from "styled-components";

import { StyledCard } from "../Form/styles";

export const WelcomeCard = styled(StyledCard)`
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.large};
  padding-bottom: ${({ theme }) => theme.spacing.large};
`;

export const IntroText = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

export const NoteText = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;
