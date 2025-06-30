// path: @/app/(back)/api/schedules/[id]/route.js

import {
  getSchedule,
  updateSchedule,
  deleteSchedule,
} from "@/service/schedules-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function GET(_, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID lịch học.");

    const result = await getSchedule(id);
    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy lịch học.");

    return buildApiResponse(200, true, "Lấy thông tin lịch học thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID lịch học.");

    const {
      class_id,
      shift_id,
      schedule_date,
      schedule_status_id,
      source_id = null,
      lecture_id = null,
      room_id = null,
      schedule_desc = null,
    } = await request.json();

    // Validate required fields (dựa vào NOT NULL trong SQL)
    if (!class_id || !shift_id || !schedule_date || !schedule_status_id)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      class_id,
      shift_id,
      schedule_date,
      schedule_status_id,
      source_id,
      lecture_id,
      room_id,
      schedule_desc,
    };

    const result = await updateSchedule(data, id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy lịch học hoặc lịch học đã bị xóa."
      );

    return buildApiResponse(200, true, "Cập nhật lịch học thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function DELETE(_, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID lịch học.");

    const result = await deleteSchedule(id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy lịch học hoặc lịch học đã bị xóa."
      );

    return buildApiResponse(200, true, "Xóa lịch học thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
