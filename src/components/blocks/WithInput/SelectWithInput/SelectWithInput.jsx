import { Select, TextInput } from '@a-little-world/little-world-design-system';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { formatDataField } from '../../../../userForm/formContent';
import FormStep from '../../Form/FormStep';
import { Container } from './styles';

const SelectWithInput = ({ control, select, textInput }) => {
  const { currentValue, dataField, formData, textInputVal, getProps } = select;
  const [displayTextInput, setDisplayTextInput] = useState(
    textInputVal === currentValue,
  );
  const { t } = useTranslation();
  const selectProps = getProps?.(t);
  return (
    <Container>
      <Controller
        render={({
          field: { onChange, onBlur, value, name, ref },
          fieldState: { error },
        }) => (
          <Select
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
            {...selectProps}
          />
        )}
        defaultValue={currentValue}
        name={dataField}
        control={control}
        rules={selectProps?.errorRules}
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

export default SelectWithInput;
