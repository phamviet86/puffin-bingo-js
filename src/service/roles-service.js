// path: @/service/roles-service.js

import { neonDB } from "@/lib/db/neon-db";
import { parseSearchParams } from "@/lib/util/query-util";

const sql = neonDB();

export async function getRoles(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT *, COUNT(*) OVER() AS total
      FROM roles
      WHERE deleted_at IS NULL
      ${whereClause}
      ${orderByClause || "ORDER BY created_at"}
      ${limitClause};
    `;

    return await sql.query(sqlText, sqlValue);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getRole(id) {
  try {
    return await sql`
      SELECT *
      FROM roles
      WHERE deleted_at IS NULL AND id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createRole(data) {
  try {
    const { role_name, role_path, role_status_id } = data;

    return await sql`
      INSERT INTO roles (
        role_name, role_path, role_status_id
      ) VALUES (
        ${role_name}, ${role_path}, ${role_status_id}
      )
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateRole(data, id) {
  try {
    const { role_name, role_path, role_status_id } = data;

    return await sql`
      UPDATE roles
      SET role_name = ${role_name}, role_path = ${role_path}, role_status_id = ${role_status_id}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteRole(id) {
  try {
    return await sql`
      UPDATE roles
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}
