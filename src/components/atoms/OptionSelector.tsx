import { Button, ButtonVariations } from '@a-little-world/little-world-design-system';
import React from 'react';
import styled, { css } from 'styled-components';

export interface OptionSelectorOption<T = string | number> {
  value: T;
  label: string;
  ariaLabel?: string;
}

const Selector = styled.div`
  display: flex;
  align-items: center;
`;

const OptionButton = styled(Button)<{ $active: boolean }>`
  font-weight: bold;
  border: none;
  font-size: 0.875rem;
  line-height: 1rem;
  background: ${({ theme }) => theme.color.surface.disabled};
  color: ${({ theme }) => theme.color.border.moderate};
  cursor: pointer;
  text-transform: uppercase;
  padding: ${({ theme }) => theme.spacing.xxsmall};

  ${({ theme, $active }) =>
    $active &&
    css`
      background: ${theme.color.surface.primary} !important;
      color: ${theme.color.text.highlight} !important;
    `}
`;

export interface OptionSelectorProps<T = string | number> {
  options: OptionSelectorOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabelPrefix?: string;
}

function OptionSelector<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabelPrefix,
}: OptionSelectorProps<T>) {
  return (
    <Selector role="group">
      {options.map(option => {
        const isActive = option.value === value;
        const ariaLabel =
          option.ariaLabel ??
          (ariaLabelPrefix ? `${ariaLabelPrefix} ${option.label}` : undefined);
        return (
          <OptionButton
            key={String(option.value)}
            type="button"
            variation={ButtonVariations.Inline}
            $active={isActive}
            disabled={isActive}
            aria-label={ariaLabel}
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </OptionButton>
        );
      })}
    </Selector>
  );
}

export default OptionSelector;
