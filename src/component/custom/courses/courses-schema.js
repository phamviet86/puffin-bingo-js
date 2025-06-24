// path: @/component/custom/courses/courses-schema.js

import { ProForm, ProFormText } from "@ant-design/pro-form";

export function CoursesColumns(params) {
  return [
    {
      title: "Tên khóa học",
      dataIndex: "course_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Mã khóa học",
      dataIndex: "course_code",
      valueType: "text",
      sorter: { multiple: 1 },
    },
  ];
}

export function CoursesFields(params) {
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="course_name"
        label="Tên khóa học"
        placeholder="Nhập tên khóa học"
        rules={[{ required: true }]}
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormText
        name="course_code"
        label="Mã khóa học"
        placeholder="Nhập mã khóa học"
        rules={[{ required: true }]}
        colProps={{ xs: 24, sm: 12 }}
      />
    </ProForm.Group>
  );
}
