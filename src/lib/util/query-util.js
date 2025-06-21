// path: @/lib/util/query-util.js

/**
 * # Hậu tố tham số truy vấn API
 *
 * Bảng hậu tố cho ánh xạ query string và SQL:
 *
 * | Hậu tố    | Ý nghĩa                  | Toán tử SQL       | Ví dụ truy vấn           | Ví dụ SQL                                    |
 * |-----------|--------------------------|-------------------|--------------------------|----------------------------------------------|
 * | _like     | Gần đúng, không dấu      | ILIKE UNACCENT    | name_like=nguyen         | unaccent(name) ILIKE unaccent('%nguyen%')    |
 * | _nlike    | Không chứa, không dấu    | NOT ILIKE UNACCENT| name_nlike=nguyen        | unaccent(name) NOT ILIKE unaccent('%nguyen%')|
 * | _e        | Bằng tuyệt đối           | =                 | status_e=active          | status = 'active'                            |
 * | _ne       | Khác tuyệt đối           | <>                | status_ne=inactive       | status <> 'inactive'                         |
 * | _gt       | Lớn hơn                  | >                 | age_gt=18                | age > 18                                     |
 * | _gte      | Lớn hơn hoặc bằng        | >=                | created_at_gte=2024-01-01| created_at >= '2024-01-01'                   |
 * | _lt       | Nhỏ hơn                  | <                 | price_lt=1000            | price < 1000                                 |
 * | _lte      | Nhỏ hơn hoặc bằng        | <=                | score_lte=8              | score <= 8                                   |
 * | _in       | Trong danh sách          | IN                | role_in=admin,user       | role IN ('admin','user')                     |
 * | _nin      | Không thuộc danh sách    | NOT IN            | role_nin=guest,banned    | role NOT IN ('guest','banned')               |
 * | _null     | Là NULL                  | IS NULL           | deleted_at_null=true     | deleted_at IS NULL                           |
 * | _nnull    | Không phải NULL          | IS NOT NULL       | deleted_at_nnull=true    | deleted_at IS NOT NULL                       |
 *
 * ## Định dạng giá trị hậu tố
 *
 * Ngoài việc sử dụng hậu tố ở key, bạn có thể sử dụng định dạng "_hậu_tố giá_trị" trong value:
 * - age: "_lt 65" -> age_lt=65
 * - price: "_gte 1000" -> price_gte=1000
 * - status: "_e active" -> status_e=active
 *
 * ## Toán tử OR
 *
 * Để thực hiện truy vấn OR, sử dụng key đặc biệt "or" với object chứa các điều kiện:
 * - or: { age_gt: 18, status_e: "active" } -> (age > 18 OR status = 'active')
 * - Chỉ hỗ trợ 1 tầng OR, không lồng nhau
 */

/**  
 * # Dữ liệu mẫu
const sampleParams = {
  // mặc định antd protable
  name: "John",
  age: 30,
  id: 1,
  statusId: 3,
  startDate: ["2024-01-01", "2024-12-31"],
  current: 2,
  pageSize: 5,

  // hậu tố tùy chỉnh của người dùng trong key (snake_case)
  age_gt: 18,
  price_lte: 1000,
  deleted_at_null: true,
  updated_at_nnull: true,
  role_in: ["admin", "user"],
  status_nin: ["banned", "guest"],

  // định dạng hậu tố value mới
  score: "_gte 80",
  rating: "_lt 5",
  category: "_e premium",

  // toán tử OR (chỉ 1 tầng)
  or: {
    section_end_date_gte: "2024-01-01",
    section_end_date_null: true,
  },

  // nhiều toán tử OR (hỗ trợ nhiều nhóm OR)
  or_1: {
    age_gt: 18,
    status_e: "active",
  },
  or_2: {
    role_e: "admin",
    department_e: "IT",
  },
};

const sampleSort = {
  createdAt: "descend",
  age: "ascend",
};

const sampleFilter = {
  status: ["active", "inactive"],
  role: ["teacher", "ta"],
  // tùy chỉnh người dùng
  type: ["vip", "normal"],
  group: "staff",
};

const sampleIgnoredSearchColumns = ["age"];
*/

/**
 * Các toán tử hậu tố hợp lệ
 */
const VALID_SUFFIXES = [
  "like",
  "nlike",
  "e",
  "ne",
  "gt",
  "gte",
  "lt",
  "lte",
  "in",
  "nin",
  "null",
  "nnull",
];

/**
 * Phân tích giá trị chuỗi với định dạng "_hậu_tố giá_trị"
 * @param {string} value - Chuỗi cần phân tích
 * @returns {{suffix: string|null, parsedValue: string}} - Kết quả phân tích
 */
function parseSuffixValue(value) {
  if (typeof value === "string" && value.startsWith("_")) {
    const spaceIndex = value.indexOf(" ");
    if (spaceIndex > 1) {
      const potentialSuffix = value.substring(1, spaceIndex).trim();
      const actualValue = value.substring(spaceIndex + 1).trim();

      if (VALID_SUFFIXES.includes(potentialSuffix)) {
        return { suffix: potentialSuffix, parsedValue: actualValue };
      }
    }
  }
  return { suffix: null, parsedValue: value };
}

/**
 * Kiểm tra xem key có phải là OR key không (or, or_1, or_2, ...)
 * @param {string} key - Key cần kiểm tra
 * @returns {boolean} - True nếu là OR key
 */
function isOrKey(key) {
  return key === "or" || /^or_\d+$/.test(key);
}

/**
 * Chuyển đổi các đối tượng params, sort và filter thành chuỗi truy vấn URL cho tìm kiếm API.
 *
 * @param {Object} params - Các cặp key-value cho tìm kiếm. Hậu tố sẽ được tự động thêm nếu thiếu:
 *   - id, *_id: chuyển đổi thành _e (khớp chính xác)
 *   - Mảng 2 giá trị (không có hậu tố): chuyển đổi thành _gte và _lte (trong khoảng)
 *   - current, pageSize: giữ nguyên cho phân trang
 *   - Chuỗi có định dạng "_hậu_tố giá_trị": "_lt 65" -> key_lt=65
 *   - Key có hậu tố sẵn: giữ nguyên (ví dụ: age_gt, price_lte)
 *   - Key "or": object chứa các điều kiện OR (chỉ 1 tầng) - backward compatibility
 *   - Key "or_1", "or_2", ...: object chứa các điều kiện OR (nhiều nhóm OR)
 *   - Không có hậu tố: chuyển đổi thành _like (tìm kiếm mờ)
 * @param {Object} sort - Các cặp key-value cho sắp xếp, ví dụ { createdAt: 'descend', age: 'ascend' }
 * @param {Object} filter - Các cặp key-value cho lọc, tất cả key đều được chuyển thành _in
 * @returns {string} Chuỗi truy vấn URL
 *
 * @example
 * buildSearchParams({
 *   name: 'John',
 *   id: 1,
 *   age: '_lt 65',
 *   startDate: ['2024-01-01','2024-12-31'],
 *   scoreGt: 18,
 *   current: 2,
 *   pageSize: 10,
 *   or_1: { section_end_date_gte: '2024-01-01', section_end_date_null: true },
 *   or_2: { role_e: 'admin', department_e: 'IT' }
 * }, { createdAt: 'descend' }, { status: ['active','inactive'] })
 * // => name_like=John&id_e=1&age_lt=65&startDate_gte=2024-01-01&startDate_lte=2024-12-31&scoreGt=18&current=2&pageSize=10&or_1=section_end_date_gte:2024-01-01,section_end_date_null:true&or_2=role_e:admin,department_e:IT&status_in=active,inactive&sort=-createdAt
 */
export function buildSearchParams(params = {}, sort = {}, filter = {}) {
  const searchParams = new URLSearchParams();

  // Xử lý params
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    // Xử lý nhóm OR (hỗ trợ or, or_1, or_2, ...)
    if (isOrKey(key) && typeof value === "object" && value !== null) {
      // Ví dụ value = { age_gt: 18, status_e: "active", ... }
      const orValue = Object.entries(value)
        .map(([k, v]) => `${k}:${v}`)
        .join(",");
      searchParams.append(key, orValue);
      return;
    }

    let paramKey = key;
    let paramValue = value;

    // Bỏ qua các tham số phân trang - xử lý như cũ
    if (key === "current" || key === "pageSize") {
      searchParams.append(key, value);
      return;
    }

    // Xử lý mảng (khoảng giữa)
    if (
      Array.isArray(value) &&
      value.length === 2 &&
      !key.match(
        /(_like|_nlike|_e|_ne|_gt|_gte|_lt|_lte|_in|_nin|_null|_nnull)$/
      )
    ) {
      searchParams.append(`${key}_gte`, value[0]);
      searchParams.append(`${key}_lte`, value[1]);
      return;
    }

    // Xử lý key có hậu tố sẵn
    if (
      key.match(
        /(_like|_nlike|_e|_ne|_gt|_gte|_lt|_lte|_in|_nin|_null|_nnull)$/
      )
    ) {
      searchParams.append(key, value);
      return;
    }

    // Xử lý mặc định cho key không có hậu tố
    if (
      key === "id" ||
      key.endsWith("_id") ||
      key.endsWith("_date") ||
      key.endsWith("_time")
    ) {
      paramKey = `${key}_e`;
    } else {
      // Kiểm tra định dạng "_hậu_tố giá_trị" trước
      const { suffix, parsedValue } = parseSuffixValue(value);

      if (suffix) {
        paramKey = `${key}_${suffix}`;
        paramValue = parsedValue;
      } else {
        // Mặc định: sử dụng _like cho tìm kiếm chuỗi
        paramKey = `${key}_like`;
      }
    }

    searchParams.append(paramKey, paramValue);
  });

  // Xử lý filter (tất cả key đều là _in)
  Object.entries(filter).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      searchParams.append(`${key}_in`, value.join(","));
    } else if (value !== undefined && value !== null && value !== "") {
      searchParams.append(`${key}_in`, value);
    }
  });

  // Xử lý sort
  const sortKeys = Object.entries(sort).map(([key, order]) =>
    order === "descend" ? `-${key}` : key
  );
  if (sortKeys.length > 0) {
    searchParams.append("sort", sortKeys.join(","));
  }

  return searchParams.toString();
}

/**
 * Phân tích chuỗi truy vấn (URLSearchParams hoặc object) thành các mệnh đề SQL (where, order by, limit) và mảng giá trị cho truy vấn tham số hóa.
 *
 * @param {URLSearchParams|Object} searchParams - Tham số truy vấn cần phân tích
 * @param {string[]} ignoredSearchColumns - Các cột bỏ qua trong mệnh đề WHERE
 * @returns {{ whereClause: string, orderByClause: string, limitClause: string, queryValues: any[] }}
 *
 * @example
 * parseSearchParams(new URLSearchParams('name_like=John&age_gt=18&or_1=status_e:active,role_e:admin&or_2=department_e:IT,level_gt:5&sort=-createdAt&current=2&pageSize=10'))
 * // => {
 * //   whereClause: " AND name ILIKE $1 AND age > $2 AND (status = $3 OR role = $4) AND (department = $5 OR level > $6)",
 * //   orderByClause: " ORDER BY createdAt DESC",
 * //   limitClause: " LIMIT 10 OFFSET 10",
 * //   queryValues: ['%John%', 18, 'active', 'admin', 'IT', 5]
 * // }
 */
export function parseSearchParams(searchParams, ignoredSearchColumns = []) {
  const params =
    searchParams instanceof URLSearchParams
      ? Object.fromEntries(searchParams.entries())
      : { ...searchParams };

  const where = [];
  const orGroups = []; // Mảng chứa các nhóm OR
  let orderBy = "";
  let limit = "";
  const queryValues = [];
  let paramIndex = ignoredSearchColumns.length + 1;

  // Helper xử lý 1 key-value param, trả về mệnh đề sql và đẩy vào queryValues
  const handleClause = (key, value, targetArray) => {
    const baseKey = key.replace(
      /(_like|_nlike|_e|_ne|_gt|_gte|_lt|_lte|_in|_nin|_null|_nnull)$/,
      ""
    );
    if (ignoredSearchColumns.includes(baseKey)) return;
    if (key.endsWith("_like")) {
      targetArray.push(`unaccent(${baseKey}) ILIKE unaccent($${paramIndex})`);
      queryValues.push(`%${value}%`);
      paramIndex++;
    } else if (key.endsWith("_nlike")) {
      targetArray.push(
        `unaccent(${baseKey}) NOT ILIKE unaccent($${paramIndex})`
      );
      queryValues.push(`%${value}%`);
      paramIndex++;
    } else if (key.endsWith("_e")) {
      targetArray.push(`${baseKey} = $${paramIndex}`);
      queryValues.push(value);
      paramIndex++;
    } else if (key.endsWith("_ne")) {
      targetArray.push(`${baseKey} <> $${paramIndex}`);
      queryValues.push(value);
      paramIndex++;
    } else if (key.endsWith("_gt")) {
      targetArray.push(`${baseKey} > $${paramIndex}`);
      queryValues.push(value);
      paramIndex++;
    } else if (key.endsWith("_gte")) {
      targetArray.push(`${baseKey} >= $${paramIndex}`);
      queryValues.push(value);
      paramIndex++;
    } else if (key.endsWith("_lt")) {
      targetArray.push(`${baseKey} < $${paramIndex}`);
      queryValues.push(value);
      paramIndex++;
    } else if (key.endsWith("_lte")) {
      targetArray.push(`${baseKey} <= $${paramIndex}`);
      queryValues.push(value);
      paramIndex++;
    } else if (key.endsWith("_in")) {
      const arr = value.split(",");
      const placeholders = arr.map(() => `$${paramIndex++}`);
      targetArray.push(`${baseKey} IN (${placeholders.join(",")})`);
      queryValues.push(...arr);
    } else if (key.endsWith("_nin")) {
      const arr = value.split(",");
      const placeholders = arr.map(() => `$${paramIndex++}`);
      targetArray.push(`${baseKey} NOT IN (${placeholders.join(",")})`);
      queryValues.push(...arr);
    } else if (key.endsWith("_null")) {
      if (value === "true" || value === true)
        targetArray.push(`${baseKey} IS NULL`);
    } else if (key.endsWith("_nnull")) {
      if (value === "true" || value === true)
        targetArray.push(`${baseKey} IS NOT NULL`);
    }
  };

  // Duyệt tất cả params thường
  Object.entries(params).forEach(([key, value]) => {
    if (isOrKey(key)) return; // skip or keys
    if (key === "current" || key === "pageSize") return; // skip paging
    handleClause(key, value, where);
  });

  // Duyệt params OR nếu có (hỗ trợ or, or_1, or_2, ...)
  Object.entries(params).forEach(([key, value]) => {
    if (isOrKey(key) && value) {
      const orWhere = [];
      // or param dạng: status_e:active,deleted_at_null:true,age_gt:18
      const orParts = typeof value === "string" ? value.split(",") : [];
      orParts.forEach((part) => {
        const idx = part.indexOf(":");
        if (idx > 0) {
          const orKey = part.slice(0, idx);
          const orValue = part.slice(idx + 1);
          handleClause(orKey, orValue, orWhere);
        }
      });

      if (orWhere.length > 0) {
        orGroups.push(`(${orWhere.join(" OR ")})`);
      }
    }
  });

  // Xử lý sort
  if (params.sort) {
    const sortFields = params.sort.split(",").map((field) => {
      if (field.startsWith("-")) {
        return `${field.slice(1)} DESC`;
      }
      return `${field} ASC`;
    });
    orderBy = sortFields.length ? `ORDER BY ${sortFields.join(", ")}` : "";
  }

  // Xử lý limit
  if (params.current && params.pageSize) {
    const offset =
      (parseInt(params.current, 10) - 1) * parseInt(params.pageSize, 10);
    limit = `LIMIT ${params.pageSize} OFFSET ${offset}`;
  } else if (params.pageSize) {
    limit = `LIMIT ${params.pageSize}`;
  }

  // Tổ hợp where
  let whereClause = "";
  if (where.length || orGroups.length) {
    whereClause = " AND ";
    if (where.length) whereClause += where.join(" AND ");
    if (where.length && orGroups.length) whereClause += " AND ";
    if (orGroups.length) whereClause += orGroups.join(" AND ");
  }

  return {
    whereClause,
    orderByClause: orderBy,
    limitClause: limit,
    queryValues,
  };
}
