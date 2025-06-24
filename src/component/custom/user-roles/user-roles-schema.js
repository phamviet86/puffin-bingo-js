// path: @/component/custom/user-roles/user-roles-schema.js

export function UserRolesColumns() {
  return [
    {
      title: "Vai trò",
      dataIndex: "role_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
  ];
}
