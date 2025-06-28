// path: @/service/enrollments-service.js

import { neonDB } from "@/lib/db/neon-db";
import { parseSearchParams } from "@/lib/util/query-util";

const sql = neonDB();

export async function getEnrollments(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT *, COUNT(*) OVER() AS total
      FROM enrollments
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

export async function getEnrollment(id) {
  try {
    return await sql`
      SELECT *
      FROM enrollments
      WHERE deleted_at IS NULL AND id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createEnrollment(data) {
  try {
    const {
      user_id,
      module_id,
      class_id,
      enrollment_type_id,
      enrollment_payment_type_id,
      enrollment_payment_amount,
      enrollment_payment_discount,
      enrollment_start_date,
      enrollment_end_date,
    } = data;

    return await sql`
      INSERT INTO enrollments (
        user_id, module_id, class_id, enrollment_type_id, enrollment_payment_type_id,
        enrollment_payment_amount, enrollment_payment_discount, enrollment_start_date, enrollment_end_date
      ) VALUES (
        ${user_id}, ${module_id}, ${class_id}, ${enrollment_type_id}, ${enrollment_payment_type_id},
        ${enrollment_payment_amount}, ${enrollment_payment_discount}, ${enrollment_start_date}, ${enrollment_end_date}
      )
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateEnrollment(data, id) {
  try {
    const {
      user_id,
      module_id,
      class_id,
      enrollment_type_id,
      enrollment_payment_type_id,
      enrollment_payment_amount,
      enrollment_payment_discount,
      enrollment_start_date,
      enrollment_end_date,
    } = data;

    return await sql`
      UPDATE enrollments
      SET user_id = ${user_id}, module_id = ${module_id}, class_id = ${class_id}, 
          enrollment_type_id = ${enrollment_type_id}, enrollment_payment_type_id = ${enrollment_payment_type_id},
          enrollment_payment_amount = ${enrollment_payment_amount}, enrollment_payment_discount = ${enrollment_payment_discount},
          enrollment_start_date = ${enrollment_start_date}, enrollment_end_date = ${enrollment_end_date}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteEnrollment(id) {
  try {
    return await sql`
      UPDATE enrollments
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

// create multiple enrollments by class ID and user IDs
export async function createEnrollmentsByClass(
  classId,
  userIds,
  enrollmentTypeId
) {
  try {
    const queryValues = [];
    const valuePlaceholders = userIds
      .map((userId, index) => {
        queryValues.push(userId, classId, enrollmentTypeId);
        return `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`;
      })
      .join(", ");

    const queryText = `
      INSERT INTO enrollments (user_id, class_id, enrollment_type_id)
      VALUES ${valuePlaceholders}
      RETURNING *;
    `;

    return await sql.query(queryText, queryValues);
  } catch (error) {
    throw new Error(error.message);
  }
}

// soft-delete multiple enrollments by class ID and user IDs
export async function deleteEnrollmentsByClass(classId, userIds) {
  try {
    const placeholders = userIds.map((_, index) => `$${index + 2}`).join(", ");

    const queryText = `
      UPDATE enrollments
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL
        AND class_id = $1
        AND user_id IN (${placeholders})
      RETURNING *;
    `;
    const queryValues = [classId, ...userIds];
    return await sql.query(queryText, queryValues);
  } catch (error) {
    throw new Error(error.message);
  }
}

// create multiple enrollments by user ID and class Ids
export async function createClassEnrollmentsByUser(
  userId,
  classIds,
  enrollmentTypeId
) {
  try {
    const queryValues = [];
    const valuePlaceholders = classIds
      .map((classId, index) => {
        queryValues.push(userId, classId, enrollmentTypeId);
        return `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`;
      })
      .join(", ");

    const queryText = `
      INSERT INTO enrollments (user_id, class_id, enrollment_type_id)
      VALUES ${valuePlaceholders}
      RETURNING *;
    `;

    return await sql.query(queryText, queryValues);
  } catch (error) {
    throw new Error(error.message);
  }
}
// soft-delete multiple enrollments by user ID and class Ids
export async function deleteClassEnrollmentsByUser(userId, classIds) {
  try {
    const placeholders = classIds.map((_, index) => `$${index + 2}`).join(", ");

    const queryText = `
      UPDATE enrollments
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL
        AND user_id = $1
        AND class_id IN (${placeholders})
      RETURNING *;
    `;
    const queryValues = [userId, ...classIds];
    return await sql.query(queryText, queryValues);
  } catch (error) {
    throw new Error(error.message);
  }
}

// create multiple enrollments by user ID and module Ids
export async function createModuleEnrollmentsByUser(
  userId,
  moduleIds,
  enrollmentTypeId
) {
  try {
    const queryValues = [];
    const valuePlaceholders = moduleIds
      .map((moduleId, index) => {
        queryValues.push(userId, moduleId, enrollmentTypeId);
        return `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`;
      })
      .join(", ");

    const queryText = `
      INSERT INTO enrollments (user_id, module_id, enrollment_type_id)
      VALUES ${valuePlaceholders}
      RETURNING *;
    `;

    return await sql.query(queryText, queryValues);
  } catch (error) {
    throw new Error(error.message);
  }
}

// soft-delete multiple enrollments by user ID and module Ids
export async function deleteModuleEnrollmentsByUser(userId, moduleIds) {
  try {
    const placeholders = moduleIds
      .map((_, index) => `$${index + 2}`)
      .join(", ");

    const queryText = `
      UPDATE enrollments
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL
        AND user_id = $1
        AND module_id IN (${placeholders})
      RETURNING *;
    `;
    const queryValues = [userId, ...moduleIds];
    return await sql.query(queryText, queryValues);
  } catch (error) {
    throw new Error(error.message);
  }
}
