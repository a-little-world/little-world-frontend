import styled, { css } from 'styled-components';

import Form from '../blocks/Form/Form';

export const EditContainer = styled.section`
  padding: ${({ theme }) => theme.spacing.xxsmall};
  width: 100%;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: 0;
    }
  `};
`;

const EditView = () => (
  <EditContainer>
    <Form />
  </EditContainer>
);

export default EditView;
