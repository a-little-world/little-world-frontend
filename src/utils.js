/*
 This is supposed to represent a tag mapping from backend to frontend,
 whenever tim adds a new option he could add the tag of that option here,
 Mike can then map this to *any* tag he desires and this would *never* require an additional change in the backend
 This mapping could also be moved to a json file
*/
export const backendStateTagMappings = {
  matching_state_not_searching_trans: "idle",
  matching_state_searching_trans: "searching",
  matching_state_found_unconfirmed_trans: "pending",
  matching_state_found_confirmed_trans: "confirmed",
};

export const getBackendTagByValueWChoices = (value, choices) => {
  return choices.find((obj) => {
    return obj.value === value;
  }).display_name;
};

export const getTagByValueWChoices = (value, choices) => {
  return backendStateTagMappings[getBackendTagByValueWChoices(value, choices)];
};

export const getBackendTagByValueWOptions = (field, value, options) => {
  return options[field].choices.find((obj) => {
    return obj.value === value;
  }).display_name;
};

export const getTagByValueWOptions = (field, value, options) => {
  return backendStateTagMappings[getBackendTagByValueWOptions(field, value, options)];
};
