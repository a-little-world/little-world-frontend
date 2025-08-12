import {
  Card,
  CardDimensions,
  CardSizes,
  Text,
  pixelate,
} from '@a-little-world/little-world-design-system';
import styled from 'styled-components';

export const HelpContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;

  ${({ theme }) => `
    padding: ${theme.spacing.small};
    gap: ${theme.spacing.medium};

    @media (min-width: ${theme.breakpoints.large}) {
      justify-content: flex-start;
      flex-wrap: nowrap;
      padding: ${theme.spacing.xxsmall};
  }`}
`;

export const HelpPanel = styled(Card)`
  ${({ theme }) => `
  @media (min-width: ${theme.breakpoints.medium}) {
    max-width: ${pixelate(CardDimensions[CardSizes.Large])};
  }`}
`;

export const HelpSupport = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
  width: 100%;
  max-width: ${pixelate(CardDimensions[CardSizes.Medium])};

  ${({ theme }) => `
    padding: ${theme.spacing.medium} ${theme.spacing.small};
    @media (min-width: ${theme.breakpoints.large}) {
      padding: ${theme.spacing.large};
      width: unset;
      max-width: unset;
    }`}
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

export const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xsmall};
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
  margin-bottom: ${({ theme }) => theme.spacing.small};
  white-space: nowrap;
`;

export const BusinessName = styled(Text)``;

export const ContentWrapper = styled.div``;
export const DropZoneContainer = styled.div``;

export const ContactLink = styled.a`
  display: flex;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  align-items: center;
`;

export const FileName = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  color: ${({ theme }) => theme.color.text.accent};
`;

export const FileText = styled(Text)`
  color: ${({ theme }) => theme.color.text.accent};
  margin-top: ${({ theme }) => theme.spacing.xxxsmall};
`;

export const FAQContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const FAQImageWrapper = styled.div`
  width: 80%;
  max-width: 200px;
  margin: 0 auto;
`;

export const FAQItems = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

export const FAQSectionTitle = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xsmall};
`;

export const ContentTitle = styled(Text)`
  color: ${({ theme }) => theme.color.text.title};
  text-align: center;

  ${({ theme }) => `
  @media (min-width: ${theme.breakpoints.small}) {
    text-align: left;
  }`}
`;

export const StyledIntro = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
`;
