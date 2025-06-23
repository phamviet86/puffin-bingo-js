---
mode: "edit"
description: "Tạo schema và component files hoàn chỉnh cho hệ thống CRUD Ant Design Pro từ định nghĩa SQL table"
---

## Yêu cầu

- Tạo 2 files cho mỗi table:
  - Schema file: Định nghĩa columns và form fields
  - Component file: Các components CRUD (Table, Form, Info)

## 1. Schema File Requirements

- Đường dẫn và cấu trúc

  - File: `/src/component/custom/{tableName}/{tableName}-schema.js`
  - **Bắt buộc**: Thêm comment đường dẫn ở đầu file: `// path: @/component/custom/{tableName}/{tableName}-schema.js`
  - Export 2 functions: `{TableName}Columns` và `{TableName}Fields`

- Mapping SQL data types

  - VARCHAR → `ProFormText` với `valueType: "text"`
  - TEXT → `ProFormTextArea` với `valueType: "textarea"` và `fieldProps={{ autoSize: { minRows: 3, maxRows: 6 } }}`
  - INT/SERIAL → `ProFormText` (không dùng ProFormDigit)
  - TIMESTAMPTZ → `ProFormDatePicker`
  - TIME → `ProFormTimePicker`

- Validation và cấu hình

  - NOT NULL → `rules={[{ required: true }]}`
  - Tất cả columns (trừ ID): `sorter: { multiple: 1 }`
  - Ẩn system fields: `id`, `created_at`, `updated_at`, `deleted_at`

- Form structure
  - Wrap fields trong `<ProForm.Group>...</ProForm.Group>`
  - ID field: `hidden disabled`

## 2. Component File Requirements

- Đường dẫn và cấu trúc

  - File: `/src/component/custom/{tableName}/{tableName}-component.js`
  - **Bắt buộc**: Thêm comment đường dẫn ở đầu file: `// path: @/component/custom/{tableName}/{tableName}-component.js`
  - Export 5 functions: `{TableName}Table`, `{TableName}Desc`, `{TableName}Info`, `{TableName}FormCreate`, `{TableName}FormEdit`

- Import statements cố định

```javascript
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
```

- Component patterns

  - Table: Sử dụng `ProTable` với `onTableRequest` callback
  - Desc: Sử dụng `ProDescriptions` với `onDescRequest` callback
  - Info: Sử dụng `DrawerInfo` làm wrapper
  - FormCreate: Sử dụng `DrawerForm` với `onFormSubmit` callback
  - FormEdit: Sử dụng `DrawerForm` với `onFormRequest`, `onFormSubmit`, và `onFormDelete` callbacks
  - Props spreading: Tất cả components phải spread `{...props}`

- API endpoint format
  - Pattern: `/api/{tableName}` với tableName camelCase
  - Ví dụ: bảng "user_profiles" → endpoint "/api/userProfiles"

## 3. Naming Conventions

- Functions: PascalCase + suffix (VD: `OptionsColumns`, `OptionsFields`, `OptionsTable`)
- File names: kebab-case (VD: `options-schema.js`, `options-component.js`)
- Labels: chuyển snake_case thành Title Case tiếng Việt
- Placeholders: "Nhập..." cho input, "Chọn..." cho selection

## 4. Workflow Implementation

- Bước 1: Tạo Schema File

  - Parse SQL table definition
  - Map SQL columns theo quy tắc data types
  - Tạo `{TableName}Columns` function với sorter và valueType
  - Tạo `{TableName}Fields` function với validation rules

- Bước 2: Tạo Component File

  - Tạo `{TableName}Table` với ProTable và API endpoint
  - Tạo `{TableName}Desc` với ProDescriptions cho hiển thị chi tiết
  - Tạo `{TableName}Info` với DrawerInfo wrapper
  - Tạo `{TableName}FormCreate` với DrawerForm và submit handler
  - Tạo `{TableName}FormEdit` với DrawerForm và handlers đầy đủ

- Bước 3: Cập nhật Index File
  - Thêm export statements vào `/src/component/custom/index.js`
  - Format: `// {tableName}` comment trước exports
  - Export both schema và component: `export * from "./{tableName}/{tableName}-schema";` và `export * from "./{tableName}/{tableName}-component";`

## 5. Ví dụ code mẫu

### Input (SQL Definition)

```sql
-- table: vai trò

DROP TABLE IF EXISTS roles CASCADE;
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  role_name VARCHAR(255) NOT NULL,
  role_path VARCHAR(255) NOT NULL,
  role_status_id INTEGER NOT NULL
);
CREATE TRIGGER update_record BEFORE
UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### Output Schema File (options-schema.js)

```javascript
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
      title: "Trạng thái",
      dataIndex: "role_status_id",
      valueType: "select",
      valueEnum: roleStatus?.valueEnum || {},
      sorter: { multiple: 1 },
    },
    {
      title: "Đường dẫn",
      dataIndex: "role_path",
      valueType: "text",
      sorter: { multiple: 1 },
      responsive: ["md"],
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
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormSelect
        name="role_status_id"
        label="Trạng thái"
        placeholder="Chọn trạng thái"
        rules={[{ required: true }]}
        options={roleStatus?.options || []}
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormText
        name="role_path"
        label="Đường dẫn"
        placeholder="Nhập đường dẫn"
        rules={[{ required: true }]}
      />
    </ProForm.Group>
  );
}
```

### Output Component File (options-component.js)

```javascript
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

export function RolesFormEdit({ id, ...props }) {
  return (
    <DrawerForm
      {...props}
      onFormRequest={() => fetchGet(`/api/roles/${id}`)}
      onFormSubmit={(values) => fetchPut(`/api/roles/${id}`, values)}
      onFormDelete={() => fetchDelete(`/api/roles/${id}`)}
    />
  );
}
```

### Update the Index File (`/src/component/custom/index.js`)

```javascript
// path: @/component/custom/index.js

// roles
export * from "./roles/roles-schema";
export * from "./roles/roles-component";
```
