---
mode: "edit"
description: "Tạo file component hoàn chỉnh với các thao tác CRUD dựa trên tên bảng được cung cấp."
---

## Yêu cầu

- Tạo file component
  - Đường dẫn: `/src/component/custom/{tableName}/{tableName}-component.js`
  - Export 3 functions: `{TableName}Table`, `{TableName}Info`, `{TableName}Form`
- Import statements cố định
  - Common components: `ProTable`, `DrawerForm`, `DrawerInfo`, `ProDescriptions`
  - Fetch utilities: `fetchList`, `fetchPost`
- Component patterns
  - **Table**: Sử dụng `ProTable` với `onDataRequest` callback
  - **Form**: Sử dụng `DrawerForm` với `onDataSubmit` callback
  - **Info**: Sử dụng `DrawerInfo` làm wrapper
  - **Props spreading**: Tất cả components phải spread `{...props}`
- API endpoint format
  - Pattern: `/api/{tableName}` với tableName camelCase
  - Ví dụ: bảng "user_profiles" → endpoint "/api/userProfiles"
- Quy ước đặt tên
  - Functions: PascalCase + suffix (VD: `OptionsTable`, `OptionsForm`)
  - File names: kebab-case (VD: `options-component.js`)

## Ví dụ code mẫu

### Input

```
Tên bảng: options
```

### Output (options-component.js)

```javascript
// path: @/component/custom/options/options-component.js

import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
} from "@/component/common";
import { fetchList, fetchPost } from "@/lib/util/fetch-util";

export function OptionsTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/options", params, sort, filter)
      }
    />
  );
}

export function OptionsForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/options", values)}
    />
  );
}

export function OptionsInfo(props) {
  return <DrawerInfo {...props} />;
}
```
