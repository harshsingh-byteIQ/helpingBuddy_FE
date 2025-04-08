import { useState } from 'react';
import axiosInstance from '../utils/axios';

type PostState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

function usePost<TResponse, TPayload = any>(url: string) {
  const [state, setState] = useState<PostState<TResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const postData = async (payload: TPayload) => {
    setState({ data: null, loading: true, error: null });

    try {
      const response = await axiosInstance.post<TResponse>(url, payload);
      setState({ data: response.data, loading: false, error: null });
      return response.data;
    } catch (error: any) {
      setState({
        data: null,
        loading: false,
        error: error,
      });
      throw error;
    }
  };

  return { ...state, postData };
}

export default usePost;
