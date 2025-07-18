import {
  RadioGroup,
  TextInput,
} from '@a-little-world/little-world-design-system';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Note from '../../../atoms/Note';
import FormStep from '../../Form/FormStep';

const RadioGroupWithInput = ({ control, radioGroup, textInput }) => {
  const { currentValue, dataField, formData, textInputVal, getProps } =
    radioGroup;
  const [displayTextInput, setDisplayTextInput] = useState(
    textInputVal === currentValue,
  );
  const { t } = useTranslation();
  const radioGroupProps = getProps?.(t);

  return (
    <div>
      <Controller
        render={({
          field: { onChange, onBlur, value, name, ref },
          fieldState: { error },
        }) => (
          <RadioGroup
            name={name}
            value={value}
            onBlur={onBlur}
            inputRef={ref}
            error={error?.message}
            onValueChange={val => {
              setDisplayTextInput(val === textInputVal);
              onChange(val);
            }}
            items={formData?.map(({ tag, value: val }) => ({
              id: tag,
              label: t(tag),
              value: val,
            }))}
            label={radioGroupProps?.label}
            labelTooltip={radioGroupProps?.labelTooltip}
          />
        )}
        defaultValue={currentValue}
        name={dataField}
        control={control}
        rules={radioGroupProps?.errorRules}
      />
      {displayTextInput && (
        <div>
          <FormStep
            content={{
              Component: textInput.Component ?? TextInput,
              dataField: textInput.dataField,
              currentValue: textInput.currentValue || '',
              updater: 'onChange',
              ...textInput?.getProps?.(t),
            }}
            control={control}
          />
          {textInput.infoText && (
            <Note center={false}>{t(textInput.infoText)}</Note>
          )}
        </div>
      )}
    </div>
  );
};

export default RadioGroupWithInput;
