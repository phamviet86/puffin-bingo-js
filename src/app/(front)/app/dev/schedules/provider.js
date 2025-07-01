// SCHEDULES PROVIDER

import { createContext, useContext, useMemo } from "react";
import { useAppContext } from "../../provider";
import { convertSelection } from "@/lib/util/convert-util";
import { useFetch } from "@/component/hook";

const PageContext = createContext(null);

export function PageProvider({ children }) {
  const { optionData } = useAppContext();

  // Example: create selection for schedule_status_id
  const scheduleStatus = convertSelection(
    optionData,
    { value: "id", label: "option_label", color: "option_color" },
    { option_table: "schedules", option_column: "schedule_status_id" }
  );

  // Fetch shifts data from the API
  const { useFetchList } = useFetch();
  const { data: shiftData = [] } = useFetchList("/api/shifts");
  const shiftSelection = convertSelection(shiftData, {
    value: "id",
    label: "shift_name",
  });

  // Fetch rooms data from the API
  const { data: roomData = [] } = useFetchList("/api/rooms");
  const roomSelection = convertSelection(roomData, {
    value: "id",
    label: "room_name",
  });

  const contextValue = useMemo(
    () => ({
      scheduleStatus,
      shiftSelection,
      roomSelection,
    }),
    [scheduleStatus, shiftSelection, roomSelection]
  );

  return (
    <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
  );
}

export function usePageContext() {
  return useContext(PageContext);
}
