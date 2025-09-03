import {
  Button,
  ButtonVariations,
  MoonIcon,
  SunIcon,
  ThemeVariants,
  themeContext,
} from '@a-little-world/little-world-design-system';
import React, { useContext } from 'react';
import styled, { useTheme } from 'styled-components';

import useQueryParam from '../../hooks/useQueryParam';

const Switch = styled(Button)`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.large};
  right: ${({ theme }) => theme.spacing.large};
`;

export const ModeSwitch = () => {
  const theme = useTheme();
  const { currentMode, toggleMode } = useContext(themeContext);
  const isDarkMode = currentMode === ThemeVariants.dark;

  const modeSwitch = useQueryParam('modeSwitch');
  const shouldShowModeSwitch = modeSwitch === 'true';

  return shouldShowModeSwitch ? (
    <Switch
      backgroundColor={theme.color.surface.secondary}
      borderColor={theme.color.border.selected}
      variation={ButtonVariations.Circle}
      onClick={() => toggleMode()}
    >
      {isDarkMode ? (
        <SunIcon width="24" height="24" label="turn dark mode on" />
      ) : (
        <MoonIcon
          width="24"
          height="24"
          label="turn light mode on"
          color={theme.color.text.highlight}
        />
      )}
    </Switch>
  ) : null;
};

export default ModeSwitch;
