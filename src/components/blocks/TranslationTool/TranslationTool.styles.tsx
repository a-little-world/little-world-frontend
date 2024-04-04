import { Button } from '@a-little-world/little-world-design-system';
import styled from 'styled-components';

export const ToolContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  align-items: flex-start;
  width: 100%;
`;

export const SwapBtn = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.xxsmall};
`;

export const OriginalLanguage = styled.div`
  flex: 1;
`;
export const DesiredLanguage = styled.div`
  flex: 1;
`;
