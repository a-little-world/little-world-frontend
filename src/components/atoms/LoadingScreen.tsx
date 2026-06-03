import {
  Loading,
  LoadingSizes,
  LoadingType,
} from '@a-little-world/little-world-design-system';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  height: 100%;
  width: 100%;
  flex: 1;
`;

const LoadingScreen = () => (
  <LoadingContainer>
    <Loading type={LoadingType.Logo} size={LoadingSizes.XLarge} />
  </LoadingContainer>
);

export default LoadingScreen;
