// path: @/component/custom/user-roles/user-roles-component.js

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

export function UserRolesTable(props) {
  return (
    <ProTable
      {...props}
      onTableRequest={(params, sort, filter) =>
        fetchList("/api/userRoles", params, sort, filter)
      }
    />
  );
}

export function UserRolesDesc(props) {
  return (
    <ProDescriptions
      {...props}
      onDescRequest={(params) => fetchGet(`/api/userRoles/${params?.id}`)}
    />
  );
}

export function UserRolesInfo(props) {
  return <DrawerInfo {...props} />;
}

export function UserRolesFormCreate(props) {
  return (
    <DrawerForm
      {...props}
      onFormSubmit={(values) => fetchPost("/api/userRoles", values)}
    />
  );
}

export function UserRolesFormEdit({ id, ...props }) {
  return (
    <DrawerForm
      {...props}
      onFormRequest={() => fetchGet(`/api/userRoles/${id}`)}
      onFormSubmit={(values) => fetchPut(`/api/userRoles/${id}`, values)}
      onFormDelete={() => fetchDelete(`/api/userRoles/${id}`)}
    />
  );
}
