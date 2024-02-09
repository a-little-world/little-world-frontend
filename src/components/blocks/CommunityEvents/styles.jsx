import { Text } from '@a-little-world/little-world-design-system';
import styled from 'styled-components';

export const Events = styled.div``;

export const Event = styled.div`
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  box-shadow: 1px 2px 5px rgb(0 0 0 / 7%);
  background: ${({ theme }) => theme.color.surface.primary};
  display: flex;
  flex-direction: column;

  ${({ theme }) => `
    border-radius: ${theme.spacing.large};
    padding: ${theme.spacing.small};
    gap: ${theme.spacing.small};

    @media (min-width: ${theme.breakpoints.small}) {
       flex-direction: row;
       max-height: 320px;
    }
  `}
`;

export const ImageContainer = styled.div`
  position: relative;
  min-width: 120px;
  width: 100%;
  max-height: 216px;

  @media (min-width: ${({ theme }) => theme.breakpoints.small}) {
    width: 40%;
    max-height: unset;
  }
`;

export const EventImage = styled.img`
  content: ${({ $content }) => $content || 'url(../../../images/coffee.webp)'};
  content: url(../../../images/coffee.webp);
  height: 100%;
  width: 100%;
  object-fit: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.small}) {
    object-fit: cover;
  }
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

export const DateTime = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  > p {
    color: ${({ theme }) => theme.color.text.heading};
  }
`;

export const Buttons = styled.div`
  display: flex;
  margin-top: auto;

  ${({ theme }) => `
    gap: ${theme.spacing.xsmall};

    > button {
      gap: ${theme.spacing.xxsmall};
    }
  `}
`;
