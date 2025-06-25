// CLASSES PROVIDER

import { createContext, useContext, useMemo } from "react";
import { useAppContext } from "../../provider";
// import { convertSelection } from "@/lib/util/convert-util";

const PageContext = createContext(null);

export function PageProvider({ children }) {
  // const { optionData } = useAppContext();

  const contextValue = useMemo(() => ({}), []);

  return (
    <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
  );
}

export function usePageContext() {
  return useContext(PageContext);
}
