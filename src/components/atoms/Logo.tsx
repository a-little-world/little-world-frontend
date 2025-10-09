import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { environment } from '../../environment';
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

// Styled components for both approaches
const LogoImageStyled = styled.div<{ $size: SizesType }>`
  max-width: 100%;
  width: ${({ $size }) => ($size === LogoSizes.Small ? '30px' : '70px')};
`;

const LogoTextStyled = styled.div<{ $size: SizesType }>`
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
}: LogoProps) => {
  const renderLogoImage = () => {
    if (!displayImage) return null;

    return (
      <LogoImageStyled $size={size}>
        {environment.isNative ? (
          // For native builds, use SVG as React component
          <LogoImageSvg role="img">
            <title>Little World Logo</title>
          </LogoImageSvg>
        ) : (
          // For web builds, use SVG as src URL (webpack will handle the bundling)
          <img
            src={LogoImageSvg}
            alt="Little World Logo"
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </LogoImageStyled>
    );
  };

  const renderLogoText = () => {
    if (!displayText) return null;
    return (
      <LogoTextStyled $size={size}>
        {environment.isNative ? (
          // For native builds, use SVG as React component
          <LogoTextSvg role="img">
            <title>Little World Logo</title>
          </LogoTextSvg>
        ) : (
          // For web builds, use SVG as src URL (webpack will handle the bundling)
          <img
            src={LogoTextSvg}
            alt="Little World"
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </LogoTextStyled>
    );
  };

  return (
    <Wrapper asLink={asLink}>
      <LogoContainer className={className} $stacked={stacked}>
        {renderLogoImage()}
        {renderLogoText()}
      </LogoContainer>
    </Wrapper>
  );
};

export default Logo;
