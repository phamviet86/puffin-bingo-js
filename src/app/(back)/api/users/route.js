// path: @/app/(back)/api/users/route.js

import { getUsers, createUser } from "@/service/users-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getUsers(searchParams);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách người dùng thành công", {
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
      user_name,
      user_status_id,
      user_email,
      user_password,
      user_phone = null,
      user_parent_phone = null,
      user_avatar = null,
      user_desc = null,
      user_notes = null,
    } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!user_name || !user_status_id || !user_email || !user_password)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      user_name,
      user_status_id,
      user_email,
      user_password,
      user_phone,
      user_parent_phone,
      user_avatar,
      user_desc,
      user_notes,
    };

    const result = await createUser(data);

    if (!result || !result.length)
      return buildApiResponse(500, false, "Không thể thực hiện thao tác.");

    return buildApiResponse(201, true, "Tạo người dùng thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
