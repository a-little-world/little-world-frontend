import styled, { css } from "styled-components";

import LogoImageSvg from "../../images/logo-image.svg";
import LogoTextSvg from "../../images/logo-text.svg";

/* <div className="logos">
  <img alt="little" className="logo-image" />
  <img alt="little world" className="logo-text" />
</div>; */

const LogoSizes = {
  Small: "small",
  Medium: "medium",
};

const LogoContainer = styled.div`
  display: flex;
  flex-direction: ${({ $stacked }) => ($stacked ? "column" : "row")};
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxxsmall};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.small}) {
      /* match logos-small rules */
    }
  `}
`;

const LogoImage = styled.img`
  max-width: 100%;
  width: ${({ $size }) => ($size === LogoSizes.Small ? "30px" : "70px")};
`;

const LogoText = styled.img`
  max-width: 100%;
  width: ${({ $size }) => ($size === LogoSizes.Small ? "30px" : "70px")};
`;

const Logo = ({ displayText = true, stacked = true, size = LogoSizes.Medium }) => {
  return (
    <LogoContainer $stacked={stacked}>
      <LogoImage src={LogoImageSvg} alt="Little World Logo" $size={size} />
      {displayText && <LogoText src={LogoTextSvg} alt="Little World" $size={size} />}
    </LogoContainer>
  );
};

export default Logo;
