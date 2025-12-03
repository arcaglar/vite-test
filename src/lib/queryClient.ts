import { QueryClient } from '@tanstack/react-query';

const onError = (error: Error) => {
  if (import.meta.env.DEV) {
    console.error('React Query Error:', error);
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes('404')) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      throwOnError: false,
    },
    mutations: {
      onError,
      retry: false,
    },
  },
});
