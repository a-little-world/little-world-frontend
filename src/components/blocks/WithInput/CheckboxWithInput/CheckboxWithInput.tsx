import {
  Checkbox,
  Label,
  TextArea,
} from '@a-little-world/little-world-design-system';
import React, { useState } from 'react';
import {
  Control,
  Controller,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FormStep from '../../Form/FormStep';
import { Container, TextInputContainer } from './styles';

interface CheckboxProps {
  heading?: string;
  currentValue: boolean;
  dataField: string;
  errorRules?: RegisterOptions;
  getProps?: (t: (key: string) => string) => Record<string, any>;
}

interface TextInputProps {
  dataField: string;
  currentValue?: string;
  getProps?: (t: (key: string) => string) => Record<string, any>;
}

interface CheckboxWithInputProps {
  control: Control<FieldValues>;
  checkbox: CheckboxProps;
  textInput: TextInputProps;
}

const CheckboxWithInput: React.FC<CheckboxWithInputProps> = ({
  control,
  checkbox,
  textInput,
}) => {
  const { currentValue, dataField, errorRules, getProps } = checkbox;

  const [displayTextInput, setDisplayTextInput] =
    useState<boolean>(currentValue);
  const { t } = useTranslation();
  const checkboxProps = getProps?.(t);

  return (
    <Container>
      {checkboxProps?.heading && (
        <Label bold toolTipText={checkboxProps.labelTooltip}>
          {checkboxProps.heading}
        </Label>
      )}
      <Controller
        name={dataField}
        control={control}
        defaultValue={currentValue}
        rules={errorRules}
        render={({
          field: { onChange, onBlur, value, name, ref },
          fieldState: { error },
        }) => (
          <Checkbox
            name={name}
            value={value}
            onBlur={onBlur}
            inputRef={ref}
            error={error?.message}
            onCheckedChange={(val: boolean) => {
              setDisplayTextInput(val);
              onChange({ target: { value: val } });
            }}
            defaultChecked={value}
            {...checkboxProps}
          />
        )}
      />

      {displayTextInput && (
        <TextInputContainer>
          <FormStep
            content={{
              Component: TextArea,
              dataField: textInput.dataField,
              currentValue: textInput.currentValue || '',
              updater: 'onChange',
              ...textInput?.getProps?.(t),
            }}
            control={control}
          />
        </TextInputContainer>
      )}
    </Container>
  );
};

export default CheckboxWithInput;
