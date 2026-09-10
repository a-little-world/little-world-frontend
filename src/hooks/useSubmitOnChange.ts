import { useEffect, useRef } from 'react';

import { FieldValues, UseFormWatch } from 'react-hook-form';

import { isUserFieldChange } from '../helpers/formWatch';

function useSubmitOnChange<TFieldValues extends FieldValues>(
  watch: UseFormWatch<TFieldValues>,
  onSubmit: (data: TFieldValues) => void,
) {
  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;

  useEffect(() => {
    const subscription = watch((values, info) => {
      if (!isUserFieldChange(info)) {
        return;
      }
      onSubmitRef.current(values as TFieldValues);
    });
    return () => subscription.unsubscribe();
  }, [watch]);
}

export default useSubmitOnChange;
