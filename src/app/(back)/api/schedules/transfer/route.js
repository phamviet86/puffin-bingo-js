import {
  duplicateSchedules,
  deleteSchedulesBySource,
} from "@/service/schedules-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function POST(request) {
  try {
    const { ids } = await request.json();
    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!Array.isArray(ids) || ids.length === 0)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const result = await duplicateSchedules(ids);

    if (!result || !result.length)
      return buildApiResponse(404, false, "Không thể thêm lịch học.");

    return buildApiResponse(201, true, "Thêm lịch học thành công", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function DELETE(request) {
  try {
    const { sourceIds } = await request.json();
    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!Array.isArray(sourceIds) || sourceIds.length === 0)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const result = await deleteSchedulesBySource(sourceIds);

    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy lịch học để xóa");

    return buildApiResponse(200, true, "Xóa lịch học thành công", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
