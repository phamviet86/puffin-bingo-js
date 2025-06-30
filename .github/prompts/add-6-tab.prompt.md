---
mode: "agent"
description: "Tạo 1 file tab hoàn chỉnh cho quản lý entity: tab page với hiển thị bảng, form tạo/sửa và chức năng thông tin trong cùng 1 tab"
---

## Yêu cầu

Tạo **1 file** cho mỗi entity:

1. **Tab Page File**: `/src/app/(front)/app/dev/{tableName}/tab.js`
   - Tab component với provider wrapper pattern
   - Table view với create/info/edit actions trong cùng 1 tab
   - Sử dụng `"use client";` directive
   - Tích hợp provider context để share data

## Core Requirements

- State management hooks: `useTable`, `useInfo`, `useForm`
- Component imports từ `/src/component/custom/` theo PascalCase pattern
- Vietnamese localization cho tất cả UI text
- Provider pattern cho context data sharing
- Tab structure với ProCard container
- Responsive design với action columns

## Implementation Guidelines

### Tab Page Structure (`tab.js`)

- Comment header: `// {TABLE_NAME} TAB PAGE`
- Use `"use client";` directive
- Import pattern:

```javascript
import {
  InfoCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button } from "@/component/common";
import {
  {TableName}Table,
  {TableName}Info,
  {TableName}FormCreate,
  {TableName}FormEdit,
  {TableName}Columns,
  {TableName}Fields,
} from "@/component/custom";
import { useTable, useInfo, useForm } from "@/component/hook";
import { PageProvider, usePageContext } from "./provider";
```

- Component structure:
  - Main export với Provider wrapper
  - Separate PageContent để access context
  - Hook initialization trong PageContent
  - Tab object với key, label, children structure
  - ProCard container với title và extra buttons

## Quy tắc naming và mapping

- Table name → Component prefix: `options` → `Options`, `roles` → `Roles`
- Vietnamese entity names:
  - `options` → "Tùy chọn"
  - `roles` → "Vai trò"
  - Breadcrumb: `[{ title: "Hệ thống" }, { title: "Tùy chọn" }]`
  - Page title: "Quản lý tùy chọn"
  - Tab label: "Tùy chọn"
  - Tab title: "Danh sách tùy chọn"
  - Form title: "Tạo tùy chọn", "Sửa tùy chọn"
  - Info drawer title: "Thông tin tùy chọn"

## Critical Implementation Rules

1. **ALWAYS create 1 file** for each entity:

   - `tab.js` - Tab page with integrated functionality

2. **Provider Pattern Requirements**:

   - Import existing `PageProvider` and `usePageContext` from `./provider`
   - Use provider wrapper pattern for context access

3. **Component Import Pattern**:

   - Always use PascalCase for component names
   - Import from `/src/component/custom/`
   - Include Table, Info, FormCreate, FormEdit, Columns, Fields

4. **File Structure Requirements**:

   - Tab: `/src/app/(front)/app/dev/{tableName}/tab.js`

5. **Hook Usage Pattern**:

   - Tab page: `useTable`, `useInfo`, `useForm`, `usePageContext`
   - Always destructure specific methods from hooks
   - Use reload() after successful operations

6. **Tab Structure Requirements**:

   - Single tab object with key, label, children
   - ProCard container with boxShadow
   - Extra buttons for reload and create actions
   - Integrated Info drawer and Edit form modals

7. **Action Flow Pattern**:

   - Create success → reload table
   - Edit success → reload table
   - Delete success → close form and reload table
   - Info → Edit transition through form setId

8. **Vietnamese Localization**:
   - All UI text must be in Vietnamese
   - Consistent naming pattern
   - Proper breadcrumb navigation structure

## Workflow Implementation

**Tạo 1 file tab cho mỗi entity:**

### Bước 1: Parse Input SQL

- Parse SQL table definition để xác định table name và entity name
- Identify foreign key relationships cho option selections
- Map Vietnamese entity names cho UI text

### Bước 2: Tạo Tab Page (`tab.js`)

- Comment header: `// {TABLE_NAME} TAB PAGE`
- Setup import statements theo pattern cố định
- Provider wrapper với PageContent component
- Hook initialization với context access
- Tab object configuration:
  - Key: table name
  - Label: Vietnamese entity name
  - Children: ProCard with table và forms
- ProCard với title và extra buttons
- Table configuration với left/right action columns
- Info drawer với edit button transition
- FormEdit modal với success/delete handlers
- PageContainer với breadcrumb và tabList

### Bước 3: Verify Implementation

- Ensure tab file được tạo đúng path
- Check provider context được access properly
- Verify action flows giữa các components
- Confirm Vietnamese localization consistency

## Ví dụ code mẫu

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

### Output tab page (`roles/tab.js`)

```javascript
// ROLES TAB PAGE

"use client";

import { InfoCircleOutlined, EditOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { Space } from "antd";
import { PageContainer, Button } from "@/component/common";
import {
  RolesTable,
  RolesInfo,
  RolesFormCreate,
  RolesFormEdit,
  RolesColumns,
  RolesFields,
} from "@/component/custom";
import { useTable, useInfo, useForm } from "@/component/hook";
import { PageProvider, usePageContext } from "./provider";

export default function Page(props) {
  return (
    <PageProvider>
      <PageContent {...props} />
    </PageProvider>
  );
}

function PageContent() {
  const { roleStatus } = usePageContext();

  // tab content: roles
  const useRolesTable = useTable();
  const useRolesInfo = useInfo();
  const useRolesForm = useForm();

  const rolesTab = {
    key: "roles",
    label: "Vai trò",
    children: (
      <ProCard
        boxShadow
        title="Danh sách vai trò"
        extra={
          <Space>
            <Button
              label="Tải lại"
              color="default"
              variant="filled"
              onClick={() => useRolesTable.reload()}
            />
            <RolesFormCreate
              fields={RolesFields({ roleStatus })}
              onFormSubmitSuccess={(result) => {
                useRolesInfo.close();
                useRolesTable.reload();
              }}
              title="Tạo vai trò"
              trigger={<Button label="Tạo mới" variant="filled" />}
            />,
          </Space>
        }
      >
        <RolesTable
          tableHook={useRolesTable}
          columns={RolesColumns({ roleStatus })}
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
                    useRolesInfo.setDataSource(record);
                    useRolesInfo.open();
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
                    useRolesForm.setId(record?.id);
                    useRolesForm.open();
                  }}
                />
              ),
              responsive: ["md"],
            },
          ]}
        />
        <RolesInfo
          infoHook={useRolesInfo}
          columns={RolesColumns({ roleStatus })}
          dataSource={useRolesInfo.dataSource}
          drawerProps={{
            title: "Thông tin vai trò",
            extra: [
              <Button
                key="roles-form-edit"
                label="Sửa"
                variant="filled"
                onClick={() => {
                  useRolesInfo.close();
                  useRolesForm.setId(useRolesInfo?.dataSource?.id);
                  useRolesForm.open();
                }}
              />,
            ],
          }}
        />
        <RolesFormEdit
          formHook={useRolesForm}
          fields={RolesFields({ roleStatus })}
          onFormRequestParams={{ id: useRolesForm.id }}
          onFormSubmitSuccess={() => useRolesTable.reload()}
          // enable if needed
          /* onFormDeleteParams={{ id: useRolesForm.id }}
          onFormDeleteSuccess={() => {
            useRolesForm.close();
            useRolesTable.reload();
          }} */
          title="Sửa vai trò"
        />
      </ProCard>
    ),
  };

  return (
    <PageContainer
      items={[{ title: "Hệ thống" }, { title: "Vai trò" }]}
      title="Quản lý vai trò"
      tabList={[rolesTab]}
    />
  );
}
```
