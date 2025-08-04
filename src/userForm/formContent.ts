import {
  Checkbox,
  CheckboxGrid,
  Dropdown,
  Gradients,
  MultiCheckbox,
  MultiDropdown,
  MultiSelection,
  RadioGroup,
  Text,
  TextArea,
  TextContent,
  TextInput,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { ElementType } from 'react';

import Note from '../components/atoms/Note';
import CategorySelector from '../components/blocks/CategorySelector/CategorySelector';
import ProfilePic from '../components/blocks/Profile/ProfilePic/ProfilePic';
import { formatMultiSelectionOptions } from '../helpers/form';

export const ComponentTypes = {
  infoText: 'infoText',
  text: 'text',
  textContent: 'textContent',
  textArea: 'textArea',
  textInput: 'textInput',
  radio: 'radio',
  radioWithInput: 'radioWithInput',
  panelSelector: 'panelSelector',
  multiCheckbox: 'multiCheckbox',
  multiCheckboxWithInput: 'multiCheckboxWithInput',
  multiSelection: 'multiSelection',
  multiDropdown: 'multiDropdown',
  dropdown: 'dropdown',
  dropdownWithInput: 'dropdownWithInput',
  checkbox: 'checkbox',
  checkboxWithInput: 'checkboxWithInput',
  checkboxGrid: 'checkboxGrid',
  picture: 'picture',
} as const;

export type ComponentType = keyof typeof ComponentTypes;

export interface FormComponentConfig {
  type: string;
  dataField?: string;
  currentValue?: any;
  formData?: Array<{ tag: string; value: string }>;
  getProps?: (t: (key: string) => string) => Record<string, any>;
}

interface ComponentReturn {
  Component: ElementType;
  [key: string]: any;
}

export const formatDataField = (
  data: Array<{ tag: string; value: string }> | undefined,
  t: (key: string) => string,
): Array<{ label: string; value: string }> =>
  data?.map(({ tag, value }) => ({ label: t(tag), value })) || [];

export const getFormComponent = (
  { type, currentValue, dataField, formData, getProps }: FormComponentConfig,
  t: (key: string) => string,
): ComponentReturn | null => {
  const props = getProps?.(t);

  switch (type) {
    case ComponentTypes.text:
      return { Component: Text, type: TextTypes.Body5, ...props };

    case ComponentTypes.infoText:
      return { Component: Note, ...props };

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

    case ComponentTypes.dropdown:
      return {
        Component: Dropdown,
        dataField,
        updater: 'onValueChange',
        options: formatDataField(formData, t),
        currentValue: currentValue || '',
        ...props,
      };

    case ComponentTypes.multiDropdown:
      return {
        Component: MultiDropdown,
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

    case ComponentTypes.multiCheckbox:
      return {
        Component: MultiCheckbox,
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
