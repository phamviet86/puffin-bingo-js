// path: @/component/custom/enrollments/enrollments-component.js

import {
  ProTable,
  DrawerForm,
  DrawerDescriptions,
  ProDescriptions,
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
      onFormDelete={(params) => fetchDelete(`/api/enrollments/${params.id}`)}
    />
  );
}
