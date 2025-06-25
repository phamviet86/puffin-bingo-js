// path: @/component/custom/classes/classes-schema.js

import {
  ProForm,
  ProFormText,
  ProFormDatePicker,
  ProFormMoney,
} from "@ant-design/pro-form";
import { SECTION_STATUS } from "@/component/config/enum-config";

export function ClassesColumns() {
  return [
    {
      title: "Giáo trình",
      dataIndex: "syllabus_name",
      valueType: "text",
      sorter: { multiple: 1 },
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
      valueEnum: SECTION_STATUS,
      sorter: { multiple: 1 },
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "class_start_date",
      valueType: "date",
      sorter: { multiple: 1 },
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "class_end_date",
      valueType: "date",
      sorter: { multiple: 1 },
    },
    {
      title: "Học phí",
      dataIndex: "class_fee",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Tổng học phí",
      dataIndex: "class_total_fee",
      valueType: "text",
      sorter: { multiple: 1 },
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
        name="syllabus_name"
        label="Giáo trình"
        colProps={{ xs: 12 }}
        disabled
      />
      <ProFormText
        name="module_name"
        label="Học phần"
        colProps={{ xs: 12 }}
        disabled
      />

      <ProFormDatePicker
        name="class_start_date"
        label="Ngày bắt đầu"
        placeholder="Chọn ngày bắt đầu"
        colProps={{ sm: 12 }}
        width="100%"
      />
      <ProFormDatePicker
        name="class_end_date"
        label="Ngày kết thúc"
        placeholder="Chọn ngày kết thúc"
        colProps={{ sm: 12 }}
        width="100%"
      />
      <ProFormMoney
        name="class_fee"
        label="Học phí"
        placeholder="Nhập học phí"
        locale="vn-VN"
        width="100%"
        colProps={{ xs: 12 }}
        precision={0}
      />
      <ProFormMoney
        name="class_total_fee"
        label="Tổng học phí"
        placeholder="Nhập tổng học phí"
        locale="vn-VN"
        width="100%"
        colProps={{ xs: 12 }}
        precision={0}
      />
    </ProForm.Group>
  );
}
