import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

import LogoImageSvg from '../../images/logo-image.svg';
import LogoTextSvg from '../../images/logo-text.svg';
import { getAppRoute } from '../../router/routes';

enum LogoSizes {
  Small = 'Small',
  Medium = 'Medium',
}

type SizesType = keyof typeof LogoSizes;

const LogoContainer = styled.div<{ $stacked?: boolean }>`
  display: flex;
  flex-direction: ${({ $stacked }) => ($stacked ? 'column' : 'row')};
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxxsmall};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.small}) {
      /* match logos-small rules */
    }
  `}
`;

const LogoImage = styled(LogoImageSvg)<{ $size: SizesType }>`
  max-width: 100%;
  width: ${({ $size }) => ($size === LogoSizes.Small ? '30px' : '70px')};
`;

export const LogoText = styled(LogoTextSvg)<{ $size: SizesType }>`
  max-width: 100%;
  width: ${({ $size }) => ($size === LogoSizes.Small ? '30px' : '80px')};
`;

const Wrapper = ({
  asLink,
  children,
}: {
  asLink?: boolean;
  children: React.ReactNode;
}) => (asLink ? <Link to={getAppRoute()}>{children}</Link> : children);

interface LogoProps {
  asLink?: boolean;
  className?: string;
  displayImage?: boolean;
  displayText?: boolean;
  stacked?: boolean;
  size?: SizesType;
}

const Logo = ({
  asLink,
  className,
  displayImage = true,
  displayText = true,
  stacked = true,
  size = LogoSizes.Medium,
}: LogoProps) => (
  <Wrapper asLink={asLink}>
    <LogoContainer className={className} $stacked={stacked}>
      {displayImage && <LogoImage $size={size} />}
      {displayText && <LogoText $size={size} />}
    </LogoContainer>
  </Wrapper>
);

export default Logo;
