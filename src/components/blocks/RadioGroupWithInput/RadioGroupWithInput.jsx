import { RadioGroup, TextInput } from "@a-little-world/little-world-design-system";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import FormStep from "../Form/FormStep";
import Note from "../Note/Note";

const RadioGroupWithInput = ({ control, radioGroup, textInput }) => {
  const { currentValue, dataField, errorRules, formData, textInputVal, ...radioGroupProps } =
    radioGroup;
  const [displayTextInput, setDisplayTextInput] = useState(textInputVal === currentValue);
  const { t } = useTranslation();

  return (
    <div>
      <Controller
        render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error } }) => (
          <RadioGroup
            name={name}
            value={value}
            onBlur={onBlur}
            inputRef={ref}
            error={error?.message}
            onValueChange={(val) => {
              setDisplayTextInput(val === textInputVal);
              onChange(val);
            }}
            items={formData?.map(({ tag, value: val }) => ({
              id: tag,
              label: t(tag),
              value: val,
            }))}
            {...radioGroupProps}
          />
        )}
        defaultValue={currentValue}
        name={dataField}
        control={control}
        rules={errorRules}
      />
      {displayTextInput && (
        <div>
          <FormStep
            content={{
              Component: TextInput,
              dataField: textInput.dataField,
              currentValue: textInput.currentValue || "",
              updater: "onChange",
              ...textInput?.getProps?.(t),
            }}
            control={control}
          />
          <Note center={false}>{t(textInput.infoText)}</Note>
        </div>
      )}
    </div>
  );
};

export default RadioGroupWithInput;
