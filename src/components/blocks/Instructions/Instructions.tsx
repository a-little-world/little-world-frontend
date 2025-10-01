import { Text, TextTypes } from '@a-little-world/little-world-design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

const Container = styled.div`
  background: ${({ theme }) => theme.color.surface.primary};
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: ${({ theme }) => theme.radius.medium};
  width: 100%;
  max-width: 300px;
  padding: ${({ theme }) => theme.spacing.medium};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      width: unset;
      border-radius: ${theme.radius.medium};
      padding: ${theme.spacing.small};
    }
  `}
`;

const InstructionsTitle = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const StepBlock = styled.li`
  background: ${({ theme }) => theme.color.surface.secondary};
  border-radius: ${({ theme }) => theme.radius.xsmall};
  padding: ${({ theme }) => theme.spacing.medium};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${({ theme }) => css`
    @media (max-width: ${theme.breakpoints.small}) {
      padding: ${theme.spacing.small};
    }
  `}
`;

const Steps = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`;

const StepNumber = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
`;

const StepHeading = styled(Text)`
  margin: 0;
`;

const StepDescription = styled(Text)`
  margin: 0;
  color: ${({ theme }) => theme.color.text.secondary};
`;

type InstructionItem = {
  heading: string;
  description: string;
};

type InstructionsProps = {
  title: string;
  items: InstructionItem[];
};

const Instructions: React.FC<InstructionsProps> = ({ title, items }) => {
  const { t } = useTranslation();
  return (
    <Container>
      <InstructionsTitle type={TextTypes.Body3} tag="h2" center>
        {title}
      </InstructionsTitle>
      <Steps>
        {items.map((item, index) => (
          <StepBlock key={item.heading}>
            <StepNumber type={TextTypes.Body5} tag="span">
              {t('instructions.step')} {index + 1}
            </StepNumber>
            <StepHeading bold type={TextTypes.Body4} tag="h3">
              {t(item.heading)}
            </StepHeading>
            <StepDescription type={TextTypes.Body5} tag="p" center>
              {t(item.description)}
            </StepDescription>
          </StepBlock>
        ))}
      </Steps>
    </Container>
  );
};

export default Instructions;
