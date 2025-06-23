// path: @/app/(back)/api/lectures/route.js

import { getLectures, createLecture } from "@/service/lectures-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getLectures(searchParams);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách bài giảng thành công", {
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
      module_id,
      lecture_name,
      lecture_status_id,
      lecture_no = null,
      lecture_desc = null,
    } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!module_id || !lecture_name || !lecture_status_id)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      module_id,
      lecture_name,
      lecture_status_id,
      lecture_no,
      lecture_desc,
    };

    const result = await createLecture(data);

    if (!result || !result.length)
      return buildApiResponse(500, false, "Không thể thực hiện thao tác.");

    return buildApiResponse(201, true, "Tạo bài giảng thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
