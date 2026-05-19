import {
  Logo,
  Tag,
  TagSizes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

export const TagText = styled.span`
  font-family: revert;
`;

const SupportTag = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Tag color={theme.color.status.info} bold size={TagSizes.small}>
      <TagText>{t('profile_card.support_user')}</TagText>
      <Logo height="16" width="16" label="support logo" />
    </Tag>
  );
};

export default SupportTag;
