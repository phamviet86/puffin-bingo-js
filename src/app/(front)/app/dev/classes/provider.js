// CLASSES PROVIDER

import { createContext, useContext, useMemo } from "react";
import { useAppContext } from "../../provider";
import { convertSelection } from "@/lib/util/convert-util";

const PageContext = createContext(null);

export function PageProvider({ children }) {
  const { optionData } = useAppContext();

  const enrollmentType = convertSelection(
    optionData,
    { value: "id", label: "option_label", color: "option_color" }, // Define how to map the option data
    { option_table: "enrollments", option_column: "enrollment_type_id" } // Define filtering criteria
  );

  const enrollmentPaymentType = convertSelection(
    optionData,
    { value: "id", label: "option_label", color: "option_color" }, // Define how to map the option data
    { option_table: "enrollments", option_column: "enrollment_payment_type_id" } // Define filtering criteria
  );

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      enrollmentType,
      enrollmentPaymentType,
    }),
    [enrollmentType, enrollmentPaymentType]
  );

  return (
    <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
  );
}

export function usePageContext() {
  return useContext(PageContext);
}
