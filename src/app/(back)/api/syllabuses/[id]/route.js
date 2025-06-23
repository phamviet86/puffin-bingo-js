// path: @/app/(back)/api/syllabuses/[id]/route.js

import {
  getSyllabus,
  updateSyllabus,
  deleteSyllabus,
} from "@/service/syllabuses-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function GET(_, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID giáo trình.");

    const result = await getSyllabus(id);
    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy giáo trình.");

    return buildApiResponse(200, true, "Lấy thông tin giáo trình thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID giáo trình.");

    const { syllabus_name, syllabus_status_id } = await request.json();

    // Validate required fields (dựa vào NOT NULL trong SQL)
    if (!syllabus_name || !syllabus_status_id)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      syllabus_name,
      syllabus_status_id,
    };

    const result = await updateSyllabus(data, id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy giáo trình hoặc giáo trình đã bị xóa."
      );

    return buildApiResponse(200, true, "Cập nhật giáo trình thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function DELETE(_, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID giáo trình.");

    const result = await deleteSyllabus(id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy giáo trình hoặc giáo trình đã bị xóa."
      );

    return buildApiResponse(200, true, "Xóa giáo trình thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
