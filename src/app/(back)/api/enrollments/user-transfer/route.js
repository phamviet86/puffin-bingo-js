// path: @/app/(back)/api/enrollments/class-transfer/route.js

import {
  createClassEnrollmentsByUser,
  deleteClassEnrollmentsByUser,
  createModuleEnrollmentsByUser,
  deleteModuleEnrollmentsByUser,
} from "@/service/enrollments-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function POST(request) {
  try {
    const {
      user_id,
      classIds = [],
      moduleIds = [],
      enrollment_type_id,
    } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!user_id || !enrollment_type_id || (!classIds && !moduleIds))
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    let result = [];

    // Create enrollments for classes
    if (classIds && Array.isArray(classIds) && classIds.length > 0) {
      result = await createClassEnrollmentsByUser(
        user_id,
        classIds,
        enrollment_type_id
      );
    }

    // Create enrollments for modules
    if (moduleIds && Array.isArray(moduleIds) && moduleIds.length > 0) {
      result = await createModuleEnrollmentsByUser(
        user_id,
        moduleIds,
        enrollment_type_id
      );
    }

    if (!result || !result.length)
      return buildApiResponse(404, false, "Không thể thêm đăng ký.");

    return buildApiResponse(201, true, "Thêm đăng ký thành công", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function DELETE(request) {
  try {
    const { user_id, classIds = [], moduleIds = [] } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!user_id || (!classIds && !moduleIds))
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    let result = [];

    // Delete enrollments for classes
    if (classIds && Array.isArray(classIds) && classIds.length > 0) {
      result = await deleteClassEnrollmentsByUser(user_id, classIds);
    }

    // Delete enrollments for modules
    if (moduleIds && Array.isArray(moduleIds) && moduleIds.length > 0) {
      result = await deleteModuleEnrollmentsByUser(user_id, moduleIds);
    }

    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy đăng ký để xóa");

    return buildApiResponse(200, true, "Xóa đăng ký thành công", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
