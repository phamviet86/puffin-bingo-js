---
mode: "agent"
description: "Tạo 3 file hoàn chỉnh cho quản lý entity: provider, list page và detail page với hiển thị bảng, form tạo/sửa và chức năng Chi tiết"
---

## Yêu cầu

Tạo **3 files** cho mỗi entity:

1. **Provider File**: `/src/app/(front)/app/dev/{tableName}/provider.js`

   - Context provider cho shared data và selections
   - Sử dụng `convertSelection` utility cho option data
   - Export `PageProvider` và `usePageContext`

2. **List Page File**: `/src/app/(front)/app/dev/{tableName}/page.js`

   - Main component với provider wrapper pattern
   - Table view với create/info/detail actions
   - Sử dụng `"use client";` directive

3. **Detail Page File**: `/src/app/(front)/app/dev/{tableName}/[id]/page.js`
   - Detail view với edit/delete functionality
   - Dynamic title và breadcrumb
   - Provider integration

## Core Requirements

- State management hooks: `useTable`, `useInfo`, `useNav`, `useDesc`, `useForm`
- Component imports từ `/src/component/custom/` theo PascalCase pattern
- Vietnamese localization cho tất cả UI text
- Provider pattern cho context data sharing
- Responsive design với action columns

## Implementation Guidelines

### Provider File Structure (`provider.js`)

- Comment header: `// {TABLE_NAME} PROVIDER`
- Import required dependencies:

```javascript
import { createContext, useContext, useMemo } from "react";
import { useAppContext } from "../../provider";
import { convertSelection } from "@/lib/util/convert-util";
```

- Context creation và provider component:
  - Access `optionData` từ `useAppContext()`
  - Use `convertSelection` cho option-based fields
  - Memoize context value để optimize performance
  - Export both `PageProvider` và `usePageContext`

### List Page Structure (`page.js`)

- Comment header: `// {TABLE_NAME} LIST PAGE`
- Use `"use client";` directive
- Import pattern:

```javascript
import { Space } from "antd";
import {
  CodeOutlined,
  InfoCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, DetailButton } from "@/component/common";
import {
  {TableName}Table,
  {TableName}Info,
  {TableName}FormCreate,
  {TableName}Columns,
  {TableName}Fields,
} from "@/component/custom";
import { useTable, useInfo, useNav } from "@/component/hook";
import { PageProvider, usePageContext } from "./provider";
```

- Component structure:
  - Main export với Provider wrapper
  - Separate PageContent để access context
  - Hook initialization trong PageContent

### Detail Page Structure (`[id]/page.js`)

- Comment header: `// {TABLE_NAME} DETAIL PAGE`
- Use `"use client";` directive
- Import pattern:

```javascript
import { use } from "react";
import { Space } from "antd";
import { CodeOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, BackButton } from "@/component/common";
import {
  {TableName}Desc,
  {TableName}FormEdit,
  {TableName}Columns,
  {TableName}Fields,
} from "@/component/custom";
import { useDesc, useForm, useNav } from "@/component/hook";
import { PageProvider, usePageContext } from "../provider";
```

- Component structure:
  - Provider wrapper pattern
  - Use `use(params)` để get dynamic id
  - Dynamic title và document.title
  - Breadcrumb với back navigation link

## Quy tắc naming và mapping

- Table name → Component prefix: `options` → `Options`, `roles` → `Roles`
- Vietnamese entity names:
  - `options` → "Tùy chọn"
  - `roles` → "Vai trò"
  - Breadcrumb: `[{ title: "Development" }, { title: "Tùy chọn" }]`
  - Page title: "Quản lý tùy chọn"
  - Form title: "Tạo tùy chọn"
  - Info drawer title: "Thông tin tùy chọn"
  - Detail page title: Dynamic from data or "Chi tiết"

## Critical Implementation Rules

1. **ALWAYS create 3 files** for each entity:

   - `provider.js` - Context provider
   - `page.js` - List page
   - `[id]/page.js` - Detail page

2. **Provider Pattern Requirements**:

   - Import `useAppContext` and `convertSelection`
   - Create context with `createContext(null)`
   - Memoize context value with `useMemo`
   - Export both `PageProvider` and `usePageContext`

3. **Component Import Pattern**:

   - Always use PascalCase for component names
   - Import from `/src/component/custom/`
   - Include Table, Info, FormCreate, FormEdit, Desc, Columns, Fields

4. **File Structure Requirements**:

   - Provider: `/src/app/(front)/app/dev/{tableName}/provider.js`
   - List: `/src/app/(front)/app/dev/{tableName}/page.js`
   - Detail: `/src/app/(front)/app/dev/{tableName}/[id]/page.js`

5. **Hook Usage Pattern**:

   - List page: `useTable`, `useInfo`, `useNav`, `usePageContext`
   - Detail page: `useDesc`, `useForm`, `useNav`, `usePageContext`
   - Always destructure specific methods from hooks

6. **Vietnamese Localization**:
   - All UI text must be in Vietnamese
   - Consistent naming across all 3 files
   - Proper breadcrumb navigation structure

## Workflow Implementation

**Tạo 3 files cho mỗi entity theo thứ tự:**

### Bước 1: Parse Input SQL

- Parse SQL table definition để xác định table name và entity name
- Identify foreign key relationships cho option selections
- Map Vietnamese entity names cho UI text

### Bước 2: Tạo Provider File (`provider.js`)

- Comment header: `// {TABLE_NAME} PROVIDER`
- Setup context với `createContext` và `useContext`
- Import `useAppContext` và `convertSelection`
- Create selection objects cho các foreign key fields
- Memoize context value và export provider hooks

### Bước 3: Tạo List Page (`page.js`)

- Comment header: `// {TABLE_NAME} LIST PAGE`
- Setup import statements theo pattern cố định
- Provider wrapper với PageContent component
- Hook initialization với context access
- Page buttons: refresh và create với success handlers
- Table configuration với left/right action columns
- Info drawer với proper title và actions

### Bước 4: Tạo Detail Page (`[id]/page.js`)

- Comment header: `// {TABLE_NAME} DETAIL PAGE`
- Setup import statements cho detail components
- Provider wrapper pattern
- Use `use(params)` để extract dynamic id
- Page buttons: back và edit với success handlers
- Desc component với context data
- Dynamic title setup với document.title
- Breadcrumb với back navigation link

### Bước 5: Verify File Structure

- Ensure tất cả 3 files được tạo đúng path
- Check provider context được shared properly
- Verify navigation flows giữa list và detail pages
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

### Output provider (`roles/provider.js`)

```javascript
// ROLES PROVIDER

import { createContext, useContext, useMemo } from "react";
import { useAppContext } from "../../provider";
import { convertSelection } from "@/lib/util/convert-util";

const PageContext = createContext(null);

export function PageProvider({ children }) {
  // Access the option data from the AppContext
  const { optionData } = useAppContext(); // sử dụng lại dữ liệu có trong cache

  /* 
  // Create a selection for role status using the option data
  const roleStatus = convertSelection(
    optionData,
    { value: "id", label: "option_label", color: "option_color" }, // Define how to map the option data
    { option_table: "roles", option_column: "role_status_id" } // Define filtering criteria
  );

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      roleStatus,
    }),
    [roleStatus]
  );
  */

  // Provide the context to children components
  return (
    <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
  );
}

export function usePageContext() {
  return useContext(PageContext);
}
```

### Output list page (`roles/page.js`)

```javascript
// ROLES LIST PAGE

"use client";

import { Space } from "antd";
import {
  CodeOutlined,
  InfoCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, DetailButton } from "@/component/common";
import {
  RolesTable,
  RolesInfo,
  RolesFormCreate,
  RolesColumns,
  RolesFields,
} from "@/component/custom";
import { useTable, useInfo, useNav } from "@/component/hook";
import { PageProvider, usePageContext } from "./provider";

export default function Page(props) {
  return (
    <PageProvider>
      <PageContent {...props} />
    </PageProvider>
  );
}

function PageContent() {
  const { navDetail } = useNav();
  const { roleStatus } = usePageContext();

  // page content: roles
  const useRolesTable = useTable();
  const useRolesInfo = useInfo();

  const pageButton = [
    <Button
      key="refresh-button"
      label="Tải lại"
      color="default"
      variant="filled"
      onClick={() => useRolesTable.reload()}
    />,
    <RolesFormCreate
      key="create-form"
      fields={RolesFields({ roleStatus })}
      onFormSubmitSuccess={(result) => {
        useRolesInfo.close();
        navDetail(result?.data[0]?.id);
      }}
      title="Tạo vai trò"
      trigger={<Button label="Tạo mới" />}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
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
              <DetailButton
                icon={<EyeOutlined />}
                variant="link"
                id={record?.id}
              />
            ),
            responsive: ["md"],
          },
        ]}
      />
      <RolesInfo
        infoHook={useRolesInfo}
        columns={RolesColumns()}
        dataSource={useRolesInfo.dataSource}
        drawerProps={{
          title: "Thông tin vai trò",
          extra: [
            <DetailButton
              key="detail-button"
              label="Chi tiết"
              variant="filled"
              id={useRolesInfo?.dataSource?.id}
            />,
          ],
        }}
      />
    </ProCard>
  );

  return (
    <PageContainer
      items={[
        {
          title: (
            <Space>
              <CodeOutlined style={{ color: "#fa541c" }} />
              <span>Development</span>
            </Space>
          ),
          path: "/app/dev",
        },
        { title: "Vai trò" },
      ]}
      title="Quản lý vai trò"
      extra={pageButton}
      content={pageContent}
    />
  );
}
```

### Output detail page (`roles/[id]/page.js`)

```javascript
// ROLE DETAILS PAGE

"use client";

import { use } from "react";
import { Space } from "antd";
import { CodeOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, BackButton } from "@/component/common";
import {
  RolesDesc,
  RolesFormEdit,
  RolesColumns,
  RolesFields,
} from "@/component/custom";
import { useDesc, useForm, useNav } from "@/component/hook";
import { PageProvider, usePageContext } from "../provider";

export default function Page(props) {
  return (
    <PageProvider>
      <PageContent {...props} />
    </PageProvider>
  );
}

function PageContent({ params }) {
  // const { navBack } = useNav(); // enable this if you want to navigate back after delete
  const { roleStatus } = usePageContext();
  const { id: roleId } = use(params);

  // page content: roles
  const useRolesDesc = useDesc();
  const useRolesForm = useForm();

  const pageButton = [
    <BackButton key="back-button" />,
    <RolesFormEdit
      formHook={useRolesForm}
      fields={RolesFields({ roleStatus })}
      onFormRequestParams={{ id: roleId }}
      onFormSubmitSuccess={() => useRolesDesc.reload()}
      /* onFormDeleteParams={{ id: roleId }}
      onFormDeleteSuccess={() => {
        useRolesForm.close();
        navBack();
      }} */
      key="edit-form"
      title="Sửa vai trò"
      trigger={<Button label="Sửa" />}
    />,
  ];

  const pageContent = (
    <ProCard bordered>
      <RolesDesc
        descHook={useRolesDesc}
        columns={RolesColumns({ roleStatus })}
        onDescRequestParams={{ id: roleId }}
        onDescRequestSuccess={(result) =>
          useRolesDesc.setDataSource(result?.data?.[0])
        }
      />
    </ProCard>
  );

  const pageTitle = useRolesDesc?.dataSource?.role_name || "Chi tiết";
  document.title = `Vai trò - ${pageTitle}`;

  return (
    <PageContainer
      items={[
        {
          title: (
            <Space>
              <CodeOutlined style={{ color: "#fa541c" }} />
              <span>Development</span>
            </Space>
          ),
          path: "/app/dev",
        },
        { title: "Vai trò", path: "/app/system/roles" },
        { title: pageTitle },
      ]}
      title={pageTitle}
      extra={pageButton}
      content={pageContent}
    />
  );
}
```
