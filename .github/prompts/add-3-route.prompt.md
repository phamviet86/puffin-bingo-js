---
mode: "edit"
description: "Tạo file route API hoàn chỉnh cho service với các thao tác CRUD dựa trên định nghĩa bảng SQL và module service."
---

## Yêu cầu

- Tạo 2 file route API:
  - `route.js` trong thư mục `/src/app/(back)/api/{tableName}` cho các thao tác lấy danh sách/tạo mới (GET/POST)
  - `[id]/route.js` trong thư mục `/src/app/(back)/api/{tableName}/[id]` cho các thao tác chi tiết/cập nhật/xóa (GET/PUT/DELETE)
- Các handler cần có:
  - GET: Lấy tất cả bản ghi (route.js) hoặc 1 bản ghi theo id ([id]/route.js)
  - POST: Tạo mới hoặc cập nhật nếu có id (upsert) - chỉ ở route.js
  - PUT: Cập nhật bản ghi theo id - chỉ ở [id]/route.js
  - DELETE: Xóa mềm bản ghi theo id - chỉ ở [id]/route.js
- Tuân thủ các pattern dự án:
  - Import các hàm từ file service tương ứng
  - Xử lý lỗi với try/catch
  - Validate input dựa trên các trường NOT NULL trong SQL
  - Định dạng response bằng các hàm helper
  - Lấy tham số từ body request hoặc URL (params/query)
- Trả về mã lỗi phù hợp:
  - 400: Thiếu tham số bắt buộc
  - 404: Không tìm thấy hoặc đã bị xóa
  - 500: Lỗi server hoặc thao tác thất bại
- Đặt tên hàm service theo pattern:
  - Lấy danh sách: `get{TableName}s` (vd: getOptions)
  - Lấy theo id: `get{TableName}` (vd: getOption)
  - Tạo mới: `create{TableName}`
  - Cập nhật: `update{TableName}`
  - Xóa: `delete{TableName}`
- Đặt tên biến, hàm, key theo quy ước:
  - camelCase cho biến, tên hàm (vd: userId, getUser)
  - snake_case cho key dữ liệu map với cột DB (vd: { section_id, lesson_id })
  - PascalCase cho class/component
  - UPPER_CASE_SNAKE cho hằng số, biến môi trường
  - kebab-case cho tên file
- Lấy tham số:
  - Query string cho GET danh sách
  - Body cho POST/PUT (bao gồm id nếu upsert)
  - context.params cho các route [id]
- Kiểm tra kết quả service:
  - Dùng `if (!result || !result.length)` cho getById, create, update, delete
  - Dùng `handleData(result)` và destructure `{ data, total }` cho getAll
  - Trả về 404 nếu không tìm thấy
  - Trả về 500 nếu thao tác thất bại
- Logic POST:
  - Nếu có id: gọi update, trả về 200
  - Nếu không có id: gọi create, trả về 201
  - Dùng message tiếng Việt phù hợp
- Thông báo lỗi trả về bằng tiếng Việt trong response

## Ví dụ code mẫu

### route.js

```javascript
import {
  getOptions,
  createOption,
  updateOption,
} from "@/service/options-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getOptions(searchParams);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách tùy chọn thành công", {
      data,
      total,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function POST(request) {
  try {
    const {
      id = null,
      option_table,
      option_column,
      option_label,
      option_color = null,
      option_group = null,
    } = await request.json();

    // Validate required fields (dựa vào NOT NULL trong SQL)
    if (!option_table || !option_column || !option_label)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      option_table,
      option_column,
      option_label,
      option_color,
      option_group,
    };

    let result;
    let message;
    let statusCode;

    if (id !== null) {
      // Update option
      result = await updateOption(data, id);
      message = "Cập nhật tùy chọn thành công.";
      statusCode = 200;
    } else {
      // Create option
      result = await createOption(data);
      message = "Tạo tùy chọn thành công.";
      statusCode = 201;
    }

    if (!result || !result.length)
      return buildApiResponse(500, false, "Không thể thực hiện thao tác.");

    return buildApiResponse(statusCode, true, message, {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
```

### [id]/route.js

```javascript
import {
  getOption,
  updateOption,
  deleteOption,
} from "@/service/options-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function GET(_, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID tùy chọn.");

    const result = await getOption(id);
    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy tùy chọn.");

    return buildApiResponse(200, true, "Lấy thông tin tùy chọn thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID tùy chọn.");

    const {
      option_table,
      option_column,
      option_label,
      option_color = null,
      option_group = null,
    } = await request.json();

    // Validate required fields (dựa vào NOT NULL trong SQL)
    if (!option_table || !option_column || !option_label)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      option_table,
      option_column,
      option_label,
      option_color,
      option_group,
    };

    const result = await updateOption(data, id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy tùy chọn hoặc tùy chọn đã bị xóa."
      );

    return buildApiResponse(200, true, "Cập nhật tùy chọn thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function DELETE(_, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID tùy chọn.");

    const result = await deleteOption(id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy tùy chọn hoặc tùy chọn đã bị xóa."
      );

    return buildApiResponse(200, true, "Xóa tùy chọn thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
```
