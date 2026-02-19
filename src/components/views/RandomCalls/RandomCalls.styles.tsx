import {
  Accordion,
  AccordionContent,
  Button,
} from '@a-little-world/little-world-design-system';
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
    @media (min-width: ${theme.breakpoints.large}) {
      padding: 0;
      max-width: 1200px;
      flex-direction: row;
    }
  `}
`;

export const InfoPanel = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: ${({ theme }) => theme.radius.small};
  padding: ${({ theme }) => theme.spacing.small};
  width: 100%;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      flex-direction: row;
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

export const ActiveUsers = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
`;

export const Schedule = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const ScheduleHeading = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

export const ScheduleList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
`;

export const InfoImage = styled.img`
  width: 100%;
  height: 100%;
  max-width: 400px;
  object-fit: cover;
`;

export const JoinButton = styled(Button)`
  align-self: flex-start;
`;

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const CallHistoryDesktop = styled(CallHistory)`
  display: none;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      display: flex;
    }
  `}
`;

export const RandomCallsInstructions = styled(Instructions)`
  display: none;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      display: block;
    }
  `}
`;

export const RandomCallsAccordion = styled(Accordion)`
  display: block;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      display: none;
    }
  `}
`;

export const RandomCallsAccordionContentWrapper = styled(AccordionContent)`
  background-color: ${({ theme }) => theme.color.surface.primary};
  padding: 0;
  gap: 0;
`;
