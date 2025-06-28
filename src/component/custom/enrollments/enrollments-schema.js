// path: @/component/custom/enrollments/enrollments-schema.js

import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormDatePicker,
} from "@ant-design/pro-form";

export function EnrollmentsColumns(params) {
  const { enrollmentType, enrollmentPaymentType } = params || {};

  return [
    {
      title: "Người dùng",
      dataIndex: "user_id",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Môn học",
      dataIndex: "module_id",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Lớp học",
      dataIndex: "class_id",
      valueType: "text",
      sorter: { multiple: 1 },
      responsive: ["md"],
    },
    {
      title: "Loại đăng ký",
      dataIndex: "enrollment_type_id",
      valueType: "select",
      valueEnum: enrollmentType?.valueEnum || {},
      sorter: { multiple: 1 },
    },
    {
      title: "Loại thanh toán",
      dataIndex: "enrollment_payment_type_id",
      valueType: "select",
      valueEnum: enrollmentPaymentType?.valueEnum || {},
      sorter: { multiple: 1 },
      responsive: ["md"],
    },
    {
      title: "Số tiền",
      dataIndex: "enrollment_payment_amount",
      valueType: "text",
      sorter: { multiple: 1 },
      responsive: ["lg"],
    },
    {
      title: "Giảm giá",
      dataIndex: "enrollment_payment_discount",
      valueType: "text",
      sorter: { multiple: 1 },
      responsive: ["lg"],
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "enrollment_start_date",
      valueType: "date",
      sorter: { multiple: 1 },
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "enrollment_end_date",
      valueType: "date",
      sorter: { multiple: 1 },
      responsive: ["md"],
    },
  ];
}

export function EnrollmentsFields(params) {
  const { enrollmentType, enrollmentPaymentType } = params || {};

  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="user_id"
        label="Người dùng"
        placeholder="Nhập ID người dùng"
        rules={[{ required: true }]}
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormText
        name="module_id"
        label="Môn học"
        placeholder="Nhập ID môn học"
        rules={[{ required: true }]}
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormText
        name="class_id"
        label="Lớp học"
        placeholder="Nhập ID lớp học"
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormSelect
        name="enrollment_type_id"
        label="Loại đăng ký"
        placeholder="Chọn loại đăng ký"
        rules={[{ required: true }]}
        options={enrollmentType?.options || []}
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormSelect
        name="enrollment_payment_type_id"
        label="Loại thanh toán"
        placeholder="Chọn loại thanh toán"
        options={enrollmentPaymentType?.options || []}
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormText
        name="enrollment_payment_amount"
        label="Số tiền"
        placeholder="Nhập số tiền"
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormText
        name="enrollment_payment_discount"
        label="Giảm giá"
        placeholder="Nhập số tiền giảm giá"
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormDatePicker
        name="enrollment_start_date"
        label="Ngày bắt đầu"
        placeholder="Chọn ngày bắt đầu"
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormDatePicker
        name="enrollment_end_date"
        label="Ngày kết thúc"
        placeholder="Chọn ngày kết thúc"
        colProps={{ xs: 24, sm: 12 }}
      />
    </ProForm.Group>
  );
}
