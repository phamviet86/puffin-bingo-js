// path: @/lib/db/neon-db.js

import { neon } from "@neondatabase/serverless";

/**
 * Tạo kết nối đến cơ sở dữ liệu Neon PostgreSQL
 * Sử dụng ở service layer để thực hiện các truy vấn cơ sở dữ liệu.
 *
 * @returns {Function} Hàm sql để thực hiện các truy vấn cơ sở dữ liệu
 * @throws {Error} Ném lỗi nếu DATABASE_URL không được định nghĩa trong biến môi trường
 *
 * @example
 * // Cách 1: Sử dụng template literals (được khuyến nghị vì an toàn hơn)
 * const sql = neonDB();
 * const comment = "Đây là bình luận mẫu";
 * await sql`INSERT INTO comments (comment) VALUES (${comment})`;
 *
 * @example
 * // Cách 2: Sử dụng parameterized query
 * const sql = neonDB();
 * const comment = "Đây là bình luận mẫu";
 * await sql.query("INSERT INTO comments (comment) VALUES ($1)", [comment]);
 */
export function neonDB() {
  const { DATABASE_URL } = process.env;

  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in the environment variables");
  }
  const sql = neon(DATABASE_URL);
  return sql;
}
