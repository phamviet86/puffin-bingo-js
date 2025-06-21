---
mode: "edit"
description: "Tạo schema files hoàn chỉnh cho hệ thống component Ant Design Pro từ định nghĩa SQL table"
---

## Yêu cầu

- Tạo file schema
  - Đường dẫn: `/src/component/custom/{tableName}/{tableName}-schema.js`
  - Export 2 functions: `{TableName}Columns` và `{TableName}Fields`
- Quy tắc mapping SQL data types
  - VARCHAR → `ProFormText` với `valueType: "text"`
  - TEXT → `ProFormTextArea` với `valueType: "textarea"` và `fieldProps={{ autoSize: { minRows: 3, maxRows: 6 } }}`
  - INT/SERIAL → `ProFormText` (không dùng ProFormDigit)
  - TIMESTAMPTZ → `ProFormDatePicker`
  - TIME → `ProFormTimePicker`
- Quy tắc validation
  - NOT NULL → `rules={[{ required: true }]}`
- Cấu hình table columns
  - Tất cả columns (trừ ID): `sorter: { multiple: 1 }`
  - Ẩn system fields: `id`, `created_at`, `updated_at`, `deleted_at`
- Quy ước đặt tên

  - Functions: PascalCase + suffix (VD: `OptionsColumns`, `OptionsFields`)
  - Labels: chuyển snake_case thành Title Case tiếng Việt
  - Placeholders: "Nhập..." cho input, "Chọn..." cho selection

- Form structure
  - Wrap fields trong `<ProForm.Group>...</ProForm.Group>`
  - ID field: `hidden disabled`

## Ví dụ code mẫu

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

### Output (options-schema.js)

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
