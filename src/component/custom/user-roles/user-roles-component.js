// path: @/component/custom/user-roles/user-roles-component.js

import {
  ProTable,
  DrawerForm,
  DrawerInfo,
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

export function UserRolesTable(props) {
  return (
    <ProTable
      {...props}
      onTableRequest={(params, sort, filter) =>
        fetchList("/api/user-roles", params, sort, filter)
      }
    />
  );
}

export function UserRolesDesc(props) {
  return (
    <ProDescriptions
      {...props}
      onDescRequest={(params) => fetchGet(`/api/user-roles/${params?.id}`)}
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
      onFormSubmit={(values) => fetchPost("/api/user-roles", values)}
    />
  );
}

export function UserRolesFormEdit({ id, ...props }) {
  return (
    <DrawerForm
      {...props}
      onFormRequest={() => fetchGet(`/api/user-roles/${id}`)}
      onFormSubmit={(values) => fetchPut(`/api/user-roles/${id}`, values)}
      onFormDelete={() => fetchDelete(`/api/user-roles/${id}`)}
    />
  );
}

export function UserRolesTransfer({ userId, ...props }) {
  return (
    <ModalTransfer
      {...props}
      onSourceRequest={() => fetchList(`/api/roles`)}
      onSourceItem={{ key: "id", title: "role_name" }}
      onTargetRequest={() => fetchList(`/api/user-roles`, { user_id: userId })}
      onTargetItem={{ key: "role_id", title: "role_name" }}
      onAddTarget={(keys) =>
        fetchPost(`/api/user-roles/transfer`, {
          user_id: userId,
          roleIds: keys,
        })
      }
      onRemoveTarget={(keys) =>
        fetchDelete(`/api/user-roles/transfer`, {
          user_id: userId,
          roleIds: keys,
        })
      }
      titles={["Vai trò", "Đã gán"]}
      operations={["Thêm quyền", "Xóa quyền"]}
      listStyle={{
        width: "100%",
        height: "100%",
        minHeight: "200px",
      }}
      modalProps={{ title: "Phân quyền" }}
    />
  );
}
