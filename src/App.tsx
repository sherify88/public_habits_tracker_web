import React from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Routes from "./Routes";

export const isIPhone = /iPhone/i.test(navigator.userAgent);
export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes />
    </QueryClientProvider>
  );
}

export default App;
