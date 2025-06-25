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
      onSourceRequest={() => fetchList(`/api/modules`)}
      onTargetRequest={() => fetchList(`/api/classes`, { course_id: courseId })}
      onAddTarget={(keys) =>
        fetchPost(`/api/classes/transfer`, {
          course_id: courseId,
          moduleIds: keys,
        })
      }
      onRemoveTarget={(keys) =>
        fetchDelete(`/api/classes/transfer`, {
          course_id: courseId,
          moduleIds: keys,
        })
      }
      onSourceItem={{ key: "id" }}
      onTargetItem={{
        key: "module_id",
        disabled: ["class_status", [], ["Chưa có lịch"]],
      }}
      render={(record) => `${record.syllabus_name} - ${record.module_name}`}
      titles={["Học phần", "Đã gán"]}
      operations={["Thêm", "Xóa"]}
      listStyle={{
        width: "100%",
        height: "100%",
        minHeight: "200px",
      }}
      modalProps={{ title: "Lộ trình" }}
    />
  );
}
