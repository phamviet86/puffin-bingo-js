// path: @/component/hook/useCalendar.js

import { useRef, useState } from "react";

export function useCalendar() {
  const calendarRef = useRef();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState([]);

  const reload = () => {
    setLoading(true);
  };

  return {
    calendarRef,
    reload,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    loading,
    setLoading,
    calendarEvents,
    setCalendarEvents,
  };
}
