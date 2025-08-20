import { OPTION_BUTTON_CSS } from '@a-little-world/little-world-design-system';
import styled from 'styled-components';

import Link from '../../path-prepend';

const MenuLink = styled(Link)`
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

export default MenuLink;
