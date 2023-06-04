import { designTokens } from '@a-little-world/little-world-design-system';

const isDarkMode = false;

const theme = {
  ...designTokens,
  color: designTokens.color.theme[isDarkMode ? 'dark' : 'light'],
};

export default theme;
