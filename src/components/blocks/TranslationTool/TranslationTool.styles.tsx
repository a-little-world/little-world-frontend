import styled from 'styled-components';

export const ToolContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: flex-start;
`;

export const OriginalLanguage = styled.div`
  flex: 1;
`;
export const DesiredLanguage = styled.div`
  flex: 1;
`;
