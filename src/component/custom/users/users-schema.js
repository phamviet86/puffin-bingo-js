// path: @/component/custom/users/users-schema.js

import {
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
} from "@ant-design/pro-form";

export function UsersColumns(params) {
  const { userStatus } = params || {};

  return [
    {
      title: "Tên người dùng",
      dataIndex: "user_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Mô tả",
      dataIndex: "user_desc",
      valueType: "text",
      sorter: { multiple: 1 },
      hidden: true,
    },
    {
      title: "Email",
      dataIndex: "user_email",
      valueType: "text",
      sorter: { multiple: 1 },
      responsive: ["md"],
    },
    {
      title: "Trạng thái",
      dataIndex: "user_status_id",
      valueType: "select",
      valueEnum: userStatus?.valueEnum || {},
      sorter: { multiple: 1 },
    },
    {
      title: "Số điện thoại",
      dataIndex: "user_phone",
      valueType: "text",
      sorter: { multiple: 1 },
      responsive: ["lg"],
    },
    {
      title: "SĐT phụ huynh",
      dataIndex: "user_parent_phone",
      valueType: "text",
      sorter: { multiple: 1 },
      responsive: ["lg"],
    },
    {
      title: "Ghi chú",
      dataIndex: "user_notes",
      valueType: "textarea",
      sorter: { multiple: 1 },
      hidden: true,
      search: false,
    },
    {
      title: "Vai trò",
      dataIndex: "role_names",
      valueType: "textarea",
      sorter: { multiple: 1 },
    },
  ];
}

export function UsersFields(params) {
  const { userStatus } = params || {};

  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="user_email"
        label="Email"
        placeholder="Nhập email"
        rules={[{ required: true }, { type: "email" }]}
        // colProps={{ sm: 12 }}
      />
      <ProFormSelect
        name="user_status_id"
        label="Trạng thái"
        placeholder="Chọn trạng thái"
        rules={[{ required: true }]}
        options={userStatus?.options || []}
        // colProps={{ sm: 12 }}
      />
      <ProFormText
        name="user_name"
        label="Tên người dùng"
        placeholder="Nhập tên người dùng"
        rules={[{ required: true }]}
        // colProps={{ sm: 12 }}
      />
      <ProFormText
        name="user_desc"
        label="Mô tả"
        placeholder="Nhập mô tả"
        // colProps={{ sm: 12 }}
      />
      <ProFormText
        name="user_phone"
        label="Số điện thoại"
        placeholder="Nhập số điện thoại"
        colProps={{ sm: 12 }}
      />
      <ProFormText
        name="user_parent_phone"
        label="SĐT phụ huynh"
        placeholder="Nhập số điện thoại phụ huynh"
        colProps={{ sm: 12 }}
      />
      <ProFormTextArea
        name="user_avatar"
        label="Ảnh đại diện"
        placeholder="Nhập đường dẫn ảnh đại diện"
        fieldProps={{ autoSize: { minRows: 1, maxRows: 3 } }}
      />
      <ProFormTextArea
        name="user_notes"
        label="Ghi chú"
        placeholder="Nhập ghi chú"
        fieldProps={{ autoSize: { minRows: 3, maxRows: 6 } }}
      />
    </ProForm.Group>
  );
}
