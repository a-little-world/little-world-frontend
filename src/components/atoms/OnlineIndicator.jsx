import { Text, TextTypes } from '@a-little-world/little-world-design-system';
import React from 'react';
import styled from 'styled-components';

const Indicator = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.color.text.highlight};
  background-color: ${({ theme }) => theme.color.surface.primary};
  border-radius: 100px;
  padding: ${({ theme }) =>
    `${theme.spacing.xxxsmall} ${theme.spacing.xxsmall}`};
  gap: ${({ theme }) => theme.spacing.xxxsmall};
  position: absolute;
  left: ${({ theme }) => theme.spacing.medium};
  top: ${({ theme }) => theme.spacing.medium};
  pointer-events: none;
  opacity: ${({ $online }) => ($online ? 1 : 0)};
  transition: opacity 1s;
  box-shadow: 0px 1px 6px 4px rgb(0 0 0 / 7%);
`;

const Light = styled.span`
  background-color: ${({ theme }) => theme.color.status.success};
  height: 9px;
  width: 9px;
  border-radius: 100%;
  margin-top: 2px;
`;

const OnlineIndicator = ({ isOnline }) => (
  <Indicator $online={isOnline}>
    <Text tag="span" type={TextTypes.Body6}>
      Online
    </Text>
    <Light />
  </Indicator>
);

export default OnlineIndicator;
