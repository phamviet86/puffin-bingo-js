// path: @/app/(back)/api/classes/transfer/route.js

import {
  createClassesByCourse,
  deleteClassesByCourse,
} from "@/service/classes-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function POST(request) {
  try {
    const { course_id, moduleIds } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!course_id || !Array.isArray(moduleIds) || moduleIds.length === 0)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const result = await createClassesByCourse(course_id, moduleIds);

    if (!result || !result.length)
      return buildApiResponse(404, false, "Không thể thêm lớp học.");

    return buildApiResponse(201, true, "Thêm lớp học thành công", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function DELETE(request) {
  try {
    const { course_id, moduleIds } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!course_id || !Array.isArray(moduleIds) || moduleIds.length === 0)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const result = await deleteClassesByCourse(course_id, moduleIds);

    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy lớp học để xóa");

    return buildApiResponse(200, true, "Xóa lớp học thành công", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
