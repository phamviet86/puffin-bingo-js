// path: @/service/schedules-service.js

import { neonDB } from "@/lib/db/neon-db";
import { parseSearchParams } from "@/lib/util/query-util";

const sql = neonDB();

export async function getSchedules(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT *, COUNT(*) OVER() AS total
      FROM schedules
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

export async function getSchedule(id) {
  try {
    return await sql`
      SELECT *
      FROM schedules
      WHERE deleted_at IS NULL AND id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createSchedule(data) {
  try {
    const {
      source_id,
      class_id,
      lecture_id,
      shift_id,
      room_id,
      schedule_date,
      schedule_status_id,
      schedule_desc,
    } = data;

    return await sql`
      INSERT INTO schedules (
        source_id, class_id, lecture_id, shift_id, room_id, schedule_date, schedule_status_id, schedule_desc
      ) VALUES (
        ${source_id}, ${class_id}, ${lecture_id}, ${shift_id}, ${room_id}, ${schedule_date}, ${schedule_status_id}, ${schedule_desc}
      )
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateSchedule(data, id) {
  try {
    const {
      source_id,
      class_id,
      lecture_id,
      shift_id,
      room_id,
      schedule_date,
      schedule_status_id,
      schedule_desc,
    } = data;

    return await sql`
      UPDATE schedules
      SET source_id = ${source_id}, class_id = ${class_id}, lecture_id = ${lecture_id}, shift_id = ${shift_id}, room_id = ${room_id}, schedule_date = ${schedule_date}, schedule_status_id = ${schedule_status_id}, schedule_desc = ${schedule_desc}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteSchedule(id) {
  try {
    return await sql`
      UPDATE schedules
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}
