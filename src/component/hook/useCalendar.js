// path: @/component/hook/useCalendar.js

import { useRef, useState } from "react";

export function useCalendar() {
  const calendarRef = useRef();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const reload = () => {
    setLoading(true);
  };

  return {
    calendarRef,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    loading,
    setLoading,
    reload,
  };
}
