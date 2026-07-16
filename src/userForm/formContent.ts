import {
  Checkbox,
  CheckboxGrid,
  CheckboxGroup,
  Combobox,
  Gradients,
  MultiSelect,
  MultiSelection,
  RadioGroup,
  Select,
  StatusMessage,
  StatusTypes,
  Text,
  TextArea,
  TextContent,
  TextInput,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { ElementType } from 'react';
import styled from 'styled-components';

import Note from '../components/atoms/Note';
import CategorySelector from '../components/blocks/CategorySelector/CategorySelector';
import ProfilePic from '../components/blocks/Profile/ProfilePic/ProfilePic';
import { formatMultiSelectionOptions, orderSelectOptions } from '../helpers/form';

const Warning = styled(StatusMessage)`
  margin-top: -${({ theme }) => theme.spacing.xxsmall};
`;

export const ComponentTypes = {
  checkbox: 'checkbox',
  checkboxGrid: 'checkboxGrid',
  checkboxWithInput: 'checkboxWithInput',
  checkboxGroup: 'checkboxGroup',
  checkboxGroupWithInput: 'checkboxGroupWithInput',
  combobox: 'combobox',
  infoText: 'infoText',
  multiSelect: 'multiSelect',
  multiSelection: 'multiSelection',
  panelSelector: 'panelSelector',
  picture: 'picture',
  radio: 'radio',
  radioWithInput: 'radioWithInput',
  select: 'select',
  selectWithInput: 'selectWithInput',
  text: 'text',
  textArea: 'textArea',
  textContent: 'textContent',
  textInput: 'textInput',
  warning: 'warning',
} as const;

export type ComponentType = keyof typeof ComponentTypes;

export interface FormComponentConfig {
  type: string;
  dataField?: string;
  currentValue?: any;
  formData?: Array<{ tag: string; value: string }>;
  pinValue?: string;
  getProps?: (t: (key: string) => string) => Record<string, any>;
}

interface ComponentReturn {
  Component: ElementType;
  [key: string]: any;
}

export type FormatDataFieldOptions = {
  alphabetize?: boolean;
  pinValue?: string;
  sortLocale?: string;
};

export const formatDataField = (
  data: Array<{ tag: string; value: string }> | undefined,
  t: (key: string) => string,
  options: boolean | FormatDataFieldOptions = {},
): Array<{ label: string; value: string }> => {
  if (!data) return [];

  const config: FormatDataFieldOptions =
    typeof options === 'boolean' ? { alphabetize: options } : options;

  const mapped = data.map(({ tag, value }) => ({ label: t(tag), value }));
  return orderSelectOptions(mapped, config);
};

export const getFormComponent = (
  { type, currentValue, dataField, formData, pinValue, getProps }: FormComponentConfig,
  t: (key: string) => string,
): ComponentReturn | null => {
  const props = getProps?.(t);

  switch (type) {
    case ComponentTypes.text:
      return { Component: Text, type: TextTypes.Body5, ...props };

    case ComponentTypes.infoText:
      return { Component: Note, ...props };

    case ComponentTypes.warning:
      return {
        Component: Warning,
        type: StatusTypes.Warning,
        visible: true,
        withBorder: true,
        ...props,
      };

    case ComponentTypes.textArea:
      return {
        Component: TextArea,
        dataField,
        currentValue: currentValue || '',
        updater: 'onChange',
        ...props,
      };

    case ComponentTypes.textContent:
      return {
        Component: TextContent,
        ...props,
      };

    case ComponentTypes.textInput:
      return {
        Component: TextInput,
        dataField,
        updater: 'onChange',
        currentValue: currentValue || '',
        ...props,
      };

    case ComponentTypes.radio:
      return {
        Component: RadioGroup,
        dataField,
        updater: 'onValueChange',
        currentValue: currentValue || null,
        items: formData?.map(({ tag, value }) => ({
          id: tag,
          label: t(tag),
          value,
        })),
        orientation: 'vertical',
        ...props,
      };

    case ComponentTypes.panelSelector: {
      const categories = [
        {
          ...formData?.[0],
          gradient: Gradients.Blue,
          color: '#36a9e0',
          label: t('user_type.learner_label'),
          description: t('user_type.learner_description'),
          note: t('user_type.learner_note'),
        },
        {
          ...formData?.[1],
          gradient: Gradients.Orange,
          color: '#e87818',
          label: t('user_type.volunteer_label'),
          description: t('user_type.volunteer_description'),
          note: t('user_type.volunteer_note'),
        },
      ];
      return {
        Component: CategorySelector,
        dataField,
        updater: 'onUpdate',
        categories,
        currentValue: currentValue || '',
        ...props,
      };
    }

    case ComponentTypes.multiSelection:
      return {
        Component: MultiSelection,
        dataField,
        updater: 'onSelection',
        valueKey: 'preSelected',
        currentValue: currentValue || [],
        options: formatMultiSelectionOptions({ data: formData, t }),
        ...props,
      };

    case ComponentTypes.combobox:
      return {
        Component: Combobox,
        dataField,
        updater: 'onValueChange',
        options: formatDataField(formData, t, { alphabetize: true, pinValue }),
        currentValue: currentValue || '',
        ...props,
      };

    case ComponentTypes.select:
      return {
        Component: Select,
        dataField,
        updater: 'onValueChange',
        options: formatDataField(formData, t, { alphabetize: true, pinValue }),
        currentValue: currentValue || '',
        ...props,
      };

    case ComponentTypes.multiSelect:
      return {
        Component: MultiSelect,
        updater: 'onValueChange',
        dataField,
        currentValue: currentValue || [],
        ...props,
      };

    case ComponentTypes.checkboxGrid:
      return {
        Component: CheckboxGrid,
        dataField,
        updater: 'onSelection',
        currentValue: currentValue || '',
        ...props,
      };

    case ComponentTypes.checkbox:
      return {
        Component: Checkbox,
        dataField,
        updater: 'onCheckedChange',
        currentValue: currentValue || '',
        defaultChecked: currentValue || false,
        ...props,
      };

    case ComponentTypes.checkboxGroup:
      return {
        Component: CheckboxGroup,
        dataField,
        updater: 'onSelection',
        currentValue: currentValue || '',
        ...props,
      };

    case ComponentTypes.picture:
      return { Component: ProfilePic };

    default:
      return null;
  }
};
