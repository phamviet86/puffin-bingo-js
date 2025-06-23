// path: @/app/(back)/api/rooms/[id]/route.js

import { getRoom, updateRoom, deleteRoom } from "@/service/rooms-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function GET(_, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID phòng học.");

    const result = await getRoom(id);
    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy phòng học.");

    return buildApiResponse(200, true, "Lấy thông tin phòng học thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID phòng học.");

    const {
      room_name,
      room_status_id,
      room_desc = null,
    } = await request.json();

    // Validate required fields (dựa vào NOT NULL trong SQL)
    if (!room_name || !room_status_id)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      room_name,
      room_status_id,
      room_desc,
    };

    const result = await updateRoom(data, id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy phòng học hoặc phòng học đã bị xóa."
      );

    return buildApiResponse(200, true, "Cập nhật phòng học thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function DELETE(_, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID phòng học.");

    const result = await deleteRoom(id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy phòng học hoặc phòng học đã bị xóa."
      );

    return buildApiResponse(200, true, "Xóa phòng học thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
