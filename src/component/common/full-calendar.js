// path: @/component/common/full-calendar.js

import { useEffect, useCallback, useState, useRef } from "react";
import { message, Grid, Spin } from "antd";
import Calendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  CALENDAR_CONFIG,
  RESPONSIVE_CONFIG,
} from "@/component/config/calendar-config";
import { convertEventItems } from "@/lib/util/convert-util";

const { useBreakpoint } = Grid;

// Calendar utility functions
function formatLocalDate(year, month, day = 1) {
  const monthStr = String(month + 1).padStart(2, "0");
  const dayStr = String(day).padStart(2, "0");
  return `${year}-${monthStr}-${dayStr}T00:00:00`;
}

function getBreakpoint(screens) {
  const breakpoints = ["xxl", "xl", "lg", "md", "sm", "xs"];
  return breakpoints.find((bp) => screens[bp]) || "xs";
}

function buildCalendarDateRange(dateInfo) {
  const isMonthView = dateInfo.view?.type?.includes("Month");

  if (isMonthView) {
    // For month view, get the middle date of the view range to determine the current month
    const viewStartTime = new Date(dateInfo.start).getTime();
    const viewEndTime = new Date(dateInfo.end).getTime();
    const middleDate = new Date(
      viewStartTime + (viewEndTime - viewStartTime) / 2
    );

    // Get year and month from middle date
    const year = middleDate.getFullYear();
    const month = middleDate.getMonth();

    return {
      startDate: formatLocalDate(year, month),
      endDate: formatLocalDate(year, month + 1),
    };
  } else {
    // For non-month views, use the original date range
    return {
      startDate: dateInfo.startStr,
      endDate: dateInfo.endStr,
    };
  }
}

export function FullCalendar({
  onCalendarRequest = undefined,
  onCalendarRequestError = undefined,
  onCalendarRequestSuccess = undefined,
  onCalendarRequestParams = undefined,
  onCalendarItem = undefined,
  plugins = [],
  height = "auto",
  responsive = RESPONSIVE_CONFIG,
  headerToolbar = {
    center: "title",
    left: "prev,next today",
    right: "dayGrid,dayGridWeek,dayGridMonth",
  },
  calendarHook = {},
  ...props
}) {
  const {
    calendarRef,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    loading,
    setLoading,
  } = calendarHook;

  const [messageApi, contextHolder] = message.useMessage();
  const screens = useBreakpoint();
  const allPlugins = [dayGridPlugin, ...plugins];

  // State management: tách biệt raw data và processed events
  const [rawCalendarData, setRawCalendarData] = useState([]);
  const [processedEvents, setProcessedEvents] = useState([]);

  // Refs for reload pattern và debouncing
  const reloadDataRef = useRef();
  const datesSetTimeoutRef = useRef();

  // Process raw data thành events
  const handleProcessEvents = useCallback(() => {
    let finalEvents = [];

    if (onCalendarItem) {
      finalEvents = convertEventItems(rawCalendarData, onCalendarItem);
    } else {
      finalEvents = rawCalendarData;
    }

    setProcessedEvents(finalEvents);
  }, [rawCalendarData, onCalendarItem]);

  useEffect(() => {
    handleProcessEvents();
  }, [handleProcessEvents]);

  // Handlers
  const handleDataRequest = useCallback(async () => {
    if (!onCalendarRequest) {
      messageApi.error("Data request handler not provided");
      return;
    }

    if (!startDate || !endDate) {
      return;
    }

    try {
      const result = await onCalendarRequest(onCalendarRequestParams);
      const resultData = result.data || result || [];

      setRawCalendarData(resultData);
      onCalendarRequestSuccess?.(result);
    } catch (error) {
      messageApi.error(error?.message || "Đã xảy ra lỗi");
      onCalendarRequestError?.(error);
      setRawCalendarData([]);
    } finally {
      setLoading(false);
    }
  }, [
    onCalendarRequest,
    onCalendarRequestSuccess,
    onCalendarRequestError,
    onCalendarRequestParams,
    messageApi,
    setLoading,
    startDate,
    endDate,
  ]);

  // Reload data pattern giống Transfer
  const reloadData = useCallback(async () => {
    setLoading?.(true);
    await handleDataRequest();
  }, [handleDataRequest, setLoading]);

  // Đảm bảo luôn cập nhật ref tới hàm reloadData mới nhất
  reloadDataRef.current = reloadData;

  // Debounced handleDatesSet
  const handleDatesSet = useCallback(
    (dateInfo) => {
      if (setStartDate && setEndDate) {
        // Clear previous timeout
        if (datesSetTimeoutRef.current) {
          clearTimeout(datesSetTimeoutRef.current);
        }

        // Set new timeout with 300ms delay để debounce
        datesSetTimeoutRef.current = setTimeout(() => {
          const { startDate, endDate } = buildCalendarDateRange(dateInfo);

          setStartDate(startDate);
          setEndDate(endDate);
          setLoading?.(true);
        }, 300);
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

  // Handle data request khi dates thay đổi
  useEffect(() => {
    // Only trigger data request if not loading and both startDate/endDate are valid (not null/undefined/empty)
    if (onCalendarRequest && onCalendarRequestParams && loading) {
      handleDataRequest();
    }
  }, [handleDataRequest, onCalendarRequest, onCalendarRequestParams, loading]);

  // Return the component
  return (
    <>
      {contextHolder}
      <Spin spinning={loading} tip="Đang tải dữ liệu..." delay={500}>
        <Calendar
          {...props}
          {...CALENDAR_CONFIG}
          ref={calendarRef}
          plugins={allPlugins}
          headerToolbar={headerToolbar}
          height={height}
          datesSet={handleDatesSet}
          events={processedEvents}
          weekNumbers={true}
          navLinks={true}
        />
      </Spin>
    </>
  );
}
