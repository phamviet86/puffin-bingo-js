// path: @/component/custom/roles/roles-schema.js

import { ProForm, ProFormText, ProFormSelect } from "@ant-design/pro-form";

export function RolesColumns(params) {
  const { roleStatus } = params || {};

  return [
    {
      title: "Tên vai trò",
      dataIndex: "role_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Đường dẫn",
      dataIndex: "role_path",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Trạng thái",
      dataIndex: "role_status_id",
      valueType: "select",
      valueEnum: roleStatus?.valueEnum || {},
      sorter: { multiple: 1 },
    },
  ];
}

export function RolesFields(params) {
  const { roleStatus } = params || {};

  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="role_name"
        label="Tên vai trò"
        placeholder="Nhập tên vai trò"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="role_path"
        label="Đường dẫn"
        placeholder="Nhập đường dẫn"
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="role_status_id"
        label="Trạng thái"
        placeholder="Nhập ID trạng thái"
        rules={[{ required: true }]}
        options={roleStatus.options || []}
      />
    </ProForm.Group>
  );
}
