import styled from 'styled-components';

const UnreadIndicator = styled.span`
  border-radius: 50%;
  height: 10px;
  width: 10px;
  background: ${({ theme }) => theme.color.gradient.orange10};
`;

export default UnreadIndicator;
