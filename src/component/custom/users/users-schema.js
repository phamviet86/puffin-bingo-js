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
      title: "Email",
      dataIndex: "user_email",
      valueType: "text",
      sorter: { multiple: 1 },
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
      responsive: ["md"],
    },
    {
      title: "SĐT phụ huynh",
      dataIndex: "user_parent_phone",
      valueType: "text",
      sorter: { multiple: 1 },
      responsive: ["lg"],
    },
    {
      title: "Mô tả",
      dataIndex: "user_desc",
      valueType: "text",
      sorter: { multiple: 1 },
      responsive: ["lg"],
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
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormSelect
        name="user_status_id"
        label="Trạng thái"
        placeholder="Chọn trạng thái"
        rules={[{ required: true }]}
        options={userStatus?.options || []}
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormText
        name="user_name"
        label="Tên người dùng"
        placeholder="Nhập tên người dùng"
        rules={[{ required: true }]}
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormText
        name="user_desc"
        label="Mô tả"
        placeholder="Nhập mô tả"
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormText
        name="user_phone"
        label="Số điện thoại"
        placeholder="Nhập số điện thoại"
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormText
        name="user_parent_phone"
        label="SĐT phụ huynh"
        placeholder="Nhập số điện thoại phụ huynh"
        colProps={{ xs: 24, sm: 12 }}
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
