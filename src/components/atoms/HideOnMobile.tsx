import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';

export const StyledHideOnMobile = styled.div`
  ${({ theme }) => css`
    @media (max-width: ${theme.breakpoints.medium}) {
      display: none;
    }
  `};
`;

function HideOnMobile({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <StyledHideOnMobile className={className}>{children}</StyledHideOnMobile>
  );
}

export default HideOnMobile;
