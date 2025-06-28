// path: @/app/(back)/api/enrollments/class-transfer/route.js

import {
  createEnrollmentsByClass,
  deleteEnrollmentsByClass,
} from "@/service/enrollments-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function POST(request) {
  try {
    const { class_id, userIds, enrollment_type_id } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (
      !class_id ||
      !Array.isArray(userIds) ||
      userIds.length === 0 ||
      !enrollment_type_id
    )
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const result = await createEnrollmentsByClass(
      class_id,
      userIds,
      enrollment_type_id
    );

    if (!result || !result.length)
      return buildApiResponse(404, false, "Không thể thêm đăng ký.");

    return buildApiResponse(201, true, "Thêm đăng ký thành công", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function DELETE(request) {
  try {
    const { class_id, userIds } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!class_id || !Array.isArray(userIds) || userIds.length === 0)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const result = await deleteEnrollmentsByClass(class_id, userIds);

    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy đăng ký để xóa");

    return buildApiResponse(200, true, "Xóa đăng ký thành công", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
