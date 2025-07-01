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
        co.course_name, co.course_code,
        m.module_name, 
        l.lecture_name,
        sh.shift_start_time, sh.shift_end_time, sh.shift_name,
        r.room_name,
        o.option_color AS schedule_status_color,
        COUNT(*) OVER() AS total
      FROM schedules s
      LEFT JOIN classes c ON c.id = s.class_id AND c.deleted_at IS NULL
      LEFT JOIN courses co ON co.id = c.course_id AND co.deleted_at IS NULL
      LEFT JOIN modules m ON m.id = c.module_id AND m.deleted_at IS NULL
      LEFT JOIN lectures l ON l.id = s.lecture_id AND l.deleted_at IS NULL
      LEFT JOIN shifts sh ON sh.id = s.shift_id AND sh.deleted_at IS NULL
      LEFT JOIN rooms r ON r.id = s.room_id AND r.deleted_at IS NULL
      LEFT JOIN options o ON o.id = s.schedule_status_id AND o.deleted_at IS NULL
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
        co.course_name, co.course_code,
        m.module_name, 
        l.lecture_name,
        sh.shift_start_time, sh.shift_end_time, sh.shift_name,
        r.room_name,
        o.option_color AS schedule_status_color,
        COUNT(*) OVER() AS total
      FROM schedules s
      LEFT JOIN classes c ON c.id = s.class_id AND c.deleted_at IS NULL
      LEFT JOIN courses co ON co.id = c.course_id AND co.deleted_at IS NULL
      LEFT JOIN modules m ON m.id = c.module_id AND m.deleted_at IS NULL
      LEFT JOIN lectures l ON l.id = s.lecture_id AND l.deleted_at IS NULL
      LEFT JOIN shifts sh ON sh.id = s.shift_id AND sh.deleted_at IS NULL
      LEFT JOIN rooms r ON r.id = s.room_id AND r.deleted_at IS NULL
      LEFT JOIN options o ON o.id = s.schedule_status_id AND o.deleted_at IS NULL
      WHERE s.deleted_at IS NULL AND  s.id = ${id};
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

// Duplicate multiple schedules by their IDs, incrementing schedule_date by 7 days
export async function duplicateSchedules(ids) {
  try {
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(", ");

    const queryText = `
      INSERT INTO schedules (source_id, class_id, shift_id, schedule_date, schedule_status_id)
      SELECT id, class_id, shift_id, schedule_date + INTERVAL '7 days', 23
      FROM schedules
      WHERE id IN (${placeholders}) AND deleted_at IS NULL
      RETURNING *;
    `;
    const queryValues = ids;

    return await sql.query(queryText, queryValues);
  } catch (error) {
    throw new Error(error.message);
  }
}

// Soft-delete multiple schedules by their source IDs
export async function deleteSchedulesBySource(sourceIds) {
  try {
    const placeholders = sourceIds
      .map((_, index) => `$${index + 1}`)
      .join(", ");

    const queryText = `
      UPDATE schedules
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL 
        AND source_id IN (${placeholders})
      RETURNING *;
    `;
    const queryValues = sourceIds;

    return await sql.query(queryText, queryValues);
  } catch (error) {
    throw new Error(error.message);
  }
}
