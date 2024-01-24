import {
  InfoIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import styled from 'styled-components';

const StyledNote = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${({ $center }) => ($center ? 'center' : 'flex-start')};
  gap: ${({ theme }) => theme.spacing.xxsmall};
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
`;

const Note = ({ children, center = true }) => {
  return (
    <StyledNote $center={center}>
      <InfoIcon
        height="16px"
        width="16px"
        color="#36A9E0"
        label="info icon"
        labelId="info icon"
      />
      <Text type={TextTypes.Body6} color="#A6A6A6">
        {children}
      </Text>
    </StyledNote>
  );
};

export default Note;
