import {
  GroupChatIcon,
  Tooltip,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import useSupportChat from '../../hooks/useSupportChat';

const FloatingSupportButton = styled.button`
  position: fixed;
  right: ${({ theme }) => theme.spacing.medium};
  bottom: ${({ theme }) => theme.spacing.medium};
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.color.gradient.blue10};
  color: ${({ theme }) => theme.color.text.button};
  box-shadow: 0 8px 20px rgb(0 0 0 / 20%);
  z-index: 1000;
  transition: transform 160ms ease, filter 160ms ease;
  border: none;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(0.96);
  }
`;

function SupportWidget() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { supportUrl } = useSupportChat();

  if (!supportUrl) return null;

  const supportLabel = t('help.support_widget_tooltip');
  const handleSupportClick = () => {
    navigate(supportUrl);
  };

  return (
    <Tooltip
      text={supportLabel}
      trigger={
        <FloatingSupportButton
          type="button"
          aria-label={supportLabel}
          onClick={handleSupportClick}
        >
          <GroupChatIcon label={supportLabel} width={22} height={22} />
        </FloatingSupportButton>
      }
    />
  );
}

export default SupportWidget;
