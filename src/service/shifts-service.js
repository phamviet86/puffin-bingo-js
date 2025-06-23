// path: @/service/shifts-service.js

import { neonDB } from "@/lib/db/neon-db";
import { parseSearchParams } from "@/lib/util/query-util";

const sql = neonDB();

export async function getShifts(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT *, COUNT(*) OVER() AS total
      FROM shifts
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

export async function getShift(id) {
  try {
    return await sql`
      SELECT *
      FROM shifts
      WHERE deleted_at IS NULL AND id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createShift(data) {
  try {
    const {
      shift_name,
      shift_start_time,
      shift_end_time,
      shift_status_id,
      shift_desc,
    } = data;

    return await sql`
      INSERT INTO shifts (
        shift_name, shift_start_time, shift_end_time, shift_status_id, shift_desc
      ) VALUES (
        ${shift_name}, ${shift_start_time}, ${shift_end_time}, ${shift_status_id}, ${shift_desc}
      )
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateShift(data, id) {
  try {
    const {
      shift_name,
      shift_start_time,
      shift_end_time,
      shift_status_id,
      shift_desc,
    } = data;

    return await sql`
      UPDATE shifts
      SET shift_name = ${shift_name}, shift_start_time = ${shift_start_time}, shift_end_time = ${shift_end_time}, shift_status_id = ${shift_status_id}, shift_desc = ${shift_desc}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteShift(id) {
  try {
    return await sql`
      UPDATE shifts
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}
