import { createContext, useContext, useMemo } from "react";
import { useFetch } from "@/component/hook";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { useFetchList } = useFetch();

  // Fetch option data from the API
  const { data: optionData = [] } = useFetchList("/api/options"); // cache được khởi tạo và lưu tại đây

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      optionData,
    }),
    [optionData]
  );

  // Provide the context to children components
  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
