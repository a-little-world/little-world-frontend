import { Tag, TagSizes } from '@a-little-world/little-world-design-system';
import styled, { useTheme } from 'styled-components';

import { TagText } from './SupportTag';

const TeamMemberTagWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

/** Shown on the profile of someone who can open the management panel. */
const TeamMemberTag = () => {
  const theme = useTheme();

  return (
    <TeamMemberTagWrapper>
      <Tag color={theme.color.status.info} bold size={TagSizes.small}>
        <TagText>team-member</TagText>
      </Tag>
    </TeamMemberTagWrapper>
  );
};

export default TeamMemberTag;
