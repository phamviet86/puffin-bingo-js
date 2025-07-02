// path: @/lib/util/render-util.js

import { Avatar, Space, Tag, Typography, Card, Flex, Badge } from "antd";
import { MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import {
  formatDateYYYYMMDD,
  formatDateMMDD,
  formatTimeHHMM,
} from "@/lib/util/format-util";
import { COLOR_ENUM } from "@/component/config/enum-config";

const { Text } = Typography;

export function renderTextArea(text) {
  return (
    <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
      {text}
    </div>
  );
}

export function renderTagFromEnum(key = null, enumData, label = null, props) {
  if (!key && !label) {
    return null;
  }

  let displayText;

  if (!enumData[key]) {
    displayText = label ? label : key;
    return displayText;
  }

  const { text, status, color } = enumData[key];
  displayText = label ? label : text;
  return (
    <Tag {...props} color={status ? status : color}>
      {displayText ? displayText : text}
    </Tag>
  );
}

export function renderTagsFromArray(keys, enumData) {
  if (!keys || keys === "-") {
    return null;
  }

  if (typeof keys === "string") {
    keys = keys.split(", ");
  }

  if (!Array.isArray(keys) || !enumData) {
    return null;
  }

  return (
    <Space size={4} wrap>
      {keys.map((key) => {
        if (!enumData[key]) return null;

        const { text, status, color } = enumData[key];
        return (
          <Tag key={key} color={status ? status : color}>
            {text}
          </Tag>
        );
      })}
    </Space>
  );
}

export function renderDateRange(start, end) {
  const startDate = formatDateYYYYMMDD(start) || "...";
  const endDate = formatDateYYYYMMDD(end) || "...";
  return (
    <Space direction="vertical" size={4}>
      <Text>Từ: {startDate}</Text>
      <Text>Đến: {endDate}</Text>
    </Space>
  );
}

export function renderDateRangeShort(start, end) {
  const startDate = formatDateMMDD(start) || "...";
  const endDate = formatDateMMDD(end) || "...";
  return (
    <Space size={4} split="-">
      <Text>{startDate}</Text>
      <Text>{endDate}</Text>
    </Space>
  );
}

export function renderTimeRange(start, end) {
  const formattedStart = formatTimeHHMM(start);
  const formattedEnd = formatTimeHHMM(end);

  return (
    <Space direction="vertical" size={4}>
      <Text>Từ: {formattedStart}</Text>
      <Text>Đến: {formattedEnd}</Text>
    </Space>
  );
}

// Table's column render
export function renderUser(record, statusEnum) {
  const { user_name, user_desc, user_status_id } = record;
  return (
    <Space direction="vertical" size={4} wrap>
      {user_name && (
        <Text strong>
          <Space wrap>
            {user_name} {renderTagFromEnum(user_status_id, statusEnum)}
          </Space>
        </Text>
      )}
      {user_desc && <Text type="secondary">{user_desc}</Text>}
    </Space>
  );
}

export function renderUserAvatar(record) {
  const { user_avatar } = record;
  return (
    <Avatar
      icon={<UserOutlined />}
      src={user_avatar}
      size={64}
      shape="circle"
    />
  );
}

export function renderUserContact(record) {
  const { user_email, user_phone, user_parent_phone } = record;
  return (
    <Space direction="vertical" size={4}>
      {user_email && (
        <Text>
          <MailOutlined /> {user_email}
        </Text>
      )}
      {user_phone && (
        <Text>
          <PhoneOutlined /> {user_phone}
        </Text>
      )}
      {user_parent_phone && (
        <Text>
          <UserOutlined /> {user_parent_phone}
        </Text>
      )}
    </Space>
  );
}

// time, class_name, module_name, status_color
export function renderScheduleTag(info) {
  const { shift_start_time, course_code, module_name, schedule_status_color } =
    info.event.extendedProps;
  const { status, color } = COLOR_ENUM[schedule_status_color];

  const styles = {
    time: {
      fontSize: "1em",
      fontWeight: 500,
      color: color,
    },
    course: {
      fontSize: "1em",
      fontWeight: 700,
      color: color,
    },
    module: {
      fontSize: "1em",
      color: color,
      opacity: 0.85,
    },
  };

  // return as tag with color and text
  return (
    <Tag color={status ? status : color} style={{ width: "100%" }}>
      <Space size={4} wrap>
        <Text style={styles.time}>{formatTimeHHMM(shift_start_time)}</Text>
        <Text style={styles.course}>{course_code}</Text>
        <Text style={styles.module}>{module_name}</Text>
      </Space>
    </Tag>
  );
}

// time, class_name, module_name, status_color
export function renderScheduleBadge(info) {
  const { shift_start_time, course_code, module_name, schedule_status_color } =
    info.event.extendedProps;
  const { status, color } = COLOR_ENUM[schedule_status_color];

  const styles = {
    text: {
      fontSize: "1em",
    },
    time: {
      fontSize: "1em",
      fontWeight: 700,
    },
  };

  // return the information in a row in order time, class_name, module_name
  return (
    <Space size={4} wrap>
      <Badge status={status ? status : color} />
      <Text style={styles.time} strong>
        {formatTimeHHMM(shift_start_time)}
      </Text>
      <Text style={styles.text}>{course_code}</Text>
      <Text style={styles.text} type="secondary">
        {module_name}
      </Text>
    </Space>
  );
}

export function renderScheduleCard(info) {
  const {
    shift_start_time,
    room_name,
    course_name,
    module_name,
    lecture_name,
    schedule_status_color,
  } = info.event.extendedProps;

  const { color, bgColor } = COLOR_ENUM[schedule_status_color];

  const styles = {
    title: {
      fontSize: "0.8em",
      fontWeight: 1000,
      color: color,
    },
    text: {
      fontSize: "0.8em",
      color: color,
    },
    card: {
      borderRadius: 2,
      backgroundColor: bgColor,
      borderColor: color,
      border: `0.8px solid ${color}`,
      width: "100%",
    },
  };
  return (
    <Card size="small" style={styles.card}>
      <Space direction="vertical" size={0} wrap style={{ width: "100%" }}>
        <Flex justify="space-between" wrap style={{ width: "100%" }}>
          <Text style={styles.title}>{formatTimeHHMM(shift_start_time)}</Text>
          <Text strong style={styles.text}>
            {room_name ? `Phòng: ${room_name}` : "Chưa có phòng"}
          </Text>
        </Flex>
        <Space wrap size={[4, 0]}>
          <Text strong style={styles.text}>
            {course_name}
          </Text>
          <Text style={styles.text} type="secondary">
            {module_name}
          </Text>
        </Space>
        <Text italic style={styles.text}>
          {lecture_name}
        </Text>
      </Space>
    </Card>
  );
}

export function renderScheduleTransfer(record) {
  const {
    schedule_date,
    shift_start_time,
    course_name,
    module_name,
    schedule_status_color,
  } = record;

  // Get short day name from schedule_date
  const dayName = new Date(schedule_date).toLocaleDateString("vi-VN", {
    weekday: "short",
  });

  const startTime = formatTimeHHMM(shift_start_time);
  const { status, color } = COLOR_ENUM[schedule_status_color] || {};

  return (
    <Space size={4} wrap>
      <Badge status={status ? status : color} />
      <Text>
        {dayName} - {startTime}:
      </Text>
      <Text strong>{course_name}</Text>
      <Text>{module_name}</Text>
    </Space>
  );
}
