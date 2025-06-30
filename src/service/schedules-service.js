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
      SELECT 
        s.*,
        o.option_color AS schedule_status_color,
        co.course_name, co.course_code, 
        r.room_name,
        m.module_name, 
        l.lecture_name,
        COUNT(*) OVER() AS total
      FROM schedules s
      JOIN options o ON s.schedule_status_id = o.id AND o.deleted_at IS NULL 
      JOIN shifts sh ON s.shift_id = sh.id AND sh.deleted_at IS NULL
      JOIN classes c ON s.class_id = c.id AND c.deleted_at IS NULL
      JOIN courses co ON c.id = co.id AND co.deleted_at IS NULL
      JOIN modules m ON c.id = m.id AND m.deleted_at IS NULL
      LEFT JOIN lectures l ON s.lecture_id = l.id AND l.deleted_at IS NULL
      LEFT JOIN rooms r ON s.room_id = r.id AND r.deleted_at IS NULL
      WHERE s.deleted_at IS NULL
      ${whereClause}
      ${
        orderByClause ||
        "ORDER BY schedule_date, shift_start_time, shift_end_time"
      }
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
      SELECT 
        s.*,
        o.option_color AS schedule_status_color,
        co.course_name, co.course_code, 
        r.room_name,
        m.module_name, 
        l.lecture_name,
        COUNT(*) OVER() AS total
      FROM schedules s
      JOIN options o ON s.schedule_status_id = o.id AND o.deleted_at IS NULL 
      JOIN shifts sh ON s.shift_id = sh.id AND sh.deleted_at IS NULL
      JOIN classes c ON s.class_id = c.id AND c.deleted_at IS NULL
      JOIN courses co ON c.id = co.id AND co.deleted_at IS NULL
      JOIN modules m ON c.id = m.id AND m.deleted_at IS NULL
      LEFT JOIN lectures l ON s.lecture_id = l.id AND l.deleted_at IS NULL
      LEFT JOIN rooms r ON s.room_id = r.id AND r.deleted_at IS NULL
      WHERE s.deleted_at IS NULL AND s.id = ${id};
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
