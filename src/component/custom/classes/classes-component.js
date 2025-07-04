// path: @/component/custom/classes/classes-component.js

import {
  ProTable,
  DrawerForm,
  DrawerDescriptions,
  ProDescriptions,
  ModalTransfer,
} from "@/component/common";
import {
  fetchList,
  fetchGet,
  fetchPost,
  fetchPut,
  fetchDelete,
} from "@/lib/util/fetch-util";

export function ClassesTable(props) {
  return (
    <ProTable
      {...props}
      onTableRequest={(params, sort, filter) =>
        fetchList("/api/classes", params, sort, filter)
      }
    />
  );
}

export function ClassesInfo(props) {
  return <DrawerDescriptions {...props} />;
}

export function ClassesDesc(props) {
  return (
    <ProDescriptions
      {...props}
      onDescRequest={(params) => fetchGet(`/api/classes/${params?.id}`)}
    />
  );
}

export function ClassesFormCreate(props) {
  return (
    <DrawerForm
      {...props}
      onFormSubmit={(values) => fetchPost("/api/classes", values)}
    />
  );
}

export function ClassesFormEdit(props) {
  return (
    <DrawerForm
      {...props}
      onFormRequest={(params) => fetchGet(`/api/classes/${params.id}`)}
      onFormSubmit={(values) => fetchPut(`/api/classes/${values.id}`, values)}
      // onFormDelete={(params) => fetchDelete(`/api/classes/${params.id}`)}
    />
  );
}

export function ClassesTransfer({ courseId, ...props }) {
  return (
    <ModalTransfer
      {...props}
      onSourceRequest={(params) => fetchList(`/api/modules`, params)}
      onSourceItem={{ key: "id" }}
      searchSourceColumns={["syllabus_name_like", "module_name_like"]}
      onTargetRequest={(params) => fetchList(`/api/classes`, params)}
      onTargetItem={{
        key: "module_id",
        disabled: ["class_status", [], ["Chưa có lịch"]],
      }}
      searchTargetColumns={["syllabus_name_like", "module_name_like"]}
      onTargetAdd={(keys) =>
        fetchPost(`/api/classes/transfer`, {
          course_id: courseId,
          moduleIds: keys,
        })
      }
      onTargetRemove={(keys) =>
        fetchDelete(`/api/classes/transfer`, {
          course_id: courseId,
          moduleIds: keys,
        })
      }
      render={(record) => `${record.syllabus_name} - ${record.module_name}`}
      titles={["Học phần", "Đã gán"]}
      operations={["Thêm", "Xóa"]}
      modalProps={{ title: "Lộ trình học" }}
      showSearch={true}
      locale={{
        searchPlaceholder: "Tìm kiếm...",
        itemsUnit: "học phần",
        itemUnit: "học phần",
        notFoundContent: "Không tìm thấy học phần",
      }}
    />
  );
}

export function ScheduleClassesTable({ dateRange, ...props }) {
  const { startDate, endDate } = dateRange || {};

  return (
    <ProTable
      {...props}
      onTableRequest={
        startDate && endDate
          ? (params, sort, filter) =>
              fetchList(
                `/api/classes/${startDate}/${endDate}`,
                params,
                sort,
                filter
              )
          : undefined
      }
      onTableRequestParams={{
        class_start_date_lt: endDate,
        or: {
          class_end_date_gte: startDate,
          class_end_date_null: true,
        },
      }}
    />
  );
}
