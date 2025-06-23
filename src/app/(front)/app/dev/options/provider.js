import { createContext, useContext, useMemo } from "react";
import { useAppContext } from "../../provider";
import { setSelection } from "@/lib/util/convert-util";

const PageContext = createContext(null);

export function PageProvider({ children }) {
  // Access the option data from the AppContext
  const { optionData } = useAppContext(); // sử dụng lại dữ liệu có trong cache

  // Create a selection for course status using the option data
  const courseStatus = setSelection(
    optionData,
    { value: "id", label: "option_label", color: "option_color" }, // Define how to map the option data
    { option_table: "courses", option_column: "course_status_id" } // Define filtering criteria
  );

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      courseStatus,
    }),
    [courseStatus]
  );

  // Provide the context to children components
  return (
    <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
  );
}

export function usePageContext() {
  return useContext(PageContext);
}
