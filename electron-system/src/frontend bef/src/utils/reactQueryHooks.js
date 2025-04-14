import React from 'react';
// import { toast } from 'react-toastify';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export function useQueryCustom({ name, url, params, onSuccess, enabled, ...other }) {
  const toastId = React.useRef(null);

  return useQuery([name, params || { limit: 5, page: 1 }], url, {
    onSuccess,
    enabled: enabled,
    ...other,
  });
}

export function useMutationCustom({ name, url, onSuccess, invalidQuery, invalidQueries, ...other }) {
  const queryClient = useQueryClient();

  return useMutation(name, url, {
    onSuccess: (data) => {
      if (invalidQueries) invalidQueries?.map((x) => queryClient.invalidateQueries(x));
      else if (invalidQuery) queryClient.invalidateQueries(invalidQuery);
      onSuccess?.(data);
    },
    // onSettled: () => {
    //   if (invalidQueries) invalidQueries?.map((x) => queryClient.invalidateQueries(x));
    //   else if (invalidQuery) queryClient.invalidateQueries(invalidQuery);
    // },
    ...other,
  });
}
