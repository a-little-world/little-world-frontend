import { Separator } from '@a-little-world/little-world-design-system';
import React from 'react';
import styled from 'styled-components';

interface Step {
  id: string;
  label: string;
}

interface StepperProps {
  steps: Step[];
  activeStep: string;
  onSelectStep: (id: string) => void;
}

const StepperContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-top: 1px solid ${({ theme }) => theme.color.border.subtle};
  padding-top: ${({ theme }) => theme.spacing.small};
`;

const Step = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
`;

const StepNumber = styled.div<{ isActive: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid
    ${props =>
      props.isActive
        ? props.theme.color.surface.bold
        : props.theme.color.border.subtle};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.isActive
      ? props.theme.color.surface.bold
      : props.theme.color.surface.primary};
  color: ${props =>
    props.isActive
      ? props.theme.color.text.reversed
      : props.theme.color.text.primary};
  font-weight: bold;
  cursor: pointer;
`;

const StepLabel = styled.div<{ isActive: boolean }>`
  font-size: 18px;
  color: ${props =>
    props.isActive
      ? props.theme.color.text.heading
      : props.theme.color.text.primary};
  height: 30px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const NumberContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledSeparator = styled.div`
  height: 16px;
  padding: ${({ theme }) => theme.spacing.xxxsmall};
`;

const Stepper: React.FC<StepperProps> = ({
  steps,
  activeStep,
  onSelectStep,
}) => {
  return (
    <StepperContainer>
      {steps.map((step, index) => (
        <Step key={step.id} onClick={() => onSelectStep(step.id)}>
          <NumberContainer>
            <StepNumber isActive={step.id === activeStep}>
              {index + 1}
            </StepNumber>
            {steps.length - 1 !== index && (
              <StyledSeparator>
                <Separator
                  background="darkGray"
                  orientation={'vertical'}
                  spacing={'0px'}
                />
              </StyledSeparator>
            )}
          </NumberContainer>
          <StepLabel isActive={step.id === activeStep}>{step.label}</StepLabel>
        </Step>
      ))}
    </StepperContainer>
  );
};

export default Stepper;
