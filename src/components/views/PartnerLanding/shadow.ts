import { DefaultTheme } from 'styled-components';

export const softCardShadowValue = ({ theme }: { theme: DefaultTheme }) =>
  `0 ${theme.spacing.xxsmall} ${theme.spacing.medium} rgb(0 0 0 / 8%)`;

export const softAvatarShadowValue = ({ theme }: { theme: DefaultTheme }) =>
  `0 ${theme.spacing.xxxsmall} ${theme.spacing.xsmall} rgb(0 0 0 / 22%)`;
