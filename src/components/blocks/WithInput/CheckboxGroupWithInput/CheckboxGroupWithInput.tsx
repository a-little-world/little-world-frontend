import { useState } from 'react';

import {
  CheckboxGroup,
  TextInput,
} from '@a-little-world/little-world-design-system';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { formatDataField } from '../../../../userForm/formContent';
import FormStep from '../../Form/FormStep';
import { Container } from './styles';

interface CheckboxGroupWithInputProps {
  control: any;
  checkboxGroup: any;
  textInput: any;
}

const CheckboxGroupWithInput = ({
  control,
  checkboxGroup,
  textInput,
}: CheckboxGroupWithInputProps) => {
  const { currentValue, dataField, formData, textInputVal, getProps } =
    checkboxGroup;
  const [displayTextInput, setDisplayTextInput] = useState(
    currentValue.includes(textInputVal),
  );
  const { t } = useTranslation();
  const CheckboxGroupProps = getProps?.(t);
  return (
    <Container>
      <Controller
        render={({
          field: { onChange, onBlur, value, name, ref },
          fieldState: { error },
        }) => (
          <CheckboxGroup
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
            {...CheckboxGroupProps}
          />
        )}
        defaultValue={currentValue}
        name={dataField}
        control={control}
        rules={CheckboxGroupProps?.errorRules}
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

export default CheckboxGroupWithInput;
