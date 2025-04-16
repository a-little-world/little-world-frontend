import { Button } from '@a-little-world/little-world-design-system';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { ContentListLayouts } from './ContentList.tsx';

export const ContentListContainer = styled.ul<{ $layout: ContentListLayouts }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
  flex-wrap: wrap;

  ${({ $layout }) =>
    $layout === ContentListLayouts.SideBySide &&
    css`
      flex-direction: column;
    `}
`;

export const ListItem = styled(Link)<{ $layout: ContentListLayouts }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: ${({ theme }) => theme.radius.xxsmall};
  padding: ${({ theme }) => theme.spacing.small};
  align-items: flex-start;
  justify-content: space-between;
  height: auto;
  cursor: pointer;
  text-decoration: none;
  overflow: hidden;
  max-width: 440px;

   ${({ theme }) =>
     css`
       @media (min-width: ${theme.breakpoints.small}) {
         padding: ${theme.spacing.medium};
       }
     `}

    ${({ theme, $layout }) =>
      $layout === ContentListLayouts.SideBySide &&
      css`
        max-width: 100%;
        justify-content: flex-start;
        @media (min-width: ${theme.breakpoints.small}) {
          flex-direction: row;
        }
      `}
  }}
`;

export const ImageWrapper = styled.div<{ $layout: ContentListLayouts }>`
  max-height: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 96px;
  max-width: min(80%, 280px);

  ${({ theme, $layout }) =>
    $layout === ContentListLayouts.Stacked &&
    css`
      width: 100%;
      @media (min-width: ${theme.breakpoints.small}) {
        height: 120px;
      }
    `}

  ${({ theme, $layout }) =>
    $layout === ContentListLayouts.SideBySide &&
    css`
      height: auto;
      flex-grow: 0;
      max-width: min(40%, 280px);
      border: 1px solid ${theme.color.border.minimal};
      border-radius: ${theme.radius.small};
    `}
`;

export const ItemImage = styled.img`
  height: 100%;
  max-height: 100%;
  width: 100%;
  object-fit: contain;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  flex: 1;

  > p:last-of-type {
    margin-bottom: ${({ theme }) => theme.spacing.small};
  }
`;

export const ListItemCta = styled(Button)`
  margin-top: auto;
  @media (min-width: ${({ theme }) => theme.breakpoints.small}) {
    align-self: flex-start;
  }
`;
