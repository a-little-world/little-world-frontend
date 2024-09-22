const ROOT_SERVER_ERROR = 'root.serverError';
const TRY_AGAIN_ERROR = 'validation.generic_try_again';

export const onFormError = ({ e, formFields, setError }) => {
  const cause = Object.keys(formFields).includes(e.cause) ?
    e.cause :
    ROOT_SERVER_ERROR;

  if (e.message) {
    setError(
      cause,
      { type: 'custom', message: e.message },
      { shouldFocus: true },
    );
  } else {
    setError(cause, {
      type: 'custom',
      message: e.message || TRY_AGAIN_ERROR,
    });
  }
};

export const registerInput = ({ register, name, options }) => {
  const { ref, ...rest } = register(name, options);

  return {
    ...rest,
    inputRef: ref,
  };
};

export const formatMultiSelectionOptions = ({ data, t }) =>
  data?.map(item => ({ ...item, tag: t(item.tag) }));
