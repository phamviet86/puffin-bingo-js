import {
  getOption,
  updateOption,
  deleteOption,
} from "@/service/options-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function GET(_, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID tùy chọn.");

    const result = await getOption(id);
    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy tùy chọn.");

    return buildApiResponse(200, true, "Lấy thông tin tùy chọn thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID tùy chọn.");

    const {
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

    const result = await updateOption(data, id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy tùy chọn hoặc tùy chọn đã bị xóa."
      );

    return buildApiResponse(200, true, "Cập nhật tùy chọn thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function DELETE(_, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID tùy chọn.");

    const result = await deleteOption(id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy tùy chọn hoặc tùy chọn đã bị xóa."
      );

    return buildApiResponse(200, true, "Xóa tùy chọn thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
