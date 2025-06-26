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
      onSourceRequest={(params) =>
        fetchList(`/api/modules`, {
          syllabus_status_id: 7, // actived syllabus
          module_status_id: 10, // actived module
          ...params,
        })
      }
      onSourceItem={{ key: "id" }}
      onSourceSearch={["syllabus_name_like", "module_name_like"]}
      onTargetRequest={(params) =>
        fetchList(`/api/classes`, { course_id: courseId, ...params })
      }
      onTargetItem={{
        key: "module_id",
        disabled: ["class_status", [], ["Chưa có lịch"]],
      }}
      onTargetSearch={["syllabus_name_like", "module_name_like"]}
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
      listStyle={{
        width: "100%",
        height: "100%",
        minHeight: "200px",
      }}
      showSearch={true}
      modalProps={{ title: "Lộ trình" }}
    />
  );
}
