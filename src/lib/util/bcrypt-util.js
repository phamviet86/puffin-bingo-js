// path: @/lib/util/bcrypt-util.js

import bcrypt from "bcrypt";

/**
 * @description Hash password using bcrypt.
 *
 * @param {string} password - The plaintext password.
 * @returns {Promise<string|boolean>} - The hashed password or false if an error occurs.
 */
export async function hashPassword(password) {
  if (!password) {
    console.error("Thiếu mật khẩu để băm");
    return false;
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.error(
      `Lỗi trong hàm hashPassword: Không thể băm mật khẩu "${password}":`,
      error.message
    );
    return false;
  }
}

/**
 * @description Compare a plaintext password with a hashed password.
 *
 * @param {string} password - The plaintext password.
 * @param {string} hashedPassword - The hashed password.
 * @returns {Promise<boolean>} - True if passwords match, else false.
 */
export async function comparePassword(password, hashedPassword) {
  if (!password || !hashedPassword) {
    console.error("Cần cả mật khẩu và mật khẩu đã băm để so sánh");
    return false;
  }
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    console.error("Không thể so sánh mật khẩu:", error.message);
    return false;
  }
}
