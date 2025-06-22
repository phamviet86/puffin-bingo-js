---
mode: "edit"
description: "Tạo page component hoàn chỉnh cho quản lý entity với hiển thị bảng, form tạo/sửa và chức năng xem chi tiết"
---

## Yêu cầu

- Tạo page component file:
  - File: `/src/app/(front)/app/dev/{tableName}/page.js`
  - Sử dụng `"use client";` directive đầu file
  - Import components từ `/src/component/custom/` theo pattern PascalCase
- State management sử dụng hooks:

  - `useTable` - Quản lý dữ liệu bảng và reload
  - `useInfo` - Quản lý detail view state
  - `useNav` - Navigation utilities

- Component structure:

  - Table: `{TableName}Table` với columns configuration
  - Form: `{TableName}FormCreate` xử lý create action
  - Info: `{TableName}Info` với drawer actions
  - Schema: Import `{TableName}Columns` và `{TableName}Fields`

- Layout patterns:
  - `PageContainer` với breadcrumb, title và extra buttons
  - `ProCard` wrapper với boxShadow
  - Action columns: Info (trái) và Detail (phải, responsive md)

## Implementation Guidelines

### 1. File Structure và Import

- Comment đầu file để xác định table:

```javascript
// {TABLE_NAME} LIST PAGE
```

- Import statements cố định:

```javascript
import {
  PlusOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, DetailButton } from "@/component/common";
import { useTable, useInfo, useNav } from "@/component/hook";
```

- Component imports theo pattern:

```javascript
import {
  {TableName}Table,
  {TableName}Info,
  {TableName}FormCreate,
  {TableName}Columns,
  {TableName}Fields,
} from "@/component/custom";
```

### 2. Hook Initialization

```javascript
const use{TableName}Table = useTable();
const use{TableName}Info = useInfo();
const { navDetail } = useNav();
```

### 3. Page Button Configuration

- Refresh button với `SyncOutlined` icon
- Create button với `PlusOutlined` icon
- Form trigger với `{TableName}FormCreate` component
- Success handler: Close info và navigate to detail

### 4. Table Actions

- **leftColumns**: Info button với `InfoCircleOutlined`
  - Action: Set dataSource và open info drawer
- **rightColumns**: Detail button với `EyeOutlined`
  - Responsive: `["md"]`
  - Action: Navigate to detail page

### 5. Vietnamese Localization

- Breadcrumb: `[{ title: "Hệ thống" }, { title: "{Entity Name}" }]`
- Page title: "Quản lý {Vietnamese entity name}"
- Info drawer title: "Thông tin {Vietnamese entity name}"
- Form title: "Tạo {entity name}"
- Buttons: "Tạo mới", "Xem chi tiết"

### 6. Form Success Handler

- Close info drawer: `use{TableName}Info.close()`
- Navigate to detail: `navDetail(result?.data[0]?.id)`

## Quy tắc naming và mapping

- Table name → Component prefix: `options` → `Options`
- Vietnamese entity names:
  - `options` → "Tùy chọn"
  - Breadcrumb: `[{ title: "Hệ thống" }, { title: "Tùy chọn" }]`
  - Page title: "Quản lý tùy chọn"
  - Form title: "Tạo tùy chọn"
  - Info drawer title: "Thông tin tùy chọn"

## Workflow Implementation

- **Bước 1**: Parse SQL table definition để xác định table name và entity name
- **Bước 2**: Tạo page component với cấu trúc cố định:
  - Comment định danh table ở đầu file: `// {TABLE_NAME} LIST PAGE`
  - Import statements theo pattern đã định
  - Hook initialization cho state management
  - Page button configuration với create action và refresh
  - Table configuration với leftColumns và rightColumns
  - Info drawer với title và extra actions
  - Form với success handler và navigation

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

### Output (options/page.js)

```javascript
// OPTIONS LIST PAGE

"use client";

import {
  PlusOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, DetailButton } from "@/component/common";
import {
  OptionsTable,
  OptionsInfo,
  OptionsFormCreate,
  OptionsColumns,
  OptionsFields,
} from "@/component/custom";
import { useTable, useInfo, useNav } from "@/component/hook";

export default function Page() {
  const useOptionsTable = useTable();
  const useOptionsInfo = useInfo();
  const { navDetail } = useNav();

  const pageButton = [
    <Button
      key="refresh-button"
      icon={<SyncOutlined />}
      label="Tải lại"
      color="default"
      variant="filled"
      onClick={() => useOptionsTable.reload()}
    />,
    <OptionsFormCreate
      key="create-form"
      fields={OptionsFields()}
      initialValues={{ option_color: "default" }}
      onFormSubmitSuccess={(result) => {
        useOptionsInfo.close();
        navDetail(result?.data[0]?.id);
      }}
      title="Tạo tùy chọn"
      trigger={<Button icon={<PlusOutlined />} label="Tạo mới" />}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <OptionsTable
        tableHook={useOptionsTable}
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
                  useOptionsInfo.setDataSource(record);
                  useOptionsInfo.open();
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
      <OptionsInfo
        infoHook={useOptionsInfo}
        columns={OptionsColumns()}
        dataSource={useOptionsInfo.dataSource}
        drawerProps={{
          title: "Thông tin tùy chọn",
          extra: [
            <DetailButton
              key="detail-button"
              label="Xem chi tiết"
              variant="filled"
              id={useOptionsInfo?.dataSource?.id}
            />,
          ],
        }}
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
