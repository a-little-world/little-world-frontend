import { isObject, map } from 'lodash';
import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const ERROR_DE_MISSING = 'profile.lang-de-missing';

const firstDuplicate = arr => {
  const elementSet = new Set();

  for (let i = 0; i < arr.length; i++) {
    if (elementSet.has(arr[i])) return i;
    elementSet.add(arr[i]);
  }

  return -1;
};

const addErrorToLangSkill = ({ dropdownProps, error, values }) => {
  const numberOfValues = values.length;
  const errors = Array(numberOfValues).fill(undefined);
  const errorIndex =
    error.message === ERROR_DE_MISSING
      ? numberOfValues - 1
      : firstDuplicate(values);

  errors.splice(errorIndex, 1, error);
  return { ...dropdownProps, errors };
};

const FormStep = ({ content, control }) => {
  const {
    Component,
    dataField,
    updater,
    currentValue,
    valueKey = 'value',
    errorRules,
    ...props
  } = content;

  const { t } = useTranslation();

  if (dataField) {
    return (
      <Controller
        render={({
          field: { onChange, onBlur, value, name, ref },
          fieldState: { error },
        }) => {
          const componentProps = {
            ...props,
            [updater]: eventOrValue => {
              const newVal = eventOrValue?.target
                ? eventOrValue
                : { target: { value: eventOrValue } };

              onChange(newVal);
            },
            [valueKey]: value,
            ...(dataField === 'lang_skill' && error
              ? {
                  firstDropdown: addErrorToLangSkill({
                    dropdownProps: props.firstDropdown,
                    error: t(error?.message),
                    values: map(value, val => val.lang),
                  }),
                }
              : {}),
          };
          const componentKey = isObject(currentValue)
            ? JSON.stringify(currentValue)
            : currentValue;

          return (
            <Component
              key={name + componentKey}
              name={name}
              value={value}
              onBlur={onBlur}
              inputRef={ref}
              error={t(error?.message)}
              {...componentProps}
            />
          );
        }}
        defaultValue={currentValue}
        name={dataField}
        control={control}
        rules={errorRules}
      />
    );
  }

  return <Component {...props} />;
};

export default FormStep;
