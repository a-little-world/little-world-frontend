import { Button, TextArea } from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

export const ToolContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  width: 100%;
`;

export const DropdownsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  align-items: flex-start;
  width: 100%;

  /* Ensure dropdowns have equal width and SwapBtn doesn't shrink */
  & > div:not(button) {
    flex: 1 1 0;
    min-width: 0;
  }
`;

export const SwapBtn = styled(Button)`
  padding: ${({ theme }) => theme.spacing.xxxsmall};
  margin-top: 6px;
  border-radius: ${({ theme }) => theme.radius.half};
  color: ${({ theme }) => theme.color.text.title};
  flex-shrink: 0;
  flex-grow: 0;
`;

export const TextAreasRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  width: 100%;
  align-items: stretch;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex-direction: row;
      gap: 42px;
    }
  `}
`;

export const TextAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border: 1px solid ${({ theme }) => theme.color.border.moderate};
  border-radius: ${({ theme }) => theme.radius.xxxsmall};
  background: ${({ theme }) => theme.color.surface.primary};
  overflow: hidden;
`;

export const TranslationInput = styled(TextArea)`
  border: 1px solid ${({ theme }) => theme.color.border.moderate};
  border-radius: ${({ theme }) => theme.radius.xxxsmall};
  min-height: 128px;
  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      height: 100%;
    }
  `}
`;

export const TranslatedTextArea = styled(TextArea)`
  border: none;
  border-radius: 0;
  flex: 1 1 0;
  min-height: 128px;
  overflow: auto;
`;

export const Toolbar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing.small};
  flex-shrink: 0;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      gap: ${theme.spacing.small};
    }
  `}
`;

// Wrapper to contain TextAreaContainer and ErrorBoxSpacer as siblings
export const TranslatedTextAreaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

// needed to align translated input and translated text due to error box of the input
export const ErrorBoxSpacer = styled.div`
  height: ${({ theme }) => theme.spacing.small};
  flex-shrink: 0;
`;
