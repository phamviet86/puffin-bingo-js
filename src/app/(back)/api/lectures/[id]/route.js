// path: @/app/(back)/api/lectures/[id]/route.js

import {
  getLecture,
  updateLecture,
  deleteLecture,
} from "@/service/lectures-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function GET(_, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID bài giảng.");

    const result = await getLecture(id);
    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy bài giảng.");

    return buildApiResponse(200, true, "Lấy thông tin bài giảng thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID bài giảng.");

    const {
      module_id,
      lecture_name,
      lecture_status_id,
      lecture_no = null,
      lecture_desc = null,
    } = await request.json();

    // Validate required fields (dựa vào NOT NULL trong SQL)
    if (!module_id || !lecture_name || !lecture_status_id)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      module_id,
      lecture_name,
      lecture_status_id,
      lecture_no,
      lecture_desc,
    };

    const result = await updateLecture(data, id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy bài giảng hoặc bài giảng đã bị xóa."
      );

    return buildApiResponse(200, true, "Cập nhật bài giảng thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function DELETE(_, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID bài giảng.");

    const result = await deleteLecture(id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy bài giảng hoặc bài giảng đã bị xóa."
      );

    return buildApiResponse(200, true, "Xóa bài giảng thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
