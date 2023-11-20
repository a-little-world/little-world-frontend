import { ContentTypes, InputWidth } from "@a-little-world/little-world-design-system";

import { USER_TYPES } from "../constants";
import { ComponentTypes, formatDataField } from "./formContent";

const columnKeys = ["mo", "tu", "we", "th", "fr", "sa", "su"];

const NUM_STEPS_VOL = 9;
const NUM_STEPS_LEARNER = 8;

const getSteps = (userType) =>
  userType === USER_TYPES.volunteer ? NUM_STEPS_VOL : NUM_STEPS_LEARNER;

const constructCheckboxes = (options, t) =>
  columnKeys.map((key) => options[key].map(({ value, tag }) => ({ name: t(tag), value, key })));

const getUserTypeOptions = (userType, options) => {
  const volunteer = [];
  const learner = [];

  options.forEach((element) => {
    const optionType = element.value.substring(element.value.indexOf(".") + 1);

    (optionType === "vol" ? volunteer : learner).push(element);
  });

  return userType === USER_TYPES.volunteer ? volunteer : learner;
};

// Object containing valid form pages, where key = route
const formPages = {
  "user-type": ({ options, userData }) => ({
    title: "user_type.title",
    note: "user_type.info_text",
    step: 1,
    totalSteps: getSteps(userData?.user_type),
    nextPage: "/self-info-1",
    components: [
      {
        type: ComponentTypes.panelSelector,
        currentValue: userData?.user_type,
        dataField: "user_type",
        formData: options?.user_type,
      },
    ],
  }),
  "self-info-1": ({ options, userData }) => ({
    title: "self_info.title",
    step: 2,
    totalSteps: getSteps(userData?.user_type),
    prevPage: "/user-type",
    nextPage: "/interests",
    components: [
      {
        type: ComponentTypes.textInput,
        currentValue: userData?.postal_code,
        dataField: "postal_code",
        formData: options?.postal_code,
        getProps: (t) => ({
          label: t("self_info.post_code_label"),
          errorRules: { required: t("validation.required") },
          width: InputWidth.Small,
        }),
      },
      ...(userData?.user_type === USER_TYPES.volunteer
        ? []
        : [
            {
              type: ComponentTypes.dropdown,
              currentValue: userData?.target_group,
              dataField: "target_group",
              formData: getUserTypeOptions(userData?.user_type, options?.target_group),
              getProps: (t) => ({
                label: t("self_info.target_group_label"),
                errorRules: { required: t("validation.required") },
              }),
            },
          ]),
      {
        type: ComponentTypes.radio,
        currentValue: userData?.gender,
        dataField: "gender",
        formData: options?.gender,
        getProps: (t) => ({ label: t("self_info.gender_label") }),
      },
      {
        type: ComponentTypes.multiDropdown,
        currentValue: userData?.lang_skill,
        dataField: "lang_skill",
        getProps: (t) => ({
          addMoreLabel: t("self_info.language_add_more"),
          label: t("self_info.language_skills_label"),
          firstDropdown: {
            dataField: "lang",
            ariaLabel: t("self_info.language_selector_label"),
            placeholder: t("self_info.language_selector_placeholder"),
            options: formatDataField(options?.lang_skill.lang, t),
            values: userData?.lang_skill?.map((el) => el.lang),
            errors: [],
          },
          secondDropdown: {
            dataField: "level",
            ariaLabel: t("self_info.language_level_label"),
            placeholder: t("self_info.language_level_placeholder"),
            options: formatDataField(options?.lang_skill.level, t),
            values: userData?.lang_skill?.map((el) => el.level),
            errors: [],
          },
        }),
      },
    ],
  }),
  interests: ({ options, userData }) => ({
    title: "interests.title",
    note: "interests.info_text",
    step: 3,
    totalSteps: getSteps(userData?.user_type),
    prevPage: "/self-info-1",
    nextPage: "/picture",
    components: [
      {
        type: ComponentTypes.textArea,
        formData: options?.description,
        currentValue: userData?.description,
        dataField: "description",
        getProps: (t) => ({
          label: t("interests.description_label"),
          placeholder: t("interests.description_placeholder"),
        }),
      },
      {
        type: ComponentTypes.multiSelection,
        currentValue: userData?.interests,
        dataField: "interests",
        formData: options?.interests,
        getProps: (t) => ({ label: t("interests.selection_label") }),
      },
    ],
  }),
  picture: ({ userData }) => ({
    title: "profile_pic.title",
    step: 4,
    totalSteps: getSteps(userData?.user_type),
    prevPage: "/interests",
    nextPage: userData?.user_type === USER_TYPES.volunteer ? "/partner-1" : "/partner-2",
    components: [{ type: ComponentTypes.picture }],
  }),
  "partner-1": ({ options, userData }) => ({
    title: "partner1.title",
    note: "partner1.info_text",
    step: 5,
    totalSteps: getSteps(userData?.user_type),
    prevPage: "/picture",
    nextPage: "/partner-2",
    components: [
      {
        type: ComponentTypes.dropdown,
        currentValue: userData?.lang_level,
        dataField: "lang_level",
        formData: getUserTypeOptions(userData?.user_type, options?.lang_level),
        getProps: (t) => ({
          label: t("partner1.language_level"),
          errorRules: { required: t("validation.required") },
        }),
      },
      {
        type: ComponentTypes.radio,
        currentValue: userData?.target_group,
        dataField: "target_group",
        formData: getUserTypeOptions(userData?.user_type, options?.target_group),
        getProps: (t) => ({
          label: t("partner1.target_group"),
          errorRules: { required: t("validation.required") },
        }),
      },
    ],
  }),
  "partner-2": ({ options, userData }) => ({
    title: `partner2.${userData?.user_type}_title`,
    note: "partner2.info_text",
    step: userData?.user_type === USER_TYPES.volunteer ? 6 : 5,
    totalSteps: getSteps(userData?.user_type),
    prevPage: userData?.user_type === USER_TYPES.volunteer ? "/partner-1" : "/picture",
    nextPage: "/availability",
    components: [
      {
        type: ComponentTypes.radio,
        currentValue: userData?.speech_medium,
        dataField: "speech_medium",
        formData: getUserTypeOptions(userData?.user_type, options?.speech_medium),
        getProps: (t) => ({
          label: t("partner2.speech_medium"),
          errorRules: { required: t("validation.required") },
        }),
      },
      {
        type: ComponentTypes.radio,
        currentValue: userData?.partner_gender,
        dataField: "partner_gender",
        formData: options?.partner_gender,
        getProps: (t) => ({
          label: t("partner2.partner_gender"),
          errorRules: { required: t("validation.required") },
        }),
      },
    ],
  }),
  availability: ({ options, userData }) => ({
    title: "availability.title",
    step: userData?.user_type === USER_TYPES.volunteer ? 7 : 6,
    totalSteps: getSteps(userData?.user_type),
    prevPage: "/partner-2",
    nextPage: "/notifications",
    components: [
      {
        type: ComponentTypes.text,
        getProps: (t) => ({ children: t("availability.description") }),
      },
      {
        type: ComponentTypes.checkboxGrid,
        currentValue: userData?.availability,
        dataField: "availability",
        formData: options?.availability,
        getProps: (t) => ({
          label: t("availability.label"),
          columnHeadings: Array(8)
            .fill()
            .map((_, index) => t(`availability.column${index + 1}`)),
          rowHeadings: Array(7)
            .fill()
            .map((_, index) => t(`availability.row${index + 1}`)),
          checkboxesByColumn: constructCheckboxes(options?.availability, t),
          preSelected: userData?.availability,
          errorRules: { required: t("validation.required") },
        }),
      },
    ],
  }),
  notifications: ({ options, userData }) => ({
    title: "notifications.title",
    step: userData?.user_type === USER_TYPES.volunteer ? 8 : 7,
    totalSteps: getSteps(userData?.user_type),
    prevPage: "/availability",
    nextPage: "/conditions",
    components: [
      {
        type: ComponentTypes.text,
        getProps: (t) => ({
          children: t("notifications.description"),
        }),
      },
      {
        type: ComponentTypes.radioWithInput,
        radioGroup: {
          currentValue: userData?.notify_channel,
          dataField: "notify_channel",
          formData: options?.notify_channel,
          textInputVal: options?.notify_channel?.[1]?.value,
        },
        textInput: {
          currentValue: userData?.phone_mobile,
          dataField: "phone_mobile",
          formData: options?.phone_mobile,
          getProps: (t) => ({
            label: t("notifications.phone_number_label"),
            type: "tel",
            width: InputWidth.Medium,
            infoText: t("notifications.info"),
          }),
          infoText: "notifications.info",
        },
      },
    ],
  }),
  conditions: ({ userData }) => ({
    title: "conditions.title",
    note: "conditions.info_text",
    step: userData?.user_type === USER_TYPES.volunteer ? 9 : 8,
    totalSteps: getSteps(userData?.user_type),
    prevPage: "/notifications",
    nextPage: "/app",
    components: [
      {
        type: ComponentTypes.textContent,
        getProps: (t) => ({
          content: [
            { type: ContentTypes.Emphasize, text: t("conditions.heading") },
            {
              type: ContentTypes.List,
              listItems: [
                t("conditions.point1"),
                t("conditions.point2"),
                t("conditions.point3"),
                t("conditions.point4"),
              ],
            },
            { type: ContentTypes.Paragraph, text: t("conditions.disclaimer") },
          ],
        }),
      },
      {
        type: ComponentTypes.checkbox,
        currentValue: userData?.liability_accepted,
        dataField: "liability_accepted",
        getProps: (t) => ({
          label: t("conditions.checkbox_label"),
          errorRules: { required: t("validation.required") },
        }),
      },
    ],
  }),
};

const getFormPage = ({ slug, formOptions, userData }) => {
  return formPages[slug]({ options: formOptions, userData });
};

export default getFormPage;
