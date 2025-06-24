// path: @/service/user-roles-service.js

import { neonDB } from "@/lib/db/neon-db";
import { parseSearchParams } from "@/lib/util/query-util";

const sql = neonDB();

export async function getUserRoles(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT ur.*,
        r.role_name,
        COUNT(*) OVER() AS total
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id AND r.deleted_at IS NULL
      WHERE ur.deleted_at IS NULL
      ${whereClause}
      ${orderByClause || "ORDER BY created_at"}
      ${limitClause};
    `;

    return await sql.query(sqlText, sqlValue);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getUserRole(id) {
  try {
    return await sql`
      SELECT ur.*,
        r.role_name
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id AND r.deleted_at IS NULL
      WHERE deleted_at IS NULL AND id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createUserRole(data) {
  try {
    const { user_id, role_id } = data;

    return await sql`
      INSERT INTO user_roles (
        user_id, role_id
      ) VALUES (
        ${user_id}, ${role_id}
      )
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateUserRole(data, id) {
  try {
    const { user_id, role_id } = data;

    return await sql`
      UPDATE user_roles
      SET user_id = ${user_id}, role_id = ${role_id}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteUserRole(id) {
  try {
    return await sql`
      UPDATE user_roles
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}
