// path: @/component/custom/schedules/schedules-component.js

import {
  ProTable,
  DrawerForm,
  DrawerDescriptions,
  ProDescriptions,
  FullCalendar,
} from "@/component/common";
import {
  fetchList,
  fetchGet,
  fetchPost,
  fetchPut,
  fetchDelete,
} from "@/lib/util/fetch-util";
import { VIEWS_CONFIG } from "@/component/config/calendar-config";
import { renderScheduleShort } from "@/lib/util/render-util";

export function SchedulesTable(props) {
  return (
    <ProTable
      {...props}
      onTableRequest={(params, sort, filter) =>
        fetchList("/api/schedules", params, sort, filter)
      }
    />
  );
}

export function SchedulesInfo(props) {
  return <DrawerDescriptions {...props} />;
}

export function SchedulesDesc(props) {
  return (
    <ProDescriptions
      {...props}
      onDescRequest={(params) => fetchGet(`/api/schedules/${params?.id}`)}
    />
  );
}

export function SchedulesFormCreate(props) {
  return (
    <DrawerForm
      {...props}
      onFormSubmit={(values) => fetchPost("/api/schedules", values)}
    />
  );
}

export function SchedulesFormEdit(props) {
  return (
    <DrawerForm
      {...props}
      onFormRequest={(params) => fetchGet(`/api/schedules/${params.id}`)}
      onFormSubmit={(values) => fetchPut(`/api/schedules/${values.id}`, values)}
      // enable if needed
      // onFormDelete={(params) => fetchDelete(`/api/schedules/${params.id}`)}
    />
  );
}

export function SchedulesCalendar(props) {
  return (
    <FullCalendar
      {...props}
      onCalendarRequest={(params) => fetchList("/api/schedules", params)}
      onCalendarItem={{
        id: "id",
        title: "module_name",
        startDate: "schedule_date",
        startTime: "shift_start_time",
        endDate: "schedule_date",
        endTime: "shift_end_time",
        extendedProps: {
          id: "id",
          shift_start_time: "shift_start_time",
          class_name: "class_name",
          class_code: "class_code",
          module_name: "module_name",
          schedule_status_color: "schedule_status_color",
        },
      }}
      views={{
        dayGrid: {
          eventContent: renderScheduleShort,
          ...VIEWS_CONFIG.dayGrid,
        },
        dayGridWeek: {
          eventContent: renderScheduleShort,
          ...VIEWS_CONFIG.dayGridWeek,
        },
        dayGridMonth: {
          eventContent: renderScheduleShort,
          ...VIEWS_CONFIG.dayGridMonth,
        },
      }}
    />
  );
}
