import { Text, TextTypes } from '@a-little-world/little-world-design-system';
import React from 'react';
import styled from 'styled-components';

export interface StatInlineProps {
  value: string | number;
  label: string;
  className?: string;
}

const Wrap = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
  white-space: nowrap;
`;

const Value = styled(Text)`
  color: ${({ theme }) => theme.color.text.heading};
  font-weight: 700;
`;

const Label = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
`;

function StatInline({ value, label, className }: StatInlineProps) {
  return (
    <Wrap className={className}>
      <Value type={TextTypes.Body4} tag="span">
        {value}
      </Value>
      <Label type={TextTypes.Body6} tag="span">
        {label}
      </Label>
    </Wrap>
  );
}

export default StatInline;
