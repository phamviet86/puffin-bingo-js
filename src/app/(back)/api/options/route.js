import {
  getOptions,
  createOption,
  updateOption,
} from "@/service/options-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getOptions(searchParams);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách tùy chọn thành công", {
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
      id = null,
      option_table,
      option_column,
      option_label,
      option_color = null,
      option_group = null,
    } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!option_table || !option_column || !option_label)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      option_table,
      option_column,
      option_label,
      option_color,
      option_group,
    };

    let result;
    let message;
    let statusCode;

    if (id !== null) {
      // Update existing option
      result = await updateOption(data, id);
      message = "Cập nhật tùy chọn thành công.";
      statusCode = 200;
    } else {
      // Create new option
      result = await createOption(data);
      message = "Tạo tùy chọn thành công.";
      statusCode = 201;
    }

    if (!result || !result.length)
      return buildApiResponse(500, false, "Không thể thực hiện thao tác.");

    return buildApiResponse(statusCode, true, message, {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
