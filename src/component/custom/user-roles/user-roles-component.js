// path: @/component/custom/user-roles/user-roles-component.js

import { ProTable, ModalTransfer } from "@/component/common";
import { fetchList, fetchPost, fetchDelete } from "@/lib/util/fetch-util";

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

export function UserRolesTransfer({ userId, ...props }) {
  return (
    <ModalTransfer
      {...props}
      onSourceRequest={() => fetchList(`/api/roles`)}
      onTargetRequest={() => fetchList(`/api/user-roles`, { user_id: userId })}
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
      onSourceItem={{ key: "id", title: "role_name" }}
      onTargetItem={{ key: "role_id", title: "role_name" }}
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
