import {
  ArchiveIcon,
  BellIcon,
  Button,
  ButtonAppearance,
  ButtonVariations, 
  ClockDashedIcon,
  ClockIcon,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import { NotificationState } from '../../api/notification';

export const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => `${theme.spacing.xxsmall} ${theme.spacing.small}`};
  width: 100%;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      width: unset;
      padding: 0 ${theme.spacing.xxsmall};
    }
  `}
`;

export const ToolbarButton = styled(Button)<{ $isActive: boolean }>`
  border-bottom: 2px solid
    ${({ theme, $isActive }) =>
      $isActive ? theme.color.border.highlight : theme.color.border.reversed};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.color.text.highlight : theme.color.text.primary};
  font-weight: bold;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  padding: ${({ theme }) => `${theme.spacing.xxsmall} 0`};
  flex: 1;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      gap: ${theme.spacing.xxxsmall};
      padding: ${theme.spacing.xxxsmall} 0;
    }
  `}
`;

interface ToolbarProps {
  onChangeFilter: (filter: NotificationState | 'all') => void;
  filter: NotificationState | 'all';
  showArchived?: boolean;
}

const Toolbar = ({
  onChangeFilter,
  filter,
  showArchived = true,
}: ToolbarProps) => {
  const { t } = useTranslation();

  return (
    <ToolbarContainer>
      <ToolbarButton
        onClick={() => onChangeFilter('all')}
        variation={ButtonVariations.Icon}
        $isActive={filter === 'all'}
      >
        <BellIcon label=" all notifications" width="16px" height="16px" />
        {t('notifications.filter_all')}
      </ToolbarButton>
      <ToolbarButton
        onClick={() => onChangeFilter(NotificationState.UNREAD)}
        appearance={ButtonAppearance.Secondary}
        variation={ButtonVariations.Icon}
        $isActive={filter === NotificationState.UNREAD}
      >
        <ClockIcon label="unread icon" width="16px" height="16px" />
        {t('notifications.filter_unread')}
      </ToolbarButton>
      <ToolbarButton
        onClick={() => onChangeFilter(NotificationState.READ)}
        appearance={ButtonAppearance.Secondary}
        variation={ButtonVariations.Icon}
        $isActive={filter === NotificationState.READ}
      >
        <ClockDashedIcon
          labelId="clock_icon"
          label="read icon"
          width="16px"
          height="16px"
        />
        {t('notifications.filter_read')}
      </ToolbarButton>
      {showArchived && (
        <ToolbarButton
          onClick={() => onChangeFilter(NotificationState.ARCHIVED)}
          variation={ButtonVariations.Icon}
          $isActive={filter === NotificationState.ARCHIVED}
        >
          <ArchiveIcon label="archive icon" width="16px" height="16px" />
          {t('notifications.archived')}
        </ToolbarButton>
      )}
    </ToolbarContainer>
  );
};

export default Toolbar;
