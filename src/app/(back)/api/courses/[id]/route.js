// path: @/app/(back)/api/courses/[id]/route.js

import {
  getCourse,
  updateCourse,
  deleteCourse,
} from "@/service/courses-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function GET(_, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID khóa học.");

    const result = await getCourse(id);
    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy khóa học.");

    return buildApiResponse(200, true, "Lấy thông tin khóa học thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID khóa học.");

    const { course_name, course_code } = await request.json();

    // Validate required fields (dựa vào NOT NULL trong SQL)
    if (!course_name || !course_code)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      course_name,
      course_code,
    };

    const result = await updateCourse(data, id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy khóa học hoặc khóa học đã bị xóa."
      );

    return buildApiResponse(200, true, "Cập nhật khóa học thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function DELETE(_, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID khóa học.");

    const result = await deleteCourse(id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy khóa học hoặc khóa học đã bị xóa."
      );

    return buildApiResponse(200, true, "Xóa khóa học thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
