// path: @/component/custom/user-roles/user-roles-schema.js

import { ProForm, ProFormText, ProFormSelect } from "@ant-design/pro-form";

export function UserRolesColumns(params) {
  const { users, roles } = params || {};

  return [
    {
      title: "Người dùng",
      dataIndex: "user_id",
      valueType: "select",
      valueEnum: users?.valueEnum || {},
      sorter: { multiple: 1 },
    },
    {
      title: "Vai trò",
      dataIndex: "role_id",
      valueType: "select",
      valueEnum: roles?.valueEnum || {},
      sorter: { multiple: 1 },
    },
  ];
}

export function UserRolesFields(params) {
  const { users, roles } = params || {};

  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormSelect
        name="user_id"
        label="Người dùng"
        placeholder="Chọn người dùng"
        rules={[{ required: true }]}
        options={users?.options || []}
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormSelect
        name="role_id"
        label="Vai trò"
        placeholder="Chọn vai trò"
        rules={[{ required: true }]}
        options={roles?.options || []}
        colProps={{ xs: 24, sm: 12 }}
      />
    </ProForm.Group>
  );
}
