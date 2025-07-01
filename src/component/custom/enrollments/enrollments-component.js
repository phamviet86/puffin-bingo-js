// path: @/component/custom/enrollments/enrollments-component.js

import {
  ProTable,
  DrawerForm,
  DrawerDescriptions,
  ProDescriptions,
  ModalTransfer,
} from "@/component/common";
import {
  fetchList,
  fetchPost,
  fetchGet,
  fetchPut,
  fetchDelete,
} from "@/lib/util/fetch-util";

export function EnrollmentsTable(props) {
  return (
    <ProTable
      {...props}
      onTableRequest={(params, sort, filter) =>
        fetchList("/api/enrollments", params, sort, filter)
      }
    />
  );
}

export function EnrollmentsDesc(props) {
  return (
    <ProDescriptions
      {...props}
      onDescRequest={(params) => fetchGet(`/api/enrollments/${params?.id}`)}
    />
  );
}

export function EnrollmentsInfo(props) {
  return <DrawerDescriptions {...props} />;
}

export function EnrollmentsFormCreate(props) {
  return (
    <DrawerForm
      {...props}
      onFormSubmit={(values) => fetchPost("/api/enrollments", values)}
    />
  );
}

export function EnrollmentsFormEdit(props) {
  return (
    <DrawerForm
      {...props}
      onFormRequest={(params) => fetchGet(`/api/enrollments/${params.id}`)}
      onFormSubmit={(values) =>
        fetchPut(`/api/enrollments/${values.id}`, values)
      }
    />
  );
}

export function EnrollmentsTransferByClass({
  classId,
  enrollmentTypeId,
  enrollmentPaymentAmount,
  ...props
}) {
  return (
    <ModalTransfer
      {...props}
      onSourceRequest={(params) => fetchList(`/api/users`, params)}
      onSourceItem={{ key: "id" }}
      searchSourceColumns={[
        "user_name_like",
        "user_email_like",
        "user_phone_like",
        "user_parent_phone_like",
      ]}
      onTargetRequest={(params) => fetchList(`/api/enrollments`, params)}
      onTargetItem={{
        key: "user_id",
        disabled: ["enrollment_status", [], ["Thiếu ngày", "Đã xếp lớp"]],
      }}
      searchTargetColumns={[
        "user_name_like",
        "user_email_like",
        "user_phone_like",
        "user_parent_phone_like",
      ]}
      onTargetAdd={(keys) =>
        fetchPost(`/api/enrollments/class-transfer`, {
          class_id: classId,
          enrollment_type_id: enrollmentTypeId,
          enrollment_payment_amount:
            enrollmentTypeId === 20 ? enrollmentPaymentAmount : 0,
          userIds: keys,
        })
      }
      onTargetRemove={(keys) =>
        fetchDelete(`/api/enrollments/class-transfer`, {
          class_id: classId,
          enrollment_type_id: enrollmentTypeId,
          userIds: keys,
        })
      }
      render={(record) => `${record.user_name} - ${record.user_email}`}
      titles={["Người dùng", "Đã xếp lớp"]}
      operations={["Thêm", "Xóa"]}
      showSearch={true}
      locale={{
        searchPlaceholder: "Tìm kiếm...",
        itemsUnit: "người dùng",
        itemUnit: "người dùng",
        notFoundContent: "Không tìm thấy người dùng",
      }}
    />
  );
}
