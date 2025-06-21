// path: @/lib/util/response-util.js

import { NextResponse } from "next/server";

/**
 * Xây dựng phản hồi API chuẩn với format thống nhất
 * @param {number} status - Mã trạng thái HTTP (200, 400, 500, ...)
 * @param {boolean} success - Trạng thái thành công của request
 * @param {string} message - Thông báo mô tả kết quả
 * @param {Object} [data={}] - Dữ liệu trả về (chỉ hiển thị khi success = true)
 * @param {Object|null} [cookies=null] - Thông tin cookie cần thiết lập
 * @param {string} cookies.name - Tên của cookie
 * @param {string} cookies.value - Giá trị của cookie
 * @param {Object} cookies.options - Các tùy chọn cho cookie (httpOnly, secure, maxAge, ...)
 * @returns {NextResponse} Đối tượng NextResponse đã được format
 *
 * @example
 * // Phản hồi thành công với dữ liệu
 * return buildApiResponse(200, true, "Lấy dữ liệu thành công", { users: [...] });
 *
 * @example
 * // Phản hồi lỗi
 * return buildApiResponse(400, false, "Dữ liệu không hợp lệ");
 *
 * @example
 * // Phản hồi với cookie
 * return buildApiResponse(200, true, "Đăng nhập thành công", { user }, {
 *   name: "token",
 *   value: "jwt-token-here",
 *   options: { httpOnly: true, maxAge: 3600 }
 * });
 */
export function buildApiResponse(
  status,
  success,
  message,
  data = {},
  cookies = null
) {
  const responseBody = {
    success,
    message,
    ...(success ? data : {}),
  };

  const response = NextResponse.json(responseBody, {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

  if (cookies?.name && cookies?.value) {
    response.cookies.set(cookies.name, cookies.value, cookies.options);
  }
  return response;
}

/**
 * Xử lý dữ liệu trả về từ database, chuẩn hóa về dạng { data, count, total }
 * @param {Array} result - Mảng kết quả truy vấn từ database
 * @returns {{ data: Array, count: number, total: number }} Đối tượng chứa dữ liệu đã xử lý
 *
 * @example
 * // Khi có dữ liệu
 * handleData([{ id: 1, name: "A", total: 10 }, { id: 2, name: "B", total: 10 }])
 * // => { data: [{ id: 1, name: "A" }, { id: 2, name: "B" }], count: 2, total: 10 }
 *
 * @example
 * // Khi không có dữ liệu
 * handleData([])
 * // => { data: [], count: 0, total: 0 }
 */
export function handleData(result) {
  if (!Array.isArray(result)) {
    return {
      data: [],
      count: 0,
      total: 0,
    };
  }

  if (result.length === 0) {
    return { data: [], count: 0, total: 0 };
  }

  const formattedData = result.map(
    ({ total, ...remainingData }) => remainingData
  );
  // const recordCount = result.length;
  const totalRecords = parseInt(result[0]?.total, 10) || recordCount;

  const processedResult = {
    data: formattedData,
    // count: recordCount,
    total: totalRecords,
  };

  return processedResult;
}
