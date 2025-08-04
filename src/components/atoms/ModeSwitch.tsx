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

const Switch = styled(Button)`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.large};
  right: ${({ theme }) => theme.spacing.large};
`;

export const ModeSwitch = () => {
  const theme = useTheme();
  const { currentMode, toggleMode } = useContext(themeContext);
  const isDarkMode = currentMode === ThemeVariants.dark;

  return (
    <Switch
      backgroundColor={theme.color.surface.secondary}
      borderColor={theme.color.border.selected}
      variation={ButtonVariations.Circle}
      onClick={() =>
        toggleMode(isDarkMode ? ThemeVariants.light : ThemeVariants.dark)
      }
    >
      {isDarkMode ? (
        <SunIcon
          width="24"
          height="24"
          label="turn dark mode on"
          labelId="dark_mode_on_switch"
        />
      ) : (
        <MoonIcon
          width="24"
          height="24"
          label="turn light mode on"
          labelId="light_mode_on_switch"
          color={theme.color.text.highlight}
        />
      )}
    </Switch>
  );
};

export default ModeSwitch;
