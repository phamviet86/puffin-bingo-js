// path: @/app/(back)/api/roles/[id]/route.js

import { getRole, updateRole, deleteRole } from "@/service/roles-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function GET(_, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID vai trò.");

    const result = await getRole(id);
    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy vai trò.");

    return buildApiResponse(200, true, "Lấy thông tin vai trò thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID vai trò.");

    const { role_name, role_path, role_color, role_status_id } =
      await request.json();

    // Validate required fields (dựa vào NOT NULL trong SQL)
    if (!role_name || !role_path || !role_color || !role_status_id)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      role_name,
      role_path,
      role_color,
      role_status_id,
    };

    const result = await updateRole(data, id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy vai trò hoặc vai trò đã bị xóa."
      );

    return buildApiResponse(200, true, "Cập nhật vai trò thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function DELETE(_, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID vai trò.");

    const result = await deleteRole(id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy vai trò hoặc vai trò đã bị xóa."
      );

    return buildApiResponse(200, true, "Xóa vai trò thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
