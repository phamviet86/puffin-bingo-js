// path: @/component/custom/classes/classes-schema.js

import {
  ProForm,
  ProFormText,
  ProFormDatePicker,
  ProFormMoney,
} from "@ant-design/pro-form";
import { Space, Typography } from "antd";
import { CLASS_STATUS } from "@/component/config/enum-config";

export function ClassesColumns() {
  return [
    {
      title: "Khoá học",
      dataIndex: "course_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Giáo trình",
      dataIndex: "syllabus_name",
      valueType: "text",
      sorter: { multiple: 1 },
      hidden: true,
    },
    {
      title: "Học phần",
      dataIndex: "module_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Trạng thái",
      dataIndex: "class_status",
      valueType: "text",
      valueEnum: CLASS_STATUS,
      filters: true,
      sorter: { multiple: 1 },
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "class_start_date",
      valueType: "date",
      search: false,
      sorter: { multiple: 1 },
      responsive: ["lg"],
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "class_end_date",
      valueType: "date",
      search: false,
      sorter: { multiple: 1 },
      responsive: ["lg"],
    },
    {
      title: "Học phí",
      dataIndex: "class_fee",
      valueType: "money",
      fieldProps: {
        precision: 0,
      },
      search: false,
      sorter: { multiple: 1 },
      responsive: ["xl"],
    },
    {
      title: "Tổng học phí",
      dataIndex: "class_total_fee",
      valueType: "money",
      fieldProps: {
        precision: 0,
      },
      search: false,
      sorter: { multiple: 1 },
      responsive: ["xl"],
    },
    {
      title: "Chờ",
      dataIndex: "pending_count",
      valueType: "digit",
      sorter: { multiple: 1 },
      search: false,
      responsive: ["xxl"],
      render: (text) => (
        <Typography.Text type="secondary" strong>
          {text}
        </Typography.Text>
      ),
    },
    {
      title: "Học",
      dataIndex: "completed_count",
      valueType: "digit",
      search: false,
      responsive: ["xxl"],
      render: (text) => (
        <Typography.Text type="success" strong>
          {text}
        </Typography.Text>
      ),
    },
    {
      title: "Nghỉ",
      dataIndex: "absent_count",
      valueType: "digit",
      search: false,
      responsive: ["xxl"],
      render: (text) => (
        <Typography.Text type="danger" strong>
          {text}
        </Typography.Text>
      ),
    },
  ];
}

export function CourseClassesColumns() {
  return [
    {
      title: "Giáo trình",
      dataIndex: "syllabus_name",
      valueType: "text",
      sorter: { multiple: 1 },
      responsive: ["md"],
    },
    {
      title: "Học phần",
      dataIndex: "module_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Trạng thái",
      dataIndex: "class_status",
      valueType: "select",
      valueEnum: CLASS_STATUS,
      filters: true,
      sorter: { multiple: 1 },
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "class_start_date",
      valueType: "date",
      search: false,
      sorter: { multiple: 1 },
      responsive: ["lg"],
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "class_end_date",
      valueType: "date",
      search: false,
      sorter: { multiple: 1 },
      responsive: ["lg"],
    },
    {
      title: "Học phí",
      dataIndex: "class_fee",
      valueType: "money",
      fieldProps: {
        precision: 0,
      },
      search: false,
      sorter: { multiple: 1 },
      responsive: ["xl"],
    },
    {
      title: "Tổng học phí",
      dataIndex: "class_total_fee",
      valueType: "money",
      fieldProps: {
        precision: 0,
      },
      search: false,
      sorter: { multiple: 1 },
      responsive: ["xl"],
    },
    {
      title: "Chờ",
      dataIndex: "pending_count",
      valueType: "digit",
      sorter: { multiple: 1 },
      search: false,
      responsive: ["xxl"],
      render: (text) => (
        <Typography.Text type="secondary" strong>
          {text}
        </Typography.Text>
      ),
    },
    {
      title: "Học",
      dataIndex: "completed_count",
      valueType: "digit",
      search: false,
      responsive: ["xxl"],
      render: (text) => (
        <Typography.Text type="success" strong>
          {text}
        </Typography.Text>
      ),
    },
    {
      title: "Nghỉ",
      dataIndex: "absent_count",
      valueType: "digit",
      search: false,
      responsive: ["xxl"],
      render: (text) => (
        <Typography.Text type="danger" strong>
          {text}
        </Typography.Text>
      ),
    },
  ];
}

export function ScheduleClassesColumns() {
  return [
    {
      title: "Lớp học",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space wrap>
            <Typography.Text strong>{record.course_name}</Typography.Text>
            <Typography.Text>{record.module_name}</Typography.Text>
          </Space>
          <Typography.Text type="secondary">
            {record.syllabus_name}
          </Typography.Text>
        </Space>
      ),
      search: false,
      hideInDescriptions: true,
    },
    {
      title: "Khóa học",
      dataIndex: "course_name",
      valueType: "text",
      sorter: { multiple: 1 },
      hidden: true,
    },
    {
      title: "Học phần",
      dataIndex: "module_name",
      valueType: "text",
      sorter: { multiple: 1 },
      hidden: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "class_status",
      valueType: "select",
      valueEnum: CLASS_STATUS,
      filters: true,
      sorter: { multiple: 1 },
      responsive: ["lg"],
    },
    {
      title: "Bắt đầu",
      dataIndex: "class_start_date",
      valueType: "date",
      sorter: { multiple: 1 },
      search: false,
      responsive: ["md"],
    },
    {
      title: "Kết thúc",
      dataIndex: "class_end_date",
      valueType: "date",
      sorter: { multiple: 1 },
      search: false,
      responsive: ["md"],
    },
    {
      title: "Chờ",
      dataIndex: "pending_count",
      valueType: "digit",
      search: false,
      render: (text) => (
        <Typography.Text type="secondary" strong>
          {text}
        </Typography.Text>
      ),
    },
    {
      title: "Học",
      dataIndex: "completed_count",
      valueType: "digit",
      search: false,
      render: (text) => (
        <Typography.Text type="success" strong>
          {text}
        </Typography.Text>
      ),
    },
    {
      title: "Nghỉ",
      dataIndex: "absent_count",
      valueType: "digit",
      search: false,
      render: (text) => (
        <Typography.Text type="danger" strong>
          {text}
        </Typography.Text>
      ),
    },
    {
      title: "Tổng",
      valueType: "digit",
      search: false,
      render: (_, record) => (
        <Typography.Text strong>
          {Number(record.pending_count || 0) +
            Number(record.completed_count || 0) +
            Number(record.absent_count || 0)}
        </Typography.Text>
      ),
    },
  ];
}

export function ClassesFields() {
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText name="course_id" label="ID khóa học" hidden disabled />
      <ProFormText name="module_id" label="ID học phần" hidden disabled />
      <ProFormText
        name="course_name"
        label="Khoá"
        colProps={{ xs: 8 }}
        disabled
      />
      <ProFormText
        name="syllabus_name"
        label="Giáo trình"
        colProps={{ xs: 8 }}
        disabled
      />
      <ProFormText
        name="module_name"
        label="Học phần"
        colProps={{ xs: 8 }}
        disabled
      />

      <ProFormDatePicker
        name="class_start_date"
        label="Ngày bắt đầu"
        placeholder="Chọn ngày bắt đầu"
        colProps={{ xs: 12 }}
        width="100%"
      />
      <ProFormDatePicker
        name="class_end_date"
        label="Ngày kết thúc"
        placeholder="Chọn ngày kết thúc"
        colProps={{ xs: 12 }}
        width="100%"
      />
      <ProFormMoney
        name="class_fee"
        label="Học phí"
        placeholder="Nhập học phí"
        locale="vn-VN"
        width="100%"
        colProps={{ xs: 12 }}
      />
      <ProFormMoney
        name="class_total_fee"
        label="Tổng học phí"
        placeholder="Nhập tổng học phí"
        locale="vn-VN"
        width="100%"
        colProps={{ xs: 12 }}
      />
    </ProForm.Group>
  );
}
