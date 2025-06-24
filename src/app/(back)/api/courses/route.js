// path: @/app/(back)/api/courses/route.js

import { getCourses, createCourse } from "@/service/courses-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getCourses(searchParams);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách khóa học thành công", {
      data,
      total,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function POST(request) {
  try {
    const { course_name, course_code } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!course_name || !course_code)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      course_name,
      course_code,
    };

    const result = await createCourse(data);

    if (!result || !result.length)
      return buildApiResponse(500, false, "Không thể thực hiện thao tác.");

    return buildApiResponse(201, true, "Tạo khóa học thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
