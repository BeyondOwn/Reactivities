'use client'
import { createContext, ReactNode, useContext, useState } from 'react';

// Define the type for loadingStates
type LoadingStates = {
  [key: number]: boolean; // Keys are numbers (card IDs), and values are booleans (loading states)
};

// Define the shape of the context
interface LoadingContextType {
  loadingStates: LoadingStates;
  setLoadingState: (id: number, isLoading: boolean) => void;
}

// Provide default values for the context
const LoadingContext = createContext<LoadingContextType>({
  loadingStates: {}, // Default state is an empty object
  setLoadingState: () => {} // Default function does nothing
});

// Custom hook to use the loading context
export const useLoading = () => useContext(LoadingContext);

// Provider component to wrap the app
export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({});

  const setLoadingState = (id: number, isLoading: boolean) => {
    setLoadingStates(prevState => ({
      ...prevState,
      [id]: isLoading
    }));
  };

  return (
    <LoadingContext.Provider value={{ loadingStates, setLoadingState }}>
      {children}
    </LoadingContext.Provider>
  );
};