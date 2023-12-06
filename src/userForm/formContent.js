import {
  Checkbox,
  CheckboxGrid,
  Dropdown,
  MultiDropdown,
  MultiSelection,
  RadioGroup,
  Text,
  TextArea,
  TextContent,
  TextInput,
} from "@a-little-world/little-world-design-system";

import CategorySelector from "../components/blocks/CategorySelector/CategorySelector";
import Note from "../components/blocks/Note/Note";
import ProfilePic from "../components/blocks/ProfilePic/ProfilePic";

export const ComponentTypes = {
  infoText: "infoText",
  text: "text",
  textContent: "textContent",
  textArea: "textArea",
  textInput: "textInput",
  radio: "radio",
  radioWithInput: "radioWithInput",
  panelSelector: "panelSelector",
  multiSelection: "multiSelection",
  multiDropdown: "multiDropdown",
  dropdown: "dropdown",
  checkbox: "checkbox",
  checkboxGrid: "checkboxGrid",
  picture: "picture",
};

export const formatDataField = (data, t) =>
  data?.map(({ tag, value }) => ({ label: t(tag), value }));

export const getFormComponent = ({ type, currentValue, dataField, formData, getProps }, t) => {
  const props = getProps?.(t);
  if (type === ComponentTypes.text) return { Component: Text, type: "Body3", ...props };

  if (type === ComponentTypes.infoText) return { Component: Note, ...props };

  if (type === ComponentTypes.textArea)
    return {
      Component: TextArea,
      dataField,
      currentValue: currentValue || "",
      updater: "onChange",
      ...props,
    };

  if (type === ComponentTypes.textContent)
    return {
      Component: TextContent,
      ...props,
    };

  if (type === ComponentTypes.textInput)
    return {
      Component: TextInput,
      dataField,
      updater: "onChange",
      currentValue: currentValue || "",
      ...props,
    };

  if (type === ComponentTypes.radio)
    return {
      Component: RadioGroup,
      dataField,
      updater: "onValueChange",
      currentValue: currentValue || null,
      items: formData?.map(({ tag, value }) => ({
        id: tag,
        label: t(tag),
        value,
      })),
      ...props,
    };

  if (type === ComponentTypes.panelSelector) {
    const categories = [
      {
        ...formData?.[0],
        color: "#36a9e0",
        label: t("user_type.learner_label"),
        description: t("user_type.learner_description"),
        note: t("user_type.learner_note"),
      },
      {
        ...formData?.[1],
        color: "#F9BA6E",
        label: t("user_type.volunteer_label"),
        description: t("user_type.volunteer_description"),
        note: t("user_type.volunteer_note"),
      },
    ];

    return {
      Component: CategorySelector,
      dataField,
      updater: "onUpdate",
      categories,
      currentValue: currentValue || "",
      ...props,
    };
  }

  if (type === ComponentTypes.multiSelection)
    return {
      Component: MultiSelection,
      dataField,
      updater: "onSelection",
      valueKey: "preSelected",
      currentValue: currentValue || [],
      options: formData?.map((item) => ({ ...item, tag: t(item.tag) })),
      ...props,
    };

  if (type === ComponentTypes.dropdown)
    return {
      Component: Dropdown,
      dataField,
      updater: "onValueChange",
      options: formatDataField(formData, t),
      currentValue: currentValue || "",
      ...props,
    };

  if (type === ComponentTypes.multiDropdown)
    return {
      Component: MultiDropdown,
      updater: "onValueChange",
      dataField,
      currentValue: currentValue || [],
      ...props,
    };

  if (type === ComponentTypes.checkboxGrid)
    return {
      Component: CheckboxGrid,
      dataField,
      updater: "onSelection",
      currentValue: currentValue || "",
      ...props,
    };

  if (type === ComponentTypes.checkbox)
    return {
      Component: Checkbox,
      dataField,
      updater: "onCheckedChange",
      currentValue: currentValue || "",
      defaultChecked: currentValue || false,
      ...props,
    };

  if (type === ComponentTypes.picture)
    return {
      Component: ProfilePic,
    };

  return null;
};
