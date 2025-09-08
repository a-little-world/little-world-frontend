import { OPTION_BUTTON_CSS } from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

import Link from '../../path-prepend.jsx';

const MENU_LINK_CSS = css`
  ${OPTION_BUTTON_CSS}
  position: relative;
  flex-shrink: 0;

  transition: background-color 0.5s ease, filter 0.5s ease,
    border-color 0.5s ease, color 0.5s ease, 0.4s;

  &:hover {
    filter: brightness(95%);
    cursor: pointer;
    box-shadow: 0 0 10px 1px rgb(0 0 0 / 11%),
      0 0 8px 3px rgb(255 255 255 / 15%);
  }
`;

const MenuLink = styled(Link)`
  ${MENU_LINK_CSS}
`;

export const DisabledMenuLink = styled.div`
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

export default MenuLink;
