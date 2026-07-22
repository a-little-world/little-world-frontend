import {
  Card,
  CardDimensions,
  CardSizes,
  pixelate,
  Text,
} from '@a-little-world/little-world-design-system';
import styled from 'styled-components';

export const ContactUsContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;

  ${({ theme }) => `
    padding: ${theme.spacing.small};
    gap: ${theme.spacing.medium};

    @media (min-width: ${theme.breakpoints.large}) {
      justify-content: flex-start;
      flex-wrap: nowrap;
      padding: 0;
  }`}
`;

export const FAQsContainer = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  width: 100%;
`;

export const SupportCard = styled(Card)`
  display: none;
  flex-direction: column;
  align-items: center;
  height: fit-content;
  width: 100%;
  max-width: ${pixelate(CardDimensions[CardSizes.Medium])};

  ${({ theme }) => `
    padding: ${theme.spacing.medium} ${theme.spacing.small};
    @media (min-width: ${theme.breakpoints.large}) {
      display: flex;
      padding: ${theme.spacing.large};
      width: unset;
      max-width: unset;
    }`}
`;

export const SupportChatWrapper = styled.div`
  display: flex;
  height: 100%;
  flex: 1;
`;

export const Topper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto ${({ theme }) => theme.spacing.medium};
`;

export const SupportTeam = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    margin: 0;
  }
`;

export const ContactButtons = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;

  ${({ theme }) => `
    gap: ${theme.spacing.small};
    padding: 0 ${theme.spacing.xxxsmall} ${theme.spacing.medium};

    @media (min-width: ${theme.breakpoints.small}) {
      gap: ${theme.spacing.small};
      padding: 0 ${theme.spacing.xxxsmall} ${theme.spacing.medium};
    }`}
`;

export const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(230, 232, 236, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: ${({ theme }) => `${theme.spacing.xxsmall} `};
  width: 100%;
  justify-content: space-between;

  ${({ theme }) => `
    padding: ${theme.spacing.small};
    gap: ${theme.spacing.xsmall};
  `}
`;
export const Contacts = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
  white-space: nowrap;
`;

export const BusinessName = styled(Text)``;

export const ContentWrapper = styled.div``;

export const ContactLink = styled.a`
  display: flex;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  align-items: center;
  justify-content: center;
  width: 100%;
`;
