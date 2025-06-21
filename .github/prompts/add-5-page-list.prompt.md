---
mode: "edit"
description: "Create complete page component for entity management with table display, create form, edit form and detail view functionality."
---

## Requirements

- Create page component file:
  - `page.js` in `/src/app/(front)/app/dev/{tableName}/` directory
  - Use `"use client";` directive at the top of file
  - Import components from `/src/component/custom/` directory; don't change import paths
- Include state management using hooks:
  - `useTable` - Manage table data, reload and reference
  - `useForm` - Manage form state, title, record and visibility
  - `useInfo` - Manage detail view state
- Implement main components:
  - Table component with entity name as prefix (e.g., `OptionsTable`)
  - Single form component to handle both create and edit (e.g., `OptionsForm`)
  - Detail info component (e.g., `OptionsInfo`) with drawer actions
  - Columns configuration (e.g., `OptionsColumns`)
  - Fields configuration (e.g., `OptionsFields`)
- Follow established project patterns for:
  - Layout using `PageContainer` and `ProCard` components
  - Responsive design with proper shadows
  - Action columns with Info and Edit buttons
  - Form with dynamic title and initialValues
- Include standard table operations:
  - pageButton: Create button with `PlusOutlined` icon
  - leftColumns: Info button with `InfoCircleOutlined` icon
  - rightColumns: Edit button with `EditOutlined` icon (responsive md)
- Use naming conventions:
  - PascalCase for entity component names (e.g., `OptionsTable`, `OptionsForm`)
  - Vietnamese labels for UI text
  - Proper breadcrumb structure with title hierarchy

## Notes

- Use SQL table definition to:
  - Identify entity name and table name
  - Create appropriate breadcrumb and title
  - Import correct components from custom components
- Page structure pattern:
  - PageContainer with breadcrumb items, title and extra buttons
  - ProCard wrapper with boxShadow
  - Table component with leftColumns/rightColumns configuration
  - Info drawer with drawerProps title and footer actions
  - Single form with dynamic title, fields, initialValues and success callback
- State management pattern:
  - `optionForm.setTitle()` to set dynamic title for form
  - `hook.open(record)` to open forms/drawers with data
  - `hook.close()` to close forms/drawers
  - `optionTable.reload()` after successful submit
  - `optionForm.initialValues` and `optionInfo.dataSource` to access current data
- Vietnamese localization patterns:
  - Breadcrumb: "Hệ thống" for system level
  - Page title: "Quản lý {Vietnamese entity name}"
  - Create button: "Tạo mới"
  - Form titles: "Tạo {entity}" and "Sửa {entity}"
  - Info drawer title: "Thông tin {Vietnamese entity name}"
  - Edit button: "Sửa"
- Component import structure:
  - Icons from `@ant-design/icons`
  - ProCard from `@ant-design/pro-components`
  - Common components from `@/component/common`
  - Custom components from `@/component/custom` (Table, Info, Form, Columns, Fields)
  - Hooks from `@/component/hook`

## Example

### Input (SQL Definition)

```sql
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

### Output (page.js)

```javascript
"use client";

import {
  PlusOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button } from "@/component/common";
import {
  OptionsTable,
  OptionsInfo,
  OptionsForm,
  OptionsColumns,
  OptionsFields,
} from "@/component/custom";
import { useTable, useInfo, useForm } from "@/component/hook";

export default function Page() {
  const optionTable = useTable();
  const optionInfo = useInfo();
  const optionForm = useForm();

  const pageButton = [
    <Button
      key="create-button"
      label="Tạo mới"
      icon={<PlusOutlined />}
      onClick={() => {
        optionForm.setTitle("Tạo tùy chọn");
        optionForm.setInitialValues({});
        optionForm.open();
      }}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <OptionsTable
        tableHook={optionTable}
        columns={OptionsColumns()}
        leftColumns={[
          {
            width: 56,
            align: "center",
            search: false,
            render: (_, record) => (
              <Button
                icon={<InfoCircleOutlined />}
                variant="link"
                onClick={() => {
                  optionInfo.setDataSource(record);
                  optionInfo.open();
                }}
              />
            ),
          },
        ]}
        rightColumns={[
          {
            width: 56,
            align: "center",
            search: false,
            render: (_, record) => (
              <Button
                icon={<EditOutlined />}
                variant="link"
                onClick={() => {
                  optionForm.setTitle("Sửa tùy chọn");
                  optionForm.setInitialValues(record);
                  optionForm.open();
                }}
              />
            ),
            responsive: ["md"],
          },
        ]}
      />
      <OptionsInfo
        infoHook={optionInfo}
        columns={OptionsColumns()}
        dataSource={optionInfo.dataSource}
        drawerProps={{
          title: "Thông tin tùy chọn",
          footer: [
            <Button
              key="edit-button"
              label="Sửa"
              onClick={() => {
                optionInfo.close();
                optionForm.setTitle("Sửa tùy chọn");
                optionForm.setInitialValues(optionInfo.dataSource);
                optionForm.open();
              }}
            />,
          ],
        }}
      />
      <OptionsForm
        formHook={optionForm}
        fields={OptionsFields()}
        onDataSubmitSuccess={() => optionTable.reload()}
        initialValues={optionForm.initialValues}
        title={optionForm.title}
      />
    </ProCard>
  );

  return (
    <PageContainer
      items={[{ title: "Hệ thống" }, { title: "Tùy chọn" }]}
      title="Quản lý tùy chọn"
      extra={pageButton}
      content={pageContent}
    />
  );
}
```
