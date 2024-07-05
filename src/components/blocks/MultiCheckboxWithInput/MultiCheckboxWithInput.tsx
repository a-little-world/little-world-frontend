import {
  MultiCheckbox,
  TextInput,
} from '@a-little-world/little-world-design-system';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { formatDataField } from '../../../userForm/formContent.js';
import FormStep from '../Form/FormStep.jsx';
import { Container } from './styles.tsx';

interface MultiCheckboxWithInputProps {
  control: any;
  multiCheckbox: any;
  textInput: any;
}

const MultiCheckboxWithInput = ({
  control,
  multiCheckbox,
  textInput,
}: MultiCheckboxWithInputProps) => {
  const { currentValue, dataField, formData, textInputVal, getProps } =
    multiCheckbox;
  const [displayTextInput, setDisplayTextInput] = useState(
    textInputVal === currentValue,
  );
  const { t } = useTranslation();
  const MultiCheckboxProps = getProps?.(t);
  return (
    <Container>
      <Controller
        render={({
          field: { onChange, onBlur, value, name, ref },
          fieldState: { error },
        }) => (
          <MultiCheckbox
            name={name}
            preSelected={value}
            onBlur={onBlur}
            inputRef={ref}
            error={error?.message}
            onSelection={val => {
              setDisplayTextInput(val?.includes(textInputVal));
              onChange(val);
            }}
            options={formatDataField(formData, t)}
            {...MultiCheckboxProps}
          />
        )}
        defaultValue={currentValue}
        name={dataField}
        control={control}
        rules={MultiCheckboxProps?.errorRules}
      />
      {displayTextInput && (
        <FormStep
          content={{
            Component: TextInput,
            dataField: textInput.dataField,
            currentValue: textInput.currentValue || '',
            updater: 'onChange',
            ...textInput?.getProps?.(t),
          }}
          control={control}
        />
      )}
    </Container>
  );
};

export default MultiCheckboxWithInput;
