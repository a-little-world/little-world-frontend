import {
  Button,
  Card,
  Text,
  TextArea,
} from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

import ProfileImage from '../../atoms/ProfileImage.jsx';

export const Panel = styled(Card)`
  display: flex;
  flex-grow: 1;
  width: 100%;
  min-width: 0;
  min-height: 0;
  padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.small}`};
  gap: ${({ theme }) => theme.spacing.small};
  box-shadow: none;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      position: relative;
    }

    @media (min-width: ${theme.breakpoints.large}) {
      padding: ${theme.spacing.medium};
    }
  `}
`;

export const NoChatSelected = styled(Panel)`
  background: ${({ theme }) => theme.color.surface.secondary};
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.medium};

  ${({ theme }) => css`
    display: none;
    @media (min-width: ${theme.breakpoints.medium}) {
      position: relative;
      display: flex;
    }
  `}
`;

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

export const UserImage = styled(ProfileImage)`
  flex-shrink: 0;
`;

export const Time = styled(Text)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.color.text.secondary};
  padding-left: ${({ theme }) => theme.spacing.small};
  gap: ${({ theme }) => theme.spacing.xxxsmall};
`;

export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const WriteSection = styled.form`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

export const Messages = styled.div`
  height: 100%;
  border: 2px solid ${({ theme }) => theme.color.border.minimal};
  border-radius: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column-reverse;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small};
  overflow-y: scroll;
`;

export const Message = styled.div<{ $isSelf: boolean }>`
  align-self: ${({ $isSelf }) => ($isSelf ? 'flex-end' : 'flex-start')};
  align-items: ${({ $isSelf }) => ($isSelf ? 'flex-end' : 'flex-start')};
  display: flex;
  flex-direction: column;
  width: 90%;
`;

export const MessageText = styled(Text)<{ $isSelf: boolean }>`
  position: relative;
  padding: ${({ theme }) => `${theme.spacing.xxsmall} ${theme.spacing.xsmall}`};
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: 24px;
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};

  ${({ $isSelf, theme }) =>
    $isSelf &&
    `
   background: ${theme.color.surface.message};
`}

  &::before {
    content: ' ';
    position: absolute;
    width: 0;
    height: 0;
    bottom: -9px;
    border: 5px solid;

    ${({ theme, $isSelf }) =>
      $isSelf
        ? css`
            border-color: ${theme.color.border.subtle}
              ${theme.color.border.subtle} transparent transparent;
            left: auto;
            right: 15px;
          `
        : css`
            border-color: ${theme.color.border.subtle} transparent transparent
              ${theme.color.border.subtle};
            right: auto;
            left: 15px;
          `}
  }

  &::after {
    content: ' ';
    position: absolute;
    width: 0;
    height: 0;
    bottom: -7px;
    border: 5px solid;

    ${({ theme, $isSelf }) =>
      $isSelf
        ? css`
            border-color: ${theme.color.surface.message}
              ${theme.color.surface.message} transparent transparent;
            left: auto;
            right: 16px;
          `
        : css`
            border-color: ${theme.color.surface.primary} transparent transparent
              ${theme.color.surface.primary};
            right: auto;
            left: 16px;
          `}
  }
`;

export const MessageBox = styled(TextArea)`
  height: 38px;
  border-radius: 100px;
  background: ${({ theme }) => theme.color.surface.secondary};
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xsmall};
`;

export const NoMessages = styled(Text)`
  height: 100%;
  background: ${({ theme }) => theme.color.surface.tertiary};
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  text-align: center;
  display: flex;
  padding: ${({ theme }) => theme.spacing.xxsmall};
`;

export const Preview = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const BackButton = styled(Button)<{ $show: boolean }>`
  display: ${({ $show }) => ($show ? 'flex' : 'none')};
  color: ${({ theme }) => theme.color.text.link};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      display: none;
    }
  `}
`;

export const SendButton = styled(Button)`
  height: 36px;
  min-width: unset;
`;

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.small};
  overflow-y: hidden;
  width: 100%;
`;
