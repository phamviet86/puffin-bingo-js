// path: @/lib/util/convert-util.js

const FILE_ID_REGEX = /\/d\/([a-zA-Z0-9_-]+)\//;
const GOOGLE_DRIVE_REGEX =
  /https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\//;

/**
 * @description Convert a Google Drive image link to a direct link with specified size.
 *
 * @param {string} link - The Google Drive image link.
 * @param {number} size - The desired image size.
 * @returns {string|null} - The converted image link or the original link if invalid.
 */
export function convertGoogleImage(link, size = 800) {
  if (!link) {
    console.error("Thiếu liên kết để chuyển đổi hình ảnh");
    return null;
  }

  if (!GOOGLE_DRIVE_REGEX.test(link)) {
    return link;
  }

  const match = link.match(FILE_ID_REGEX);
  const fileId = match ? match[1] : null;

  return fileId
    ? `https://lh3.googleusercontent.com/d/${fileId}=w${size}`
    : null;
}

/**
 * Tạo cả dữ liệu enum và options từ một mảng đối tượng, có thể lọc theo các tham số
 *
 * @param {Array<Object>} data - Mảng dữ liệu cần xử lý
 * @param {Object} columnConfig - Cấu hình các cột
 * @param {string} columnConfig.value - Tên thuộc tính sử dụng làm khóa/giá trị
 * @param {string} columnConfig.label - Tên thuộc tính sử dụng làm văn bản hiển thị
 * @param {string} [columnConfig.color] - Tên thuộc tính tùy chọn cho thông tin màu sắc/trạng thái
 * @param {string} [columnConfig.group] - Tên thuộc tính tùy chọn để nhóm options
 * @param {Object} [filterParams={}] - Tham số lọc tùy chọn (cặp field:value)
 * @returns {Object} Object chứa cả enum và options { enums: Object, options: Array }
 */
export function setSelection(data, columnConfig, filterParams = {}) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return { enums: {}, options: [] };
  }

  // Lọc dữ liệu nếu có tham số
  let filteredData = data;
  if (filterParams && Object.keys(filterParams).length > 0) {
    filteredData = data.filter((item) => {
      // Kiểm tra tất cả tham số có khớp không
      return Object.entries(filterParams).every(([key, paramValue]) => {
        return item[key] === paramValue;
      });
    });
  }

  // Tạo enum từ dữ liệu đã lọc
  const enums = filteredData.reduce((accumulator, item) => {
    if (item && item[columnConfig.value] !== undefined) {
      accumulator[item[columnConfig.value]] = {
        text: item[columnConfig.label],
        color: columnConfig.color ? item[columnConfig.color] ?? null : null,
        status: columnConfig.color ? item[columnConfig.color] ?? null : null,
      };
    }
    return accumulator;
  }, {});

  // Tạo options từ dữ liệu đã lọc
  let options = [];

  // Nếu không có group, trả về mảng options đơn giản
  if (!columnConfig.group) {
    options = filteredData
      .filter((item) => item && item[columnConfig.value] !== undefined)
      .map((item) => ({
        value: item[columnConfig.value],
        label: item[columnConfig.label],
      }));
  } else {
    // Nhóm dữ liệu theo trường được chỉ định
    const groupedData = filteredData.reduce((acc, item) => {
      if (!item || item[columnConfig.value] === undefined) return acc;

      const groupValue = item[columnConfig.group] || "Ungrouped"; // Sử dụng "Ungrouped" làm nhóm mặc định

      if (!acc[groupValue]) {
        acc[groupValue] = [];
      }

      acc[groupValue].push({
        value: item[columnConfig.value],
        label: item[columnConfig.label],
      });

      return acc;
    }, {});

    // Chuyển đổi sang định dạng options nhóm của Ant Design
    options = Object.keys(groupedData).map((key) => ({
      label: key,
      key: key, // Sử dụng làm React key
      options: groupedData[key],
    }));
  }

  return {
    enums,
    options,
  };
}

/**
 * Converts an array of objects into a format suitable for transfer components.
 *
 * @param {Array<Object>} data - The input array of items to convert.
 * @param {Object} transferProps - The mapping options for keys in the output.
 * @param {string} [transferProps.key] - The property name to use as the unique key for each item.
 * @param {string} [transferProps.title] - The property name to use as the title for each item.
 * @param {string} [transferProps.description] - The property name to use as the description for each item.
 * @param {string|Array} [transferProps.disabled] - The property name or array to determine if the item is disabled.
 *   - String: Field name to map directly (e.g., 'isDisabled')
 *   - Array [fieldName, values]: Check if field value is in values array (legacy format)
 *   - Array [fieldName, inArray, notInArray]: Advanced conditional logic
 *     - If field value is in inArray → disabled = true
 *     - If field value is NOT in notInArray → disabled = true
 *     - If both arrays are empty → treat as string mapping (!!fieldValue)
 * @param {string} [transferProps.customProps] - Additional custom properties to include in the output.
 * @returns {Array<Object>} The converted array of items with mapped properties.
 *
 * @example
 * const data = [
 *   { id: 1, name: 'Item 1', desc: 'First item', isDisabled: false, status: 'active' },
 *   { id: 2, name: 'Item 2', desc: 'Second item', isDisabled: true, status: 'inactive' }
 * ];
 *
 * // Basic usage with defaults
 * const result1 = convertTransferItems(data, {
 *   key: 'id',
 *   title: 'name',
 *   description: 'desc'
 * });
 *
 * // String mapping for disabled
 * const result2 = convertTransferItems(data, {
 *   key: 'id',
 *   title: 'name',
 *   disabled: 'isDisabled'
 * });
 *
 * // Legacy array format: disable if status is in array
 * const result3 = convertTransferItems(data, {
 *   key: 'id',
 *   title: 'name',
 *   disabled: ['status', ['inactive', 'removed']]
 * });
 *
 * // Advanced array format: conditional logic
 * const result4 = convertTransferItems(data, {
 *   key: 'id',
 *   title: 'name',
 *   disabled: ['status', ['inactive'], ['active', 'pending']]
 * });
 */
export function convertTransferItems(data = [], transferProps = {}) {
  if (!Array.isArray(data) || data.length === 0) return [];

  return data.map((item) => {
    const convertedItem = {};

    // Map all specified properties from transferProps except disabled
    Object.entries(transferProps).forEach(([outputKey, sourceKey]) => {
      if (outputKey === "disabled") return; // Handle disabled separately

      if (sourceKey && item.hasOwnProperty(sourceKey)) {
        convertedItem[outputKey] = item[sourceKey];
      } else if (
        outputKey === "key" &&
        !sourceKey &&
        item.hasOwnProperty("id")
      ) {
        // Fallback to 'id' if key mapping is not specified
        convertedItem[outputKey] = item.id;
      }
    });

    // Handle disabled property
    if (!transferProps.disabled) {
      // Default case: disabled is false
      convertedItem.disabled = false;
    } else if (typeof transferProps.disabled === "string") {
      // String case: map from source field
      convertedItem.disabled = item.hasOwnProperty(transferProps.disabled)
        ? item[transferProps.disabled]
        : false;
    } else if (
      Array.isArray(transferProps.disabled) &&
      transferProps.disabled.length === 3
    ) {
      // Array case: [fieldName, inArray, notInArray]
      const [fieldName, inArray, notInArray] = transferProps.disabled;

      if (fieldName && item.hasOwnProperty(fieldName)) {
        const fieldValue = item[fieldName];

        // If both arrays are empty, treat as string mapping
        if (
          (!inArray || inArray.length === 0) &&
          (!notInArray || notInArray.length === 0)
        ) {
          convertedItem.disabled = !!fieldValue;
        } else {
          let isDisabled = false;

          // Check inArray condition - if field value is in this array, set disabled = true
          if (inArray && Array.isArray(inArray) && inArray.length > 0) {
            if (inArray.includes(fieldValue)) {
              isDisabled = true;
            }
          }

          // Check notInArray condition - if field value is NOT in this array, set disabled = true
          if (
            notInArray &&
            Array.isArray(notInArray) &&
            notInArray.length > 0
          ) {
            if (!notInArray.includes(fieldValue)) {
              isDisabled = true;
            }
          }

          convertedItem.disabled = isDisabled;
        }
      } else {
        convertedItem.disabled = false;
      }
    } else if (
      Array.isArray(transferProps.disabled) &&
      transferProps.disabled.length === 2
    ) {
      // Legacy array case: [fieldName, values] - check if field value is in the array
      const [fieldName, disabledValues] = transferProps.disabled;
      if (
        fieldName &&
        Array.isArray(disabledValues) &&
        item.hasOwnProperty(fieldName)
      ) {
        convertedItem.disabled = disabledValues.includes(item[fieldName]);
      } else {
        convertedItem.disabled = false;
      }
    } else {
      // Fallback case
      convertedItem.disabled = false;
    }
    return convertedItem;
  });
}

/**
 * Helper function to generate ISO formatted event time
 * @param {string} isoDateString - ISO date string (e.g. "2025-04-25T00:00:00.000Z")
 * @param {string} timeString - Time string in format "HH:MM:SS" (e.g. "19:30:00")
 * @returns {string|null} ISO formatted datetime string or null if invalid
 */
function generateEventTime(isoDateString, timeString) {
  if (!isoDateString || !timeString) return null;

  try {
    // Parse hours and minutes from time string
    const timeParts = timeString.split(":");
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    // Create date from ISO string
    const baseDate = new Date(isoDateString);

    // Get date components
    const year = baseDate.getFullYear();
    const month = String(baseDate.getMonth() + 1).padStart(2, "0");
    const day = String(baseDate.getDate()).padStart(2, "0");

    // Format time components
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");

    // Build result string
    return `${year}-${month}-${day}T${formattedHours}:${formattedMinutes}:00`;
  } catch (error) {
    console.error("Error generating event time:", error);
    return null;
  }
}

/**
 * Converts an array of data items to event format using property mapping configuration
 * @param {Array} data - Array of data objects to convert
 * @param {Object} eventProps - Configuration object mapping target properties to source properties
 * @param {string} eventProps.id - Source property for event id
 * @param {string} eventProps.title - Source property for event title
 * @param {string} eventProps.startDate - Source property for event start date
 * @param {string} [eventProps.endDate] - Source property for event end date
 * @param {string} [eventProps.startTime] - Source property for start time (used with startDate)
 * @param {string} [eventProps.endTime] - Source property for end time (used with endDate)
 * @param {string} [eventProps.*] - Any other custom property mappings (applied directly to event item)
 * @param {Object} [eventProps.extendedProps] - Object mapping extended property keys to source properties
 * @returns {Array} - Array of converted event items with required format {id, title, start, end?, extendedProps, ...customProps}
 */
export function convertEventItems(data = [], eventProps = {}) {
  if (!Array.isArray(data) || data.length === 0) return [];

  // Reserved property names that have special handling
  const reservedProps = [
    "id",
    "title",
    "startDate",
    "endDate",
    "startTime",
    "endTime",
    "extendedProps",
  ];

  return data.map((sourceItem) => {
    const eventItem = {};

    // Required properties: id and title
    if (eventProps.id && sourceItem.hasOwnProperty(eventProps.id)) {
      eventItem.id = sourceItem[eventProps.id];
    }

    if (eventProps.title && sourceItem.hasOwnProperty(eventProps.title)) {
      eventItem.title = sourceItem[eventProps.title];
    }

    // Handle start property - combine startDate and startTime
    if (
      eventProps.startDate &&
      sourceItem.hasOwnProperty(eventProps.startDate)
    ) {
      const startDateValue = sourceItem[eventProps.startDate];
      const startTimeValue =
        eventProps.startTime && sourceItem.hasOwnProperty(eventProps.startTime)
          ? sourceItem[eventProps.startTime]
          : "00:00:00";

      const eventTime = generateEventTime(startDateValue, startTimeValue);
      if (eventTime) {
        eventItem.start = eventTime;
      }
    }

    // Handle end property - combine endDate and endTime
    // If only startDate is provided, use startDate as endDate
    const shouldUseStartDateAsEnd = eventProps.startDate && !eventProps.endDate;
    const endDateSource = shouldUseStartDateAsEnd
      ? eventProps.startDate
      : eventProps.endDate;

    if (endDateSource && sourceItem.hasOwnProperty(endDateSource)) {
      const endDateValue = sourceItem[endDateSource];
      const endTimeValue =
        eventProps.endTime && sourceItem.hasOwnProperty(eventProps.endTime)
          ? sourceItem[eventProps.endTime]
          : "23:59:59";

      const eventTime = generateEventTime(endDateValue, endTimeValue);
      if (eventTime) {
        eventItem.end = eventTime;
      }
    }

    // Handle custom properties (any property not in reservedProps)
    Object.entries(eventProps).forEach(([targetKey, sourceKey]) => {
      if (
        !reservedProps.includes(targetKey) &&
        sourceKey &&
        sourceItem.hasOwnProperty(sourceKey)
      ) {
        eventItem[targetKey] = sourceItem[sourceKey];
      }
    });

    // Handle extended properties
    if (
      eventProps.extendedProps &&
      typeof eventProps.extendedProps === "object" &&
      Object.keys(eventProps.extendedProps).length > 0
    ) {
      eventItem.extendedProps = {};

      Object.entries(eventProps.extendedProps).forEach(
        ([targetKey, sourceKey]) => {
          if (sourceKey && sourceItem.hasOwnProperty(sourceKey)) {
            eventItem.extendedProps[targetKey] = sourceItem[sourceKey];
          }
        }
      );
    }

    return eventItem;
  });
}

export function convertIsoDate(startDate, days = 0) {
  // Handle various input formats
  let date;

  if (startDate instanceof Date) {
    // Already a Date object
    date = new Date(startDate);
  } else if (typeof startDate === "string") {
    // Try to parse string - could be ISO, locale format, etc.
    date = new Date(startDate);
  } else if (typeof startDate === "number") {
    // Unix timestamp
    date = new Date(startDate);
  } else {
    // Invalid input
    console.error("Invalid startDate format:", startDate);
    return null;
  }

  // Check if date is valid
  if (isNaN(date.getTime())) {
    console.error("Invalid date created from:", startDate);
    return null;
  }

  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}
