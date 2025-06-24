// USERS PROVIDER

import { createContext, useContext, useMemo } from "react";
import { useAppContext } from "../../provider";
import { convertSelection } from "@/lib/util/convert-util";

const PageContext = createContext(null);

export function PageProvider({ children }) {
  // Access the option data from the AppContext
  const { optionData } = useAppContext();

  // Create a selection for user status using the option data
  const userStatus = convertSelection(
    optionData,
    { value: "id", label: "option_label", color: "option_color" },
    { option_table: "users", option_column: "user_status_id" }
  );

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      userStatus,
    }),
    [userStatus]
  );

  // Provide the context to children components
  return (
    <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
  );
}

export function usePageContext() {
  return useContext(PageContext);
}
