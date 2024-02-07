import {
  Dropdown,
  TextInput,
} from '@a-little-world/little-world-design-system';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { formatDataField } from '../../../userForm/formContent';
import FormStep from '../Form/FormStep';
import { Container } from './styles';

const DropdownWithInput = ({ control, dropdown, textInput }) => {
  const { currentValue, dataField, formData, textInputVal, getProps } =
    dropdown;
  const [displayTextInput, setDisplayTextInput] = useState(
    textInputVal === currentValue,
  );
  const { t } = useTranslation();
  const dropdownProps = getProps?.(t);
  return (
    <Container>
      <Controller
        render={({
          field: { onChange, onBlur, value, name, ref },
          fieldState: { error },
        }) => (
          <Dropdown
            name={name}
            value={value}
            onBlur={onBlur}
            inputRef={ref}
            error={error?.message}
            onValueChange={val => {
              setDisplayTextInput(val === textInputVal);
              onChange(val);
            }}
            options={formatDataField(formData, t)}
            {...dropdownProps}
          />
        )}
        defaultValue={currentValue}
        name={dataField}
        control={control}
        rules={dropdownProps?.errorRules}
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

export default DropdownWithInput;
