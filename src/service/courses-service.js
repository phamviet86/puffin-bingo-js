// path: @/service/courses-service.js

import { neonDB } from "@/lib/db/neon-db";
import { parseSearchParams } from "@/lib/util/query-util";

const sql = neonDB();

export async function getCourses(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT *, COUNT(*) OVER() AS total
      FROM courses
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

export async function getCourse(id) {
  try {
    return await sql`
      SELECT *
      FROM courses
      WHERE deleted_at IS NULL AND id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createCourse(data) {
  try {
    const { course_name, course_code } = data;

    return await sql`
      INSERT INTO courses (
        course_name, course_code
      ) VALUES (
        ${course_name}, ${course_code}
      )
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateCourse(data, id) {
  try {
    const { course_name, course_code } = data;

    return await sql`
      UPDATE courses
      SET course_name = ${course_name}, course_code = ${course_code}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteCourse(id) {
  try {
    return await sql`
      UPDATE courses
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}
