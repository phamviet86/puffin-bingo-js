// path: @/component/custom/classes/classes-schema.js

import { ProForm, ProFormText, ProFormDatePicker } from "@ant-design/pro-form";

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
      <ProFormText
        name="course_id"
        label="Khóa học"
        placeholder="Nhập khóa học"
        rules={[{ required: true }]}
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormText
        name="module_id"
        label="Module"
        placeholder="Nhập module"
        rules={[{ required: true }]}
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormDatePicker
        name="class_start_date"
        label="Ngày bắt đầu"
        placeholder="Chọn ngày bắt đầu"
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormDatePicker
        name="class_end_date"
        label="Ngày kết thúc"
        placeholder="Chọn ngày kết thúc"
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormText
        name="class_fee"
        label="Học phí"
        placeholder="Nhập học phí"
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormText
        name="class_total_fee"
        label="Tổng học phí"
        placeholder="Nhập tổng học phí"
        colProps={{ xs: 24, sm: 12 }}
      />
    </ProForm.Group>
  );
}
