import { useSearchParams } from 'react-router-dom';

const useQueryParam = (param: string) => {
  const [searchParams] = useSearchParams();
  return searchParams.get(param);
};

export const useRemoveQueryParam = () => {
  const [, setSearchParams] = useSearchParams();
  return (param: string) =>
    setSearchParams(params => {
      params.delete(param);
      return params;
    }, { replace: true });
};

export default useQueryParam;
