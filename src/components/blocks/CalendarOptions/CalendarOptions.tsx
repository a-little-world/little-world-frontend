import { ComponentType } from 'react';

import { ChevronRightIcon } from '@a-little-world/little-world-design-system';
import { useTheme } from 'styled-components';

import {
  CalendarChevron,
  CalendarList,
  CalendarOption,
  CalendarOptionCopy,
  CalendarOptionSize,
  CalendarOptionSubtitle,
  CalendarOptionTitle,
} from './CalendarOptions.styles';

export type { CalendarOptionSize };

type CalendarIcon = ComponentType<{
  label: string;
  width: number;
  height?: number;
  color: string;
}>;

export type CalendarOptionItem = {
  key: string;
  title: string;
  subtitle?: string;
  Icon: CalendarIcon;
  onClick: () => void;
};

type CalendarOptionsProps = {
  options: CalendarOptionItem[];
  /** Compact rows drop the subtitle and use tighter padding. */
  size?: CalendarOptionSize;
  openLabel?: string;
};

const CalendarOptions = ({
  options,
  size = 'regular',
  openLabel = '',
}: CalendarOptionsProps) => {
  const theme = useTheme();
  const iconSize = size === 'compact' ? 20 : 24;

  return (
    <CalendarList>
      {options.map(({ key, title, subtitle, Icon, onClick }) => (
        <CalendarOption key={key} type="button" $size={size} onClick={onClick}>
          <Icon
            label=""
            width={iconSize}
            color={theme.color.text.primary}
          />
          <CalendarOptionCopy>
            <CalendarOptionTitle>{title}</CalendarOptionTitle>
            {size === 'regular' && subtitle ? (
              <CalendarOptionSubtitle>{subtitle}</CalendarOptionSubtitle>
            ) : null}
          </CalendarOptionCopy>
          <CalendarChevron>
            <ChevronRightIcon label={openLabel} width={16} height={16} />
          </CalendarChevron>
        </CalendarOption>
      ))}
    </CalendarList>
  );
};

export default CalendarOptions;
