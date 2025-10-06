import {
  Button,
  ButtonVariations,
  Label,
  MoonIcon,
  SunIcon,
  ThemeVariants,
  themeContext,
} from '@a-little-world/little-world-design-system';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

import { STORAGE_KEYS } from '../../constants/index';
import { setLocalStorageItem } from '../../helpers/localStorage';

const SwitchContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SwitchButton = styled(Button)<{ $withLabel?: boolean }>`
  ${({ $withLabel, theme }) =>
    !$withLabel &&
    `
    position: fixed;
    bottom: ${theme.spacing.large};
    right: ${theme.spacing.large};
  `}
`;

const ThemeSwitch = ({ withLabel = false }: { withLabel?: boolean }) => {
  const theme = useTheme();
  const { currentMode, toggleMode } = useContext(themeContext);
  const isDarkMode = currentMode === ThemeVariants.dark;
  const { t } = useTranslation();

  const shouldShowModeSwitch = withLabel;

  const onToggle = () => {
    const newMode = isDarkMode ? ThemeVariants.light : ThemeVariants.dark;

    setLocalStorageItem(STORAGE_KEYS.themePreference, newMode);

    toggleMode(); // update the theme in the design system
  };

  const switchButton = (
    <SwitchButton
      $withLabel={withLabel}
      backgroundColor={theme.color.surface.secondary}
      borderColor={theme.color.border.selected}
      variation={ButtonVariations.Circle}
      onClick={onToggle}
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
    </SwitchButton>
  );

  if (!shouldShowModeSwitch) {
    return null;
  }

  return withLabel ? (
    <SwitchContainer>
      <Label bold>
        {t('settings.theme_label')}{' '}
        {isDarkMode ? t('settings.theme_dark') : t('settings.theme_light')}
      </Label>
      {switchButton}
    </SwitchContainer>
  ) : (
    switchButton
  );
};

export default ThemeSwitch;
