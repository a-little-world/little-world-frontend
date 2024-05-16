import {
  Button,
  ButtonVariations,
  MoonIcon,
  SunIcon,
  ThemeVariants,
  themeContext,
} from '@a-little-world/little-world-design-system';
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';

const Switch = styled(Button)`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.large};
  right: ${({ theme }) => theme.spacing.large};
`;
export const ModeSwitch = () => {
  const location = useLocation();
  const theme = useTheme();
  const { currentMode, toggleMode } = useContext(themeContext);
  const isDarkMode = currentMode === ThemeVariants.dark;
  if (!location.search.includes('dark_mode_feature=on')) return null;
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
        <SunIcon label="turn dark mode on" labelId={'dark_mode_on_switch'} />
      ) : (
        <MoonIcon
          label="turn light mode on"
          labelId={'light_mode_on_switch'}
          color={theme.color.text.highlight}
        />
      )}
    </Switch>
  );
};
