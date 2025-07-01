// path: @/service/classes-service.js

import { neonDB } from "@/lib/db/neon-db";
import { parseSearchParams } from "@/lib/util/query-util";

const sql = neonDB();

export async function getClasses(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT c.*,
        co.course_name, co.course_code,
        m.module_name,
        s.syllabus_name,
        COUNT(*) OVER() AS total
      FROM classes_view c
      LEFT JOIN courses co ON c.course_id = co.id AND co.deleted_at IS NULL
      LEFT JOIN modules m ON c.module_id = m.id AND m.deleted_at IS NULL
      LEFT JOIN syllabuses s ON m.syllabus_id = s.id AND s.deleted_at IS NULL
      LEFT JOIN schedules_summary ss ON c.id = ss.class_id
      WHERE c.deleted_at IS NULL
      ${whereClause}
      ${orderByClause || "ORDER BY c.class_start_date, c.class_end_date"}
      ${limitClause};
    `;

    return await sql.query(sqlText, sqlValue);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getClass(id) {
  try {
    return await sql`
      SELECT c.*,
        co.course_name, co.course_code,
        m.module_name,
        s.syllabus_name,
        COUNT(*) OVER() AS total
      FROM classes_view c
      LEFT JOIN courses co ON c.course_id = co.id
      LEFT JOIN modules m ON c.module_id = m.id
      LEFT JOIN syllabuses s ON m.syllabus_id = s.id
      LEFT JOIN schedules_summary ss ON c.id = ss.class_id
      WHERE c.deleted_at IS NULL AND c.id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createClass(data) {
  try {
    const {
      course_id,
      module_id,
      class_start_date,
      class_end_date,
      class_fee,
      class_total_fee,
    } = data;

    return await sql`
      INSERT INTO classes (
        course_id, module_id, class_start_date, class_end_date, class_fee, class_total_fee
      ) VALUES (
        ${course_id}, ${module_id}, ${class_start_date}, ${class_end_date}, ${class_fee}, ${class_total_fee}
      )
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateClass(data, id) {
  try {
    const {
      course_id,
      module_id,
      class_start_date,
      class_end_date,
      class_fee,
      class_total_fee,
    } = data;

    return await sql`
      UPDATE classes
      SET course_id = ${course_id}, module_id = ${module_id}, class_start_date = ${class_start_date}, class_end_date = ${class_end_date}, class_fee = ${class_fee}, class_total_fee = ${class_total_fee}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteClass(id) {
  try {
    return await sql`
      UPDATE classes
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Create multiple classes by course ID and module IDs
export async function createClassesByCourse(courseId, moduleIds) {
  try {
    const queryValues = [];
    const valuePlaceholders = moduleIds
      .map((moduleId, index) => {
        queryValues.push(courseId, moduleId);
        return `($${index * 2 + 1}, $${index * 2 + 2})`;
      })
      .join(", ");

    const queryText = `
      INSERT INTO classes (course_id, module_id)
      VALUES ${valuePlaceholders}
      RETURNING *;
    `;

    return await sql.query(queryText, queryValues);
  } catch (error) {
    throw new Error(error.message);
  }
}

// Soft-delete multiple classes by course ID and module IDs
export async function deleteClassesByCourse(courseId, moduleIds) {
  try {
    const placeholders = moduleIds
      .map((_, index) => `$${index + 2}`)
      .join(", ");

    const queryText = `
      UPDATE classes
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL
        AND course_id = $1
        AND module_id IN (${placeholders})
      RETURNING *;
    `;

    const queryValues = [courseId, ...moduleIds];
    return await sql.query(queryText, queryValues);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getClassesSummary(searchParams, startDate, endDate) {
  try {
    const ignoredSearchColumns = ["startDate", "endDate"];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [startDate, endDate, ...queryValues];
    const sqlText = `
      SELECT 
        c.id, c.class_start_date, c.class_end_date, c.class_status,
        co.course_name, co.course_code, 
        m.module_name,
        s.syllabus_name,
        COUNT(sv.schedule_pending) AS pending_count,
        COUNT(sv.schedule_completed) AS completed_count,
        COUNT(sv.schedule_absent) AS absent_count,
        COUNT(*) OVER() AS total
      FROM classes_view c
      LEFT JOIN courses co ON c.course_id = co.id AND co.deleted_at IS NULL
      LEFT JOIN modules m ON c.module_id = m.id AND m.deleted_at IS NULL
      LEFT JOIN syllabuses s ON m.syllabus_id = s.id AND s.deleted_at IS NULL
      LEFT JOIN schedules_view sv ON c.id = sv.class_id AND sv.deleted_at IS NULL AND sv.schedule_date >= $1 AND sv.schedule_date < $2
      WHERE c.deleted_at IS NULL 
      ${whereClause}
      GROUP BY c.id, c.class_start_date, c.class_end_date, c.class_status, co.course_name, co.course_code, m.module_name, s.syllabus_name
      ${orderByClause || "ORDER BY course_name, module_name"}
      ${limitClause};
    `;

    return await sql.query(sqlText, sqlValue);
  } catch (error) {
    throw new Error(error.message);
  }
}
