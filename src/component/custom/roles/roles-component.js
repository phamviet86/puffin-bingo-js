// path: @/component/custom/roles/roles-component.js

import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
} from "@/component/common";
import {
  fetchList,
  fetchPost,
  fetchGet,
  fetchPut,
  fetchDelete,
} from "@/lib/util/fetch-util";

export function RolesTable(props) {
  return (
    <ProTable
      {...props}
      onTableRequest={(params, sort, filter) =>
        fetchList("/api/roles", params, sort, filter)
      }
    />
  );
}

export function RolesDesc(props) {
  return (
    <ProDescriptions
      {...props}
      onDescRequest={(params) => fetchGet(`/api/roles/${params?.id}`)}
    />
  );
}

export function RolesInfo(props) {
  return <DrawerInfo {...props} />;
}

export function RolesFormCreate(props) {
  return (
    <DrawerForm
      {...props}
      onFormSubmit={(values) => fetchPost("/api/roles", values)}
    />
  );
}

export function RolesFormEdit(props) {
  return (
    <DrawerForm
      {...props}
      onFormRequest={(params) => fetchGet(`/api/roles/${params.id}`)}
      onFormSubmit={(values) => fetchPut(`/api/roles/${values.id}`, values)}
      onFormDelete={(params) => fetchDelete(`/api/roles/${params.id}`)}
    />
  );
}
