import { Text } from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

export const Events = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  flex: 1 1 0;
  max-width: 1200px;
  padding: 0 ${({ theme }) => theme.spacing.small};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      padding: ${theme.spacing.small};
    }
  `}
`;

export const EventContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  box-shadow: 1px 2px 5px rgb(0 0 0 / 7%);
  background: ${({ theme }) => theme.color.surface.primary};
  display: flex;
  flex-direction: column;

  ${({ theme }) => `
    border-radius: ${theme.spacing.large};
    padding: ${theme.spacing.small};
    gap: ${theme.spacing.small};

    @media (min-width: ${theme.breakpoints.large}) {
       flex-direction: row;
    }
  `}
`;

export const ImageContainer = styled.div`
  position: relative;
  min-width: 120px;
  width: 100%;
  max-height: 216px;
  border-radius: ${({ theme }) => theme.radius.medium};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;

  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    width: 40%;
    max-height: unset;
  }
`;

export const EventImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

export const FrequencyTitle = styled(Text)`
  background: ${({ theme }) => theme.color.surface.primary};
  border-radius: 100px;
  position: absolute;
  bottom: 0;
  text-transform: capitalize;

  ${({ theme }) => `
    border-radius: ${theme.spacing.xxxlarge};
    padding: ${theme.spacing.xxxsmall} ${theme.spacing.xsmall};
    margin: ${theme.spacing.xsmall};
  `}
`;

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
  ${({ theme }) => `
    gap: ${theme.spacing.small};
  `}
`;

export const EventInfo = styled.div``;

export const EventTitle = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
`;

export const DateTimeEvent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const SessionFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.xsmall};
  justify-self: flex-end;
`;

export const Buttons = styled.div`
  display: flex;
  margin-top: auto;
  align-items: center;

  ${({ theme }) => `
    gap: ${theme.spacing.xsmall};

    > button {
      gap: ${theme.spacing.xxsmall};
    }
  `}
`;

export const Sessions = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xsmall};

  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    max-width: 360px;
  }
`;

export const Session = styled.div`
  display: grid;
  grid-template-columns: 104px auto auto;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  align-items: center;
  width: 100%;
`;
