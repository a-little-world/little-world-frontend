import { Text } from '@a-little-world/little-world-design-system';
import styled from 'styled-components';

export const ImageContainer = styled.div`
  position: relative;
  min-width: 120px;
  width: 100%;
  max-height: 216px;
  border-radius: ${({ theme }) => theme.radius.medium};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;

  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    width: 40%;
    max-height: unset;
  }
`;

export const Image = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

export const ImageLabel = styled(Text)`
  background: ${({ theme }) => theme.color.surface.primary};
  border-radius: 100px;
  position: absolute;
  bottom: 0;

  ${({ theme }) => `
    border-radius: ${theme.spacing.xxxlarge};
    padding: ${theme.spacing.xxxsmall} ${theme.spacing.xsmall};
    margin: ${theme.spacing.xsmall};
  `}
`;

const PanelImage = ({
  src,
  label,
  alt,
}: {
  src: string;
  label: string;
  alt: string;
}) => (
  <ImageContainer>
    <Image alt={alt || ''} src={src} />
    <ImageLabel>{label}</ImageLabel>
  </ImageContainer>
);

export default PanelImage;
