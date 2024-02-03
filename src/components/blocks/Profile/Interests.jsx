import { Text } from '@a-little-world/little-world-design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

const Interest = styled.div`
  font-family: 'Signika Negative';
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.color.surface.primary};
  border-radius: 10px;
  box-shadow: 0px 1px 5px rgb(0 0 0 / 30%);
  border-radius: 1000px;
  border: 2px solid ${({ theme }) => theme.color.border.selected};
  color: ${({ theme }) => theme.color.text.primary};
  padding: ${({ theme }) => `${theme.spacing.xxxsmall} ${theme.spacing.xsmall}`};
  min-width: 60px;
  height: 33px;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.small}) {
      padding: ${theme.spacing.xxsmall} ${theme.spacing.small};
      min-width: 80px;
      height: 45px;
    }
  `}
`;
const InterestsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xsmall};
  padding-top: ${({ theme }) => theme.spacing.xxxsmall};
`;

function Interests({ interests, options }) {
  const { t } = useTranslation();
  const selected = options.filter(option => interests.includes(option.value));

  return (
    <InterestsContainer>
      {selected.map(interest => (
        <Interest key={interest.value} className="interest-item">
          <Text tag="span">{t(interest.tag)}</Text>
        </Interest>
      ))}
    </InterestsContainer>
  );
}

export default Interests