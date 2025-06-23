// path: @/app/(back)/api/modules/route.js

import { getModules, createModule } from "@/service/modules-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getModules(searchParams);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách học phần thành công", {
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
      syllabus_id,
      module_name,
      module_status_id,
      module_desc = null,
    } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!syllabus_id || !module_name || !module_status_id)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      syllabus_id,
      module_name,
      module_status_id,
      module_desc,
    };

    const result = await createModule(data);

    if (!result || !result.length)
      return buildApiResponse(500, false, "Không thể thực hiện thao tác.");

    return buildApiResponse(201, true, "Tạo học phần thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
