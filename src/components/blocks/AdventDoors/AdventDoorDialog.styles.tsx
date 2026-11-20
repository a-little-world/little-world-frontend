import { Text, TextTypes } from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

import { outlineWidth } from './AdventDoorPanel.styles';

export const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  max-width: 36rem;
  margin: auto;
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.radius.xlarge};
  background: ${({ theme }) => theme.color.surface.primary};
  box-shadow: ${({ theme }) =>
    `0 ${theme.spacing.xxsmall} ${theme.spacing.medium} rgb(0 0 0 / 8%)`};
  gap: ${({ theme }) => theme.spacing.medium};
  text-align: left;

  &:focus {
    outline: none;
  }
`;

export const DoorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const Badge = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.spacing.xxxlarge};
  aspect-ratio: 1;
  border-radius: ${({ theme }) =>
    `${theme.radius.massive} ${theme.radius.massive} ${theme.radius.xsmall} ${theme.radius.xsmall}`};
  background: ${({ theme }) => theme.color.text.heading};
  box-shadow: ${({ theme }) =>
    `inset 0 0 0 ${outlineWidth} ${theme.color.border.reversed}, 0 0 0 ${outlineWidth} ${theme.color.border.bold}`};
  color: ${({ theme }) => theme.color.text.button};
  font-family: 'Work Sans', sans-serif;
  font-weight: 700;
`;

export const HeaderCopy = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
`;

export const Kicker = styled(Text).attrs({ type: TextTypes.Body7, tag: 'p' })`
  margin: 0;
  color: ${({ theme }) => theme.color.text.heading};
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const When = styled(Text).attrs({ type: TextTypes.Body6, tag: 'p' })`
  margin: 0;
  color: ${({ theme }) => theme.color.text.tertiary};
`;

export const InfoBox = styled.div`
  display: flex;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.radius.small};
  background: ${({ theme }) => theme.color.surface.subtle};
  color: ${({ theme }) => theme.color.text.heading};
  gap: ${({ theme }) => theme.spacing.xsmall};
`;

export const CommitRow = styled.label`
  position: relative;
  display: flex;
  align-items: flex-start;
  margin: 0;
  padding: ${({ theme }) => `${theme.spacing.xsmall} ${theme.spacing.small}`};
  border: ${outlineWidth} solid ${({ theme }) => theme.color.border.subtle};
  border-radius: ${({ theme }) => theme.radius.small};
  cursor: pointer;
  gap: ${({ theme }) => theme.spacing.xsmall};

  &:hover {
    border-color: ${({ theme }) => theme.color.border.selected};
  }

  input {
    position: absolute;
    width: ${({ theme }) => theme.spacing.medium};
    height: ${({ theme }) => theme.spacing.medium};
    margin: 0;
    opacity: 0;
  }

  input:focus-visible + span {
    outline: ${outlineWidth} solid ${({ theme }) => theme.color.border.selected};
    outline-offset: ${({ theme }) => theme.spacing.xxxsmall};
  }
`;

export const Box = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.spacing.medium};
  height: ${({ theme }) => theme.spacing.medium};
  border: ${outlineWidth} solid ${({ theme }) => theme.color.border.moderate};
  border-radius: ${({ theme }) => theme.radius.xxsmall};
  background: ${({ theme }) => theme.color.surface.primary};

  ${CommitRow}:has(input:checked) & {
    border-color: ${({ theme }) => theme.color.border.selected};
    background: ${({ theme }) => theme.color.border.selected};
  }
`;

export const CommitText = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'span',
})`
  margin: 0;
  font-weight: 600;
`;

export const ErrorText = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'p',
})`
  margin: 0;
  color: ${({ theme }) => theme.color.text.error};
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.medium};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      justify-content: flex-end;
    }
  `}
`;

export const CancelActions = styled(Actions)`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex-direction: row-reverse;
      justify-content: space-between;
    }
  `}
`;

export const Confirmed = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.xsmall};
`;

export const CalendarBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

export const CalendarLabel = styled(Text).attrs({
  type: TextTypes.Body7,
  tag: 'p',
})`
  margin: 0;
  color: ${({ theme }) => theme.color.text.heading};
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const CancelBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing.small};
  border: ${outlineWidth} solid ${({ theme }) => theme.color.border.message};
  border-radius: ${({ theme }) => theme.radius.small};
  background: #fff7ef;
  gap: ${({ theme }) => theme.spacing.small};
`;
