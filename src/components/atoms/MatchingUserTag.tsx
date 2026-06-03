import { Tag, TagSizes } from '@a-little-world/little-world-design-system';
import styled, { useTheme } from 'styled-components';

import { TagText } from './SupportTag';

const MatchingUserTagWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const MatchingUserTag = () => {
  const theme = useTheme();

  return (
    <MatchingUserTagWrapper>
      <Tag color={theme.color.status.info} bold size={TagSizes.small}>
        <TagText>matching-user</TagText>
      </Tag>
    </MatchingUserTagWrapper>
  );
};

export default MatchingUserTag;
