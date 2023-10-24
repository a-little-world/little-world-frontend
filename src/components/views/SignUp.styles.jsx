import { Button, Card, Text } from "@a-little-world/little-world-design-system";
import styled from "styled-components";

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
  align-items: flex-start;
  flex-grow: 1;
`;

export const StyledCard = styled(Card)`
  position: relative;
  max-width: 500px;
  margin: 0 auto;
`;

export const StyledCta = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

export const Title = styled(Text)`
  text-align: center;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

export const NameContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

export const NameInputs = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

export const ChangeLocation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.xxsmall};

  a {
    border: none;
  }
`;
