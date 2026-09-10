export type FieldChangeInfo = {
  name?: PropertyKey;
  type?: string;
};

/**
 * react-hook-form's watch(callback) also fires for internal form-state updates
 * (isSubmitting, errors, …). Calling handleSubmit from that callback makes the
 * two bounce off each other until Maximum call stack size exceeded.
 */
export function isUserFieldChange(info?: FieldChangeInfo): boolean {
  return info?.type === 'change' && info.name != null && info.name !== '';
}
