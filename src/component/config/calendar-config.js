// path: @/component/config/calendar-config.js

import viLocale from "@fullcalendar/core/locales/vi";

const LICENSE_KEY = process.env.SCHEDULER_LICENSE_KEY;

export const CALENDAR_CONFIG = {
  schedulerLicenseKey: LICENSE_KEY,
  locale: viLocale,
  timeZone: "Asia/Ho_Chi_Minh",
  eventDisplay: "block",
  eventBackgroundColor: "transparent",
  eventBorderColor: "transparent",
  firstDay: 7,
  titleFormat: { year: "numeric", month: "short", day: "2-digit" },
  eventTimeFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
  buttonText: {
    today: "Hôm nay",
    dayGrid: "Ngày",
    dayGridWeek: "Tuần",
    dayGridMonth: "Tháng",
  },
};

export const RESPONSIVE_CONFIG = {
  xs: "dayGrid",
  sm: "dayGrid",
  md: "dayGrid",
  lg: "dayGridWeek",
  xl: "dayGridMonth",
  xxl: "dayGridMonth",
};

export const VIEWS_CONFIG = {
  dayGrid: {
    dayHeaderFormat: {
      weekday: "long",
      day: "numeric",
      month: "numeric",
      omitCommas: true,
    },
  },
  dayGridWeek: {
    dayHeaderFormat: {
      weekday: "short",
      day: "numeric",
      month: "numeric",
      omitCommas: true,
    },
    weekNumbers: true,
  },
  dayGridMonth: {
    dayHeaderFormat: {
      weekday: "short",
    },
    weekNumbers: true,
  },
};
