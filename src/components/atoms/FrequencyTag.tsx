import {
  Tag,
  TagAppearance,
  TagSizes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StyledTag = styled(Tag)<{ $margin?: string }>`
  border: 1px solid ${({ theme }) => theme.color.text.primary};
  color: ${({ theme }) => theme.color.text.primary};
  filter: none;
  ${({ $margin }) => $margin && `margin: ${$margin};`}
`;

/** How often a session happens, e.g. "Weekly" or "One-off". Renders nothing without one. */
function FrequencyTag({
  frequency,
  margin,
  className,
}: {
  frequency?: string;
  margin?: string;
  className?: string;
}) {
  const { t } = useTranslation();
  if (!frequency) return null;

  return (
    <StyledTag
      className={className}
      size={TagSizes.small}
      appearance={TagAppearance.outline}
      $margin={margin}
    >
      {t(`community_events.frequency_${frequency}`)}
    </StyledTag>
  );
}

export default FrequencyTag;
