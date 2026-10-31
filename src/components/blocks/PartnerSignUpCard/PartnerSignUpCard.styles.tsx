import {
  Button,
  Card,
  Checkbox,
  Text,
  TextInput,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

export const CardShell = styled(Card)`
  && {
    width: 100%;
    max-width: 100%;
    gap: ${({ theme }) => theme.spacing.small};
    text-align: left;
    color: ${({ theme }) => theme.color.text.primary};
    border-radius: ${({ theme }) => theme.radius.large};
    padding: ${({ theme }) =>
      `calc(${theme.spacing.small} + ${theme.spacing.xxxsmall})`};
    box-shadow:
      inset 0 0 0 1px ${({ theme }) => theme.color.border.subtle},
      0 1px 25px 1px rgb(0 0 0 / 5%);
  }

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      && {
        max-width: 40rem;
        border-radius: ${theme.radius.xlarge};
        padding: ${theme.spacing.medium} ${theme.spacing.large};
      }
    }
  `}
`;

export const AppointmentRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) =>
    `calc(${theme.spacing.xsmall} + ${theme.spacing.xxxxsmall})`};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      gap: ${theme.spacing.medium};
    }
  `}
`;

export const DoorBadge = styled.div`
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: ${({ theme }) =>
    `calc((${theme.spacing.xxlarge} + ${theme.spacing.xxsmall}) * 0.82)`};
  height: ${({ theme }) =>
    `calc(${theme.spacing.xxlarge} + ${theme.spacing.xxsmall})`};
  padding-top: ${({ theme }) => theme.spacing.xxsmall};
  background: ${({ theme }) => theme.color.gradient.blue10};
  border-radius: ${({ theme }) =>
    `${theme.radius.massive} ${theme.radius.massive} ${theme.radius.xsmall} ${theme.radius.xsmall}`};
  box-shadow:
    inset 0 0 0 ${({ theme }) => theme.spacing.xxxsmall}
      ${({ theme }) => theme.color.surface.primary},
    0 0 0 ${({ theme }) => theme.spacing.xxxxsmall}
      ${({ theme }) => theme.color.border.bold};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      width: ${theme.spacing.xxxxlarge};
      height: calc(${theme.spacing.xxxxlarge} + ${theme.spacing.xxxsmall});
    }
  `}
`;

export const DoorNumber = styled(Text).attrs({
  type: TextTypes.Heading4,
  tag: 'span' as const,
})`
  color: ${({ theme }) => theme.color.text.button};
  line-height: 1;
`;

export const DoorKnob = styled.span`
  position: absolute;
  top: 80%;
  right: ${({ theme }) => theme.spacing.xxsmall};
  width: ${({ theme }) => theme.spacing.xxsmall};
  height: ${({ theme }) => theme.spacing.xxsmall};
  border-radius: ${({ theme }) => theme.radius.half};
  background: ${({ theme }) => theme.color.surface.highlight};
`;

export const AppointmentCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
  min-width: 0;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      gap: ${theme.spacing.xxsmall};
    }
  `}
`;

export const AppointmentEyebrow = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'span' as const,
  bold: true,
})`
  color: ${({ theme }) => theme.color.text.heading};
  text-transform: uppercase;
  letter-spacing: 0.12em;
`;

export const AppointmentDate = styled(Text).attrs({
  type: TextTypes.Heading5,
  tag: 'p' as const,
})`
  color: ${({ theme }) => theme.color.text.title};
  line-height: 1.1;
  overflow-wrap: anywhere;
  margin: 0;
`;

export const DateLong = styled.span`
  display: none;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      display: inline;
    }
  `}
`;

export const DateShort = styled.span`
  display: inline;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      display: none;
    }
  `}
`;

export const TimeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) =>
    `calc(${theme.spacing.xxsmall} + ${theme.spacing.xxxxsmall})`};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      gap: ${theme.spacing.xxsmall};
    }
  `}
`;

export const TimeLabel = styled(Text).attrs({
  type: TextTypes.Body5,
  tag: 'span' as const,
  bold: true,
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
  white-space: nowrap;
  color: ${({ theme }) => theme.color.text.primary};

  svg {
    flex-shrink: 0;
    opacity: 0.75;
    width: ${({ theme }) =>
      `calc(${theme.spacing.small} + ${theme.spacing.xxxxsmall})`};
    height: ${({ theme }) =>
      `calc(${theme.spacing.small} + ${theme.spacing.xxxxsmall})`};
  }

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      svg {
        width: ${theme.spacing.medium};
        height: ${theme.spacing.medium};
      }
    }
  `}
`;

export const DaysPill = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'span' as const,
  bold: true,
})`
  color: ${({ theme }) => theme.color.text.heading};
  background: ${({ theme }) => theme.color.surface.subtle};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.color.border.accent};
  border-radius: ${({ theme }) => theme.radius.massive};
  padding: ${({ theme }) =>
    `${theme.spacing.xxxsmall} ${theme.spacing.xsmall}`};
`;

export const DashedDivider = styled.div`
  width: 100%;
  border-top: ${({ theme }) => theme.spacing.xxxxsmall} dashed
    ${({ theme }) => theme.color.border.subtle};
`;

export const FormStack = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  width: 100%;
`;

export const EmailField = styled(TextInput)`
  && {
    width: 100%;
    max-width: 100%;
  }

  input {
    width: 100%;
    max-width: 100%;
    height: ${({ theme }) =>
      `calc(${theme.spacing.xlarge} + ${theme.spacing.xsmall})`};
    border-radius: ${({ theme }) => theme.radius.small};
    border-width: ${({ theme }) => theme.spacing.xxxxsmall};
    background: ${({ theme }) => theme.color.surface.primary};
    color: ${({ theme }) => theme.color.text.primary};

    &::placeholder {
      color: ${({ theme }) => theme.color.text.quaternary};
    }

    &:focus,
    &:focus-visible {
      outline: none;
      border-color: ${({ theme }) => theme.color.border.selected};
    }
  }
`;

export const ErrorRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
  color: ${({ theme }) => theme.color.text.error};
`;

export const ErrorText = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'p' as const,
})`
  color: ${({ theme }) => theme.color.text.error};
  line-height: 1.4;
  margin: 0;
`;

export const SuccessRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
  padding: ${({ theme }) => `${theme.spacing.xxsmall} ${theme.spacing.xsmall}`};
  border-radius: ${({ theme }) => theme.radius.small};
  background: ${({ theme }) => theme.color.surface.success};
`;

export const SuccessText = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'p' as const,
  bold: true,
})`
  color: ${({ theme }) => theme.color.text.success};
  line-height: 1.4;
  margin: 0;
`;

export const SubmitButton = styled(Button)`
  width: 100%;
  max-width: 100%;
  height: ${({ theme }) =>
    `calc(${theme.spacing.xlarge} + ${theme.spacing.xsmall})`};
  white-space: nowrap;
`;

export const Microcopy = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'p' as const,
})`
  color: ${({ theme }) => theme.color.text.tertiary};
  margin: 0;
`;

export const NewsletterRow = styled.label`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  cursor: pointer;
`;

export const NewsletterCheckbox = styled(Checkbox)`
  flex-shrink: 0;
  margin-top: ${({ theme }) => theme.spacing.xxxxsmall};
`;

export const NewsletterLabel = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'span' as const,
})`
  color: ${({ theme }) => theme.color.text.tertiary};
  line-height: 1.4;
`;

export const SupportRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
  color: ${({ theme }) => theme.color.text.tertiary};

  svg {
    opacity: 0.65;
    flex-shrink: 0;
    margin-top: ${({ theme }) => theme.spacing.xxxxsmall};
  }
`;

export const SupportText = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'p' as const,
})`
  color: ${({ theme }) => theme.color.text.tertiary};
  margin: 0;
`;
