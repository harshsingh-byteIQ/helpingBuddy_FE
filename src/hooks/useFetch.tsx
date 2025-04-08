import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

function useFetch<T>(url: string, trigger: boolean = true) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = async () => {
    setState({ data: null, loading: true, error: null });

    try {
      const response = await axiosInstance.get<T>(url);
      setState({ data: response.data, loading: false, error: null });
    } catch (error: any) {
      setState({
        data: null,
        loading: false,
        error: error?.message || 'Something went wrong',
      });
    }
  };

  useEffect(() => {
    if (trigger) fetchData();
  }, [url, trigger]);

  return { ...state, refetch: fetchData };
}

export default useFetch;
