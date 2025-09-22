import {
  ButtonAppearance,
  Gradients,
  OPTION_BUTTON_CSS,
  Text,
} from '@a-little-world/little-world-design-system';
import { isNumber } from 'lodash';
import { ComponentType } from 'react';
import { Link } from 'react-router-dom';
import styled, { css, useTheme } from 'styled-components';
import UnreadDot from './UnreadDot';

const MENU_LINK_CSS = css<{ $appearance?: ButtonAppearance; $order?: number }>`
  ${OPTION_BUTTON_CSS}
  position: relative;
  flex-shrink: 0;

  transition: background-color 0.5s ease, filter 0.5s ease,
    border-color 0.5s ease, color 0.5s ease, 0.4s;

  ${({ $order }) =>
    isNumber($order) &&
    css`
      order: ${$order};
    `};

  &:hover {
    filter: brightness(95%);
    cursor: pointer;
    box-shadow: 0 0 10px 1px rgb(0 0 0 / 11%),
      0 0 8px 3px rgb(255 255 255 / 15%);
  }
`;

const StyledMenuLink = styled(Link)<{
  $appearance?: ButtonAppearance;
  $order?: number;
}>`
  ${MENU_LINK_CSS}
`;

export const DisabledMenuLink = styled.div<{ $order?: number }>`
  ${MENU_LINK_CSS}

  background-color: ${({ theme }) => theme.color.surface.disabled};
  color: ${({ theme }) => theme.color.text.disabled};
  cursor: not-allowed;

  &:hover,
  &:not(:disabled):hover {
    filter: none;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export const MenuLinkText = styled(Text)`
  line-height: 1.2;
`;

const MenuLink = ({
  active,
  disabled,
  Icon,
  iconGradient = Gradients.Blue,
  iconLabel,
  order,
  state,
  text,
  to,
  unreadCount,
}: {
  active?: boolean;
  disabled?: boolean;
  Icon: ComponentType<any>;
  iconGradient?: Gradients;
  iconLabel: string;
  order?: number;
  state?: any;
  text?: string;
  to?: string;
  unreadCount?: number;
}) => {
  const theme = useTheme();
  if (disabled || !to)
    return (
      <DisabledMenuLink $order={order}>
        <Icon
          color={theme.color.text.disabled}
          label={iconLabel}
          width={32}
          height={32}
        />
        {text && <MenuLinkText>{text}</MenuLinkText>}
      </DisabledMenuLink>
    );
  return (
    <StyledMenuLink
      to={to}
      state={state}
      $appearance={
        active ? ButtonAppearance.Secondary : ButtonAppearance.Primary
      }
      $order={order}
    >
      {!!unreadCount && <UnreadDot count={unreadCount} />}
      <Icon
        {...(active
          ? { color: theme.color.surface.primary }
          : { gradient: iconGradient })}
        label={iconLabel}
        width={32}
        height={32}
      />
      {text && <MenuLinkText tag="span">{text}</MenuLinkText>}
    </StyledMenuLink>
  );
};

export default MenuLink;
