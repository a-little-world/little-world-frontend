import { Card, Text } from "@a-little-world/little-world-design-system";
import styled from "styled-components";

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: flex-start;
  flex-grow: 1;
  //   align-items:
`;

export const StyledCard = styled(Card)`
  position: relative;
  max-width: 500px;
  margin: 0 auto;
  //   min-height: 591px;
`;

export const SubmitError = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: ${({ theme }) => theme.spacing.large};
  padding: ${({ theme }) => theme.spacing.xxsmall};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: ${({ $visible }) => ($visible ? "opacity 1s" : "none")};
  text-align: center;

  background: ${({ theme }) => theme.color.surface.error};
  color: ${({ theme }) => theme.color.text.error};
`;

export const Title = styled(Text)`
  text-align: center;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;
