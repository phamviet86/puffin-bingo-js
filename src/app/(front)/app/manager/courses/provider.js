// COURSES PROVIDER

import { createContext, useContext, useMemo } from "react";
// import { useAppContext } from "../../provider";
// import { convertSelection } from "@/lib/util/convert-util";

const PageContext = createContext(null);

export function PageProvider({ children }) {
  // Access the option data from the AppContext
  // const { optionData } = useAppContext(); // sử dụng lại dữ liệu có trong cache

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(() => ({}), []);

  // Provide the context to children components
  return (
    <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
  );
}

export function usePageContext() {
  return useContext(PageContext);
}
