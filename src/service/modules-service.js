// path: @/service/modules-service.js

import { neonDB } from "@/lib/db/neon-db";
import { parseSearchParams } from "@/lib/util/query-util";

const sql = neonDB();

export async function getModules(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT m.*,
        s.syllabus_name,
        COUNT(*) OVER() AS total
      FROM modules m
      JOIN syllabuses s ON m.syllabus_id = s.id AND s.deleted_at IS NULL
      WHERE m.deleted_at IS NULL
      ${whereClause}
      ${orderByClause || "ORDER BY s.syllabus_name,  m.module_name"}
      ${limitClause};
    `;

    return await sql.query(sqlText, sqlValue);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getModule(id) {
  try {
    return await sql`
      SELECT m.*,
        s.syllabus_name,
        COUNT(*) OVER() AS total
      FROM modules m
      JOIN syllabuses s ON m.syllabus_id = s.id AND s.deleted_at IS NULL
      WHERE m.deleted_at IS NULL AND m.id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createModule(data) {
  try {
    const { syllabus_id, module_name, module_status_id, module_desc } = data;

    return await sql`
      INSERT INTO modules (
        syllabus_id, module_name, module_status_id, module_desc
      ) VALUES (
        ${syllabus_id}, ${module_name}, ${module_status_id}, ${module_desc}
      )
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateModule(data, id) {
  try {
    const { syllabus_id, module_name, module_status_id, module_desc } = data;

    return await sql`
      UPDATE modules
      SET syllabus_id = ${syllabus_id}, module_name = ${module_name}, module_status_id = ${module_status_id}, module_desc = ${module_desc}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteModule(id) {
  try {
    return await sql`
      UPDATE modules
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}
