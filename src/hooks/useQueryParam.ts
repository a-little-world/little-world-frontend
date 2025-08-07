import { useSearchParams } from 'react-router-dom';

const useQueryParam = (param: string) => {
  const [searchParams] = useSearchParams();
  return searchParams.get(param);
};

export default useQueryParam;
