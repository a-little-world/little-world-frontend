import { Text, TextTypes } from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

const sidePadding = css`
  padding-left: ${({ theme }) => theme.spacing.medium};
  padding-right: ${({ theme }) => theme.spacing.medium};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding-left: ${theme.spacing.xxxlarge};
      padding-right: ${theme.spacing.xxxlarge};
    }

    @media (min-width: ${theme.breakpoints.large}) {
      padding-left: ${theme.spacing.massive};
      padding-right: ${theme.spacing.massive};
    }
  `}
`;

export const FooterRoot = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.small};
  margin-top: auto;
  padding-top: ${({ theme }) =>
    `calc(${theme.spacing.medium} + ${theme.spacing.xxxsmall})`};
  padding-bottom: ${({ theme }) =>
    `calc(${theme.spacing.medium} + ${theme.spacing.xxxsmall})`};
  ${sidePadding}
  background: ${({ theme }) => theme.color.surface.primary};
  border-top: ${({ theme }) => theme.spacing.xxxxsmall} solid
    ${({ theme }) => theme.color.border.subtle};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding-top: ${theme.spacing.medium};
      padding-bottom: ${theme.spacing.medium};
    }
  `}
`;

export const FooterBrand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.small};

  img {
    height: ${({ theme }) => theme.spacing.large};
    width: auto;
  }

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
    }
  `}
`;

export const FooterLogoLink = styled.a`
  display: flex;
  align-items: center;
  min-width: fit-content;
  color: inherit;
  text-decoration: none;
`;

export const FooterCopy = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'p' as const,
})`
  margin: 0;
  color: ${({ theme }) => theme.color.text.tertiary};
`;

export const FooterLinks = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.medium};
`;
