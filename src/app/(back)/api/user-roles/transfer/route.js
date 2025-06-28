// path: @/app/(back)/api/user-roles/transfer/route.js

import {
  createUserRolesByUser,
  deleteUserRolesByUser,
} from "@/service/user-roles-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function POST(request) {
  try {
    const { user_id, roleIds } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!user_id || !Array.isArray(roleIds) || roleIds.length === 0)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const result = await createUserRolesByUser(user_id, roleIds);

    if (!result || !result.length)
      return buildApiResponse(404, false, "Không thể thêm quyền.");

    return buildApiResponse(201, true, "Thêm quyền thành công", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function DELETE(request) {
  try {
    const { user_id, roleIds } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!user_id || !Array.isArray(roleIds) || roleIds.length === 0)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const result = await deleteUserRolesByUser(user_id, roleIds);

    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy phân quyền để xóa");

    return buildApiResponse(200, true, "Xóa phân quyền thành công", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
