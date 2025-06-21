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
  - Export 3 functions: `{TableName}Table`, `{TableName}Info`, `{TableName}Form`

- Import statements cố định

```javascript
import { ProTable, DrawerForm, DrawerInfo } from "@/component/common";
import { fetchList, fetchPost } from "@/lib/util/fetch-util";
```

- Component patterns

  - Table: Sử dụng `ProTable` với `onDataRequest` callback
  - Form: Sử dụng `DrawerForm` với `onDataSubmit` callback
  - Info: Sử dụng `DrawerInfo` làm wrapper
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
  - Tạo `{TableName}Form` với DrawerForm và submit handler
  - Tạo `{TableName}Info` với DrawerInfo wrapper

## 5. Ví dụ code mẫu

### Input (SQL Definition)

```sql
-- table: tuỳ chọn

DROP TABLE IF EXISTS options CASCADE;
CREATE TABLE options (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  option_table VARCHAR(255) NOT NULL,
  option_column VARCHAR(255) NOT NULL,
  option_label VARCHAR(255) NOT NULL,
  option_color VARCHAR(255) DEFAULT NULL,
  option_group VARCHAR(255) DEFAULT NULL
);
CREATE TRIGGER update_record BEFORE
UPDATE ON options FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### Output Schema File (options-schema.js)

```javascript
// path: @/component/custom/options/options-schema.js

import { ProForm, ProFormText } from "@ant-design/pro-form";

export function OptionsColumns() {
  return [
    {
      title: "Bảng",
      dataIndex: "option_table",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Cột",
      dataIndex: "option_column",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Nhãn",
      dataIndex: "option_label",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Màu sắc",
      dataIndex: "option_color",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Nhóm",
      dataIndex: "option_group",
      valueType: "text",
      sorter: { multiple: 1 },
    },
  ];
}

export function OptionsFields() {
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="option_table"
        label="Bảng"
        placeholder="Nhập tên bảng"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="option_column"
        label="Cột"
        placeholder="Nhập tên cột"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="option_label"
        label="Nhãn"
        placeholder="Nhập nhãn"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="option_color"
        label="Màu sắc"
        placeholder="Nhập mã màu"
      />
      <ProFormText
        name="option_group"
        label="Nhóm"
        placeholder="Nhập tên nhóm"
      />
    </ProForm.Group>
  );
}
```

### Output Component File (options-component.js)

```javascript
// path: @/component/custom/options/options-component.js

import { ProTable, DrawerForm, DrawerInfo } from "@/component/common";
import { fetchList, fetchPost } from "@/lib/util/fetch-util";

export function OptionsTable(props) {
  return (
    <ProTable
      {...props}
      tableRequest={(params, sort, filter) =>
        fetchList("/api/options", params, sort, filter)
      }
    />
  );
}

export function OptionsForm(props) {
  return (
    <DrawerForm
      {...props}
      formSubmit={(values) => fetchPost("/api/options", values)}
    />
  );
}

export function OptionsInfo(props) {
  return <DrawerInfo {...props} />;
}
```
