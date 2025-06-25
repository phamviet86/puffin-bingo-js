// path: @/component/custom/shifts/shifts-component.js

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

export function ShiftsTable(props) {
  return (
    <ProTable
      {...props}
      onTableRequest={(params, sort, filter) =>
        fetchList("/api/shifts", params, sort, filter)
      }
    />
  );
}

export function ShiftsDesc(props) {
  return (
    <ProDescriptions
      {...props}
      onDescRequest={(params) => fetchGet(`/api/shifts/${params?.id}`)}
    />
  );
}

export function ShiftsInfo(props) {
  return <DrawerDescriptions {...props} />;
}

export function ShiftsFormCreate(props) {
  return (
    <DrawerForm
      {...props}
      onFormSubmit={(values) => fetchPost("/api/shifts", values)}
    />
  );
}

export function ShiftsFormEdit(props) {
  return (
    <DrawerForm
      {...props}
      onFormRequest={(params) => fetchGet(`/api/shifts/${params.id}`)}
      onFormSubmit={(values) => fetchPut(`/api/shifts/${values.id}`, values)}
      // onFormDelete={(params) => fetchDelete(`/api/shifts/${params.id}`)}
    />
  );
}
