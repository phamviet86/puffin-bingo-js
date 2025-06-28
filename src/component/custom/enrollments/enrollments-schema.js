// path: @/component/custom/enrollments/enrollments-schema.js

import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormDatePicker,
  ProFormMoney,
  ProFormDigit,
  ProFormTextArea,
} from "@ant-design/pro-form";
import { ENROLLMENT_STATUS } from "@/component/config";

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
      title: "Loại đăng ký",
      dataIndex: "enrollment_type_id",
      valueType: "select",
      valueEnum: enrollmentType?.valueEnum || {},
      sorter: { multiple: 1 },
    },
    {
      title: "Trạng thái",
      dataIndex: "enrollment_status",
      valueType: "text",
      valueEnum: ENROLLMENT_STATUS,
      filters: true,
      sorter: { multiple: 1 },
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "enrollment_start_date",
      valueType: "date",
      search: false,
      sorter: { multiple: 1 },
      responsive: ["lg"],
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "enrollment_end_date",
      valueType: "date",
      search: false,
      sorter: { multiple: 1 },
      responsive: ["lg"],
    },
    {
      title: "Loại thanh toán",
      dataIndex: "enrollment_payment_type_id",
      valueType: "select",
      valueEnum: enrollmentPaymentType?.valueEnum || {},
      sorter: { multiple: 1 },
      responsive: ["xl"],
    },
    {
      title: "Số tiền",
      dataIndex: "enrollment_payment_amount",
      valueType: "text",
      search: false,
      sorter: { multiple: 1 },
      responsive: ["xl"],
    },
    {
      title: "Giảm giá",
      dataIndex: "enrollment_payment_discount",
      valueType: "text",
      search: false,
      sorter: { multiple: 1 },
      responsive: ["xl"],
    },
  ];
}

export function EnrollmentsFields(params) {
  const { enrollmentType, enrollmentPaymentType } = params || {};

  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText name="user_id" label="ID người dùng" hidden disable />
      <ProFormText name="module_id" label="ID học phần" hidden disable />
      <ProFormText name="class_id" label="ID lớp học" hidden disable />
      <ProFormText
        name="course_name"
        label="Khoá học"
        disabled
        colProps={{ sm: 12 }}
      />
      <ProFormText
        name="module_name"
        label="Học phần"
        disabled
        colProps={{ sm: 12 }}
      />
      <ProFormText
        name="user_name"
        label="Người dùng"
        disabled
        colProps={{ sm: 12 }}
      />
      <ProFormSelect
        name="enrollment_type_id"
        label="Loại đăng ký"
        options={enrollmentType?.options || []}
        colProps={{ sm: 12 }}
        disabled
      />
      <ProFormDatePicker
        name="enrollment_start_date"
        label="Ngày bắt đầu"
        placeholder="Chọn ngày"
        colProps={{ xs: 12 }}
        width="100%"
      />
      <ProFormDatePicker
        name="enrollment_end_date"
        label="Ngày kết thúc"
        placeholder="Chọn ngày"
        colProps={{ xs: 12 }}
        width="100%"
      />
      <ProFormSelect
        name="enrollment_payment_type_id"
        label="Thanh toán"
        placeholder="Chọn thanh toán"
        options={enrollmentPaymentType?.options || []}
      />
      <ProFormMoney
        name="enrollment_payment_amount"
        label="Số tiền"
        placeholder="Nhập số tiền"
        locale="vn-VN"
        colProps={{ xs: 12 }}
        width="100%"
      />
      <ProFormDigit
        name="enrollment_payment_discount"
        label="Giảm giá (%)"
        placeholder="Nhập giảm giá"
        fieldProps={{ formatter: (value) => (value ? `${value} %` : "") }}
        min={0}
        max={100}
        colProps={{ xs: 12 }}
        width="100%"
      />
      <ProFormTextArea
        name="enrollment_discount_notes"
        label="Ghi chú giảm giá"
        placeholder="Nhập ghi chú giảm giá"
        fieldProps={{ autoSize: { minRows: 1, maxRows: 3 } }}
      />
      <ProFormTextArea
        name="enrollment_desc"
        label="Ghi chú khác"
        placeholder="Nhập ghi chú khác"
        fieldProps={{ autoSize: { minRows: 3, maxRows: 6 } }}
      />
    </ProForm.Group>
  );
}
