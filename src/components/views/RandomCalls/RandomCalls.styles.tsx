import { Accordion } from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

import CallHistory from '../../blocks/CallHistory/CallHistory';
import Instructions from '../../blocks/Instructions/Instructions';

export const Container = styled.div`
  display: flex;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small};
  flex-direction: column;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: 0;
      max-width: 1200px;
      flex-direction: row;
    }
  `}
`;

export const InfoPanel = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: ${({ theme }) => theme.radius.small};
  padding: ${({ theme }) => theme.spacing.small};
  width: 100%;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      width: unset;
      flex-shrink: 1;
      border-radius: ${theme.radius.medium};
      padding: ${theme.spacing.small};
    }
  `}
`;

export const InfoPanelText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small};
`;

export const Schedule = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const InfoImage = styled.img`
  width: 100%;
  height: 100%;
  max-width: 400px;
  object-fit: cover;
`;

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const CallHistoryDesktop = styled(CallHistory)`
  display: none;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      display: flex;
    }
  `}
`;

export const RandomCallsInstructions = styled(Instructions)`
  display: none;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      display: block;
    }
  `}
`;

export const RandomCallsAccordion = styled(Accordion)`
  display: block;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      display: none;
    }
  `}
`;
