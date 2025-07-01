// path: @/app/(back)/api/schedules/route.js

import { getSchedules, createSchedule } from "@/service/schedules-service";
import { getClass } from "@/service/classes-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";
import { isDateInRange } from "@/lib/util/check-util";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getSchedules(searchParams);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách lịch học thành công", {
      data,
      total,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function POST(request) {
  try {
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

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!class_id || !shift_id || !schedule_date || !schedule_status_id)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    // get Class to check if it exists
    const classExists = await getClass(class_id);
    if (!classExists || !classExists.length)
      return buildApiResponse(404, false, "Không tìm thấy lộ trình.");

    // Check if the schedule_date is within the class's start and end dates
    const { class_start_date, class_end_date } = classExists[0];
    const isValidDate = isDateInRange(
      class_start_date,
      class_end_date,
      schedule_date
    );
    if (!isValidDate) {
      // Format dates for display in error message
      const formatDate = (date) => {
        if (!date) return "không xác định";
        return new Date(date).toLocaleDateString("vi-VN");
      };

      let errorMsg = "";
      if (class_start_date && class_end_date) {
        // Case 1: Both start and end dates exist
        errorMsg = `Ngày học phải nằm trong khoảng từ ${formatDate(
          class_start_date
        )} đến ${formatDate(class_end_date)}`;
      } else if (class_start_date && !class_end_date) {
        // Case 2: Only start date exists
        errorMsg = `Ngày học phải từ ${formatDate(class_start_date)} trở đi`;
      } else {
        // Fallback message
        errorMsg = "Ngày học không hợp lệ.";
      }

      return buildApiResponse(400, false, errorMsg);
    }

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

    const result = await createSchedule(data);

    if (!result || !result.length)
      return buildApiResponse(500, false, "Không thể thực hiện thao tác.");

    return buildApiResponse(201, true, "Tạo lịch học thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
