// path: @/component/custom/users/users-component.js

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

export function UsersTable(props) {
  return (
    <ProTable
      {...props}
      onTableRequest={(params, sort, filter) =>
        fetchList("/api/users", params, sort, filter)
      }
    />
  );
}

export function UsersDesc(props) {
  return (
    <ProDescriptions
      {...props}
      onDescRequest={(params) => fetchGet(`/api/users/${params?.id}`)}
    />
  );
}

export function UsersInfo(props) {
  return <DrawerDescriptions {...props} />;
}

export function UsersFormCreate(props) {
  return (
    <DrawerForm
      {...props}
      onFormSubmit={(values) => fetchPost("/api/users", values)}
    />
  );
}

export function UsersFormEdit(props) {
  return (
    <DrawerForm
      {...props}
      onFormRequest={(params) => fetchGet(`/api/users/${params.id}`)}
      onFormSubmit={(values) => fetchPut(`/api/users/${values.id}`, values)}
      // onFormDelete={(params) => fetchDelete(`/api/users/${params.id}`)}
    />
  );
}
