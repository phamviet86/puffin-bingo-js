// path: @/service/rooms-service.js

import { neonDB } from "@/lib/db/neon-db";
import { parseSearchParams } from "@/lib/util/query-util";

const sql = neonDB();

export async function getRooms(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT *, COUNT(*) OVER() AS total
      FROM rooms
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

export async function getRoom(id) {
  try {
    return await sql`
      SELECT *
      FROM rooms
      WHERE deleted_at IS NULL AND id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createRoom(data) {
  try {
    const { room_name, room_status_id, room_desc } = data;

    return await sql`
      INSERT INTO rooms (
        room_name, room_status_id, room_desc
      ) VALUES (
        ${room_name}, ${room_status_id}, ${room_desc}
      )
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateRoom(data, id) {
  try {
    const { room_name, room_status_id, room_desc } = data;

    return await sql`
      UPDATE rooms
      SET room_name = ${room_name}, room_status_id = ${room_status_id}, room_desc = ${room_desc}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteRoom(id) {
  try {
    return await sql`
      UPDATE rooms
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}
