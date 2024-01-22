import styled, { css } from 'styled-components';

export const MessageTypes = {
  Error: 'error',
  Success: 'success',
};

const FormMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: ${({ theme }) => theme.spacing.large};
  padding: ${({ theme }) => theme.spacing.xxsmall};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: ${({ $visible }) => ($visible ? 'opacity 1s' : 'none')};
  text-align: center;
  margin: ${({ theme }) => theme.spacing.xxsmall} 0;

  ${({ $type }) => {
    if ($type === MessageTypes.Error)
      return css`
        background: ${({ theme }) => theme.color.surface.error};
        color: ${({ theme }) => theme.color.text.error};
      `;

    if ($type === MessageTypes.Success)
      return css`
        background: ${({ theme }) => theme.color.surface.success};
        color: ${({ theme }) => theme.color.text.success};
      `;
    return '';
  }})
`;

export default FormMessage;
