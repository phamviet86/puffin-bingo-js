// path: @/lib/util/fetch-util.js

import { buildSearchParams } from "@/lib/util/query-util";

/**
 * Thực hiện fetch request và xử lý response
 * @param {string} url - URL để gửi request
 * @param {RequestInit} options - Các tùy chọn cho fetch request
 * @returns {Promise<any>} Promise trả về dữ liệu JSON đã parse
 * @throws {Error} Ném lỗi nếu request không thành công
 */
async function performFetch(url, options) {
  const result = await fetch(url, options);

  if (!result.ok) {
    const errorData = await result.json();
    throw new Error(errorData.message);
  }
  return result.json();
}

/**
 * Lấy danh sách dữ liệu với các tham số tìm kiếm, sắp xếp và lọc
 * @param {string} url - URL API endpoint
 * @param {Object} [params={}] - Các tham số tìm kiếm (sẽ được chuyển thành query string)
 * @param {Object} [sort={}] - Đối tượng sắp xếp, ví dụ: { createdAt: 'descend', name: 'ascend' }
 * @param {Object} [filter={}] - Đối tượng lọc, ví dụ: { status: ['active', 'inactive'] }
 * @returns {Promise<Object>} Promise trả về danh sách dữ liệu
 * @throws {Error} Ném lỗi nếu request không thành công
 *
 * @example
 * const users = await fetchList('/api/users',
 *   { name: 'John', age: '_gt 18' },
 *   { createdAt: 'descend' },
 *   { status: ['active'] }
 * );
 */
export async function fetchList(url, params = {}, sort = {}, filter = {}) {
  const searchParams = buildSearchParams(params, sort, filter);
  return performFetch(`${url}?${searchParams}`, { method: "GET" });
}

/**
 * Lấy thông tin chi tiết của một bản ghi theo ID
 * @param {string} url - URL API endpoint
 * @returns {Promise<Object>} Promise trả về thông tin chi tiết của bản ghi
 * @throws {Error} Ném lỗi nếu request không thành công
 *
 * @example
 * const user = await fetchGet('/api/users', 123);
 */
export async function fetchGet(url) {
  return performFetch(url, { method: "GET" });
}

/**
 * Tạo mới một bản ghi
 * @param {string} url - URL API endpoint
 * @param {Object} [values={}] - Dữ liệu để tạo bản ghi mới
 * @returns {Promise<Object>} Promise trả về thông tin bản ghi đã tạo
 * @throws {Error} Ném lỗi nếu request không thành công
 *
 * @example
 * const newUser = await fetchPost('/api/users', {
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * });
 */
export async function fetchPost(url, values = {}) {
  return performFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
}

/**
 * Cập nhật một phần thông tin của bản ghi (partial update)
 * @param {string} url - URL API endpoint (bao gồm ID trong đường dẫn)
 * @param {Object} [values={}] - Dữ liệu cần cập nhật (chỉ các trường thay đổi)
 * @returns {Promise<Object>} Promise trả về thông tin bản ghi đã cập nhật
 * @throws {Error} Ném lỗi nếu request không thành công
 *
 * @example
 * const updatedUser = await fetchPatch('/api/users/123', {
 *   name: 'John Smith'
 * });
 */
export async function fetchPatch(url, values = {}) {
  return performFetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
}

/**
 * Cập nhật toàn bộ thông tin của bản ghi
 * @param {string} url - URL API endpoint (bao gồm ID trong đường dẫn)
 * @param {Object} [values={}] - Dữ liệu để thay thế toàn bộ bản ghi
 * @returns {Promise<Object>} Promise trả về thông tin bản ghi đã cập nhật
 * @throws {Error} Ném lỗi nếu request không thành công
 *
 * @example
 * const updatedUser = await fetchPut('/api/users/123', {
 *   name: 'John Smith',
 *   email: 'johnsmith@example.com',
 *   status: 'active'
 * });
 */
export async function fetchPut(url, values = {}) {
  return performFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
}

/**
 * Xóa một bản ghi
 * @param {string} url - URL API endpoint (bao gồm ID trong đường dẫn)
 * @returns {Promise<Object>} Promise trả về kết quả xóa
 * @throws {Error} Ném lỗi nếu request không thành công
 *
 * @example
 * const result = await fetchDelete('/api/users/123');
 */
export async function fetchDelete(url, values = {}) {
  return performFetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
}

export async function fetchOption(
  url,
  params = {},
  optionConfig = { label: "id", value: "id" }
) {
  const searchParams = buildSearchParams(params);
  const result = await performFetch(`${url}?${searchParams}`, {
    method: "GET",
  });

  // Xử lý kết quả và chuyển đổi thành format option
  if (result.success && Array.isArray(result.data)) {
    return result.data.map((item) => ({
      value: item[optionConfig.value],
      label: item[optionConfig.label],
    }));
  }

  // Trả về mảng rỗng nếu không có dữ liệu
  return [];
}
