// path: @/components/common/full-calendar.js

import { useEffect, useCallback } from "react";
import { message, Grid } from "antd";
import Calendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  CALENDAR_CONFIG,
  RESPONSIVE_CONFIG,
} from "@/component/config/calendar-config";
import { convertEventItems } from "@/lib/util/convert-util";

const { useBreakpoint } = Grid;

function getBreakpoint(screens) {
  const breakpoints = ["xxl", "xl", "lg", "md", "sm", "xs"];
  return breakpoints.find((bp) => screens[bp]) || "xs";
}

export function FullCalendar({
  onDataRequest = undefined,
  onDataRequestError = undefined,
  onDataRequestSuccess = undefined,
  onDataItem = undefined,
  plugins = [],
  height = "auto",
  responsive = RESPONSIVE_CONFIG,
  headerToolbar = {
    center: "title",
    left: "prev,next today",
    right: "dayGrid,dayGridWeek,dayGridMonth",
  },
  params = {},
  calendarHook = {},
  ...props
}) {
  const {
    calendarRef,
    setStartDate,
    setEndDate,
    startDate,
    endDate,
    loading,
    setLoading,
    calendarEvents,
    setCalendarEvents,
  } = calendarHook;
  const [messageApi, contextHolder] = message.useMessage();
  const screens = useBreakpoint();
  const allPlugins = [dayGridPlugin, ...plugins];

  // Handlers
  const handleDataRequest = useCallback(
    async (requestParams = {}) => {
      if (!onDataRequest) {
        messageApi.error("Data request handler not provided");
        return;
      }

      if (!startDate || !endDate) {
        messageApi.error("Start date and end date must be set");
        return;
      }

      try {
        const result = await onDataRequest(requestParams);
        let finalEvents = [];

        if (onDataItem) {
          finalEvents = convertEventItems(result.data || [], onDataItem);
        } else {
          finalEvents = result.data || result || [];
        }

        setCalendarEvents(finalEvents);
        onDataRequestSuccess?.(result);
      } catch (error) {
        messageApi.error(error?.message || "Đã xảy ra lỗi");
        onDataRequestError?.(error);
        setCalendarEvents([]);
      } finally {
        setLoading(false);
      }
    },
    [
      onDataRequest,
      onDataRequestSuccess,
      onDataRequestError,
      onDataItem,
      messageApi,
      setLoading,
      setCalendarEvents,
      startDate,
      endDate,
    ]
  );

  const handleDatesSet = useCallback(
    (dateInfo) => {
      if (setStartDate && setEndDate) {
        setStartDate(dateInfo.startStr);
        setEndDate(dateInfo.endStr);
        setLoading(true);
      }
    },
    [setStartDate, setEndDate, setLoading]
  );

  const handleView = useCallback(
    (viewName) => {
      const api = calendarRef.current && calendarRef.current.getApi();
      if (api && viewName) {
        const currentView = api.view.type;
        // Only change view if it's different from current view
        if (currentView !== viewName) {
          api.changeView(viewName);
        }
      }
    },
    [calendarRef]
  );

  // set view at components mounting base on screen size
  useEffect(() => {
    const breakpoint = getBreakpoint(screens);
    const viewName = responsive[breakpoint] || "dayGridMonth";

    // Defer view change to avoid flushSync error during render
    setTimeout(() => {
      handleView(viewName);
    }, 0);
  }, [screens, responsive, handleView]);

  // Handle data request on component mount and when dates or loading state change
  useEffect(() => {
    if (onDataRequest && startDate && endDate && loading) {
      // Process params here, removing current and pageSize
      const { current, pageSize, ...processedParams } = params;

      handleDataRequest(processedParams);
    }
  }, [handleDataRequest, onDataRequest, startDate, endDate, loading, params]);

  // Return the component
  return (
    <>
      {contextHolder}
      <Calendar
        {...props}
        {...CALENDAR_CONFIG}
        ref={calendarRef}
        plugins={allPlugins}
        headerToolbar={headerToolbar}
        height={height}
        datesSet={handleDatesSet}
        events={calendarEvents}
        weekNumbers={true}
        navLinks={true}
      />
    </>
  );
}
