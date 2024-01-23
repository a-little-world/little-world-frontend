const ROOT_SERVER_ERROR = 'root.serverError';

export const onFormError = ({ e, formFields, setError, t }) => {
  const cause = Object.keys(formFields).includes(e.cause)
    ? e.cause
    : ROOT_SERVER_ERROR;

  if (e.message) {
    setError(
      cause,
      { type: 'custom', message: t(e.message) },
      { shouldFocus: true },
    );
  } else {
    setError(cause, {
      type: 'custom',
      message: t(e.message) || t('validation.generic_try_again'),
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
