// path: @/component/custom/schedules/schedules-component.js

import {
  ProTable,
  DrawerForm,
  DrawerDescriptions,
  ProDescriptions,
  FullCalendar,
  ModalTransfer,
} from "@/component/common";
import {
  fetchList,
  fetchGet,
  fetchPost,
  fetchPut,
  fetchDelete,
} from "@/lib/util/fetch-util";
import { VIEWS_CONFIG } from "@/component/config/calendar-config";
import {
  renderScheduleTag,
  renderScheduleCard,
  renderScheduleTransfer,
} from "@/lib/util/render-util";

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
  return (
    <DrawerDescriptions
      {...props}
      onDescRequest={(params) => fetchGet(`/api/schedules/${params?.id}`)}
    />
  );
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
          course_name: "course_name",
          course_code: "course_code",
          module_name: "module_name",
          room_name: "room_name",
          schedule_status_color: "schedule_status_color",
        },
      }}
      views={{
        dayGrid: {
          eventContent: renderScheduleCard,
          ...VIEWS_CONFIG.dayGrid,
        },
        dayGridWeek: {
          eventContent: renderScheduleTag,
          ...VIEWS_CONFIG.dayGridWeek,
        },
        dayGridMonth: {
          eventContent: renderScheduleTag,
          ...VIEWS_CONFIG.dayGridMonth,
        },
      }}
    />
  );
}

export function SchedulesTransfer(props) {
  return (
    <ModalTransfer
      {...props}
      onSourceRequest={(params) => fetchList(`/api/schedules`, params)}
      onSourceItem={{ key: "id" }}
      onTargetRequest={(params) => fetchList(`/api/schedules`, params)}
      onTargetItem={{
        key: "source_id",
        disabled: ["schedule_status_id", [], [23]],
      }}
      onTargetAdd={(keys) =>
        fetchPost(`/api/schedules/transfer`, { ids: keys })
      }
      onTargetRemove={(keys) =>
        fetchDelete(`/api/schedules/transfer`, { sourceIds: keys })
      }
      render={renderScheduleTransfer}
      titles={["Lịch học", "Đã sao chép"]}
      operations={["Sao chép", "Xóa"]}
      listStyle={{
        width: "100%",
        height: "100%",
        minHeight: "200px",
      }}
      modalProps={{ title: "Sao chép lịch" }}
      showSearch={false}
      searchSourceColumns={["syllabus_name_like", "module_name_like"]}
      searchTargetColumns={["syllabus_name_like", "module_name_like"]}
      locale={{
        searchPlaceholder: "Tìm kiếm...",
        itemsUnit: "buổi học",
        itemUnit: "buổi học",
        notFoundContent: "Không tìm thấy buổi học",
      }}
    />
  );
}
