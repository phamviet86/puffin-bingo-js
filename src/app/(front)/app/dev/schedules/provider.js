// SCHEDULES PROVIDER

import { createContext, useContext, useMemo } from "react";
import { useAppContext } from "../../provider";
import { convertSelection } from "@/lib/util/convert-util";

const PageContext = createContext(null);

export function PageProvider({ children }) {
  const { optionData } = useAppContext();

  // Example: create selection for schedule_status_id
  const scheduleStatus = convertSelection(
    optionData,
    { value: "id", label: "option_label", color: "option_color" },
    { option_table: "schedules", option_column: "schedule_status_id" }
  );

  // Foreign key selections (class_id, shift_id, lecture_id, room_id)
  const classSelection = convertSelection(
    optionData,
    { value: "id", label: "option_label" },
    { option_table: "classes", option_column: "id" }
  );
  const shiftSelection = convertSelection(
    optionData,
    { value: "id", label: "option_label" },
    { option_table: "shifts", option_column: "id" }
  );
  const lectureSelection = convertSelection(
    optionData,
    { value: "id", label: "option_label" },
    { option_table: "lectures", option_column: "id" }
  );
  const roomSelection = convertSelection(
    optionData,
    { value: "id", label: "option_label" },
    { option_table: "rooms", option_column: "id" }
  );

  const contextValue = useMemo(
    () => ({
      scheduleStatus,
      classSelection,
      shiftSelection,
      lectureSelection,
      roomSelection,
    }),
    [
      scheduleStatus,
      classSelection,
      shiftSelection,
      lectureSelection,
      roomSelection,
    ]
  );

  return (
    <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
  );
}

export function usePageContext() {
  return useContext(PageContext);
}
