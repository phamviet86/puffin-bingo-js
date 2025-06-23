// path: @/component/custom/syllabuses/syllabuses-schema.js

import { ProForm, ProFormText, ProFormSelect } from "@ant-design/pro-form";

export function SyllabusesColumns(params) {
  const { syllabusStatus } = params || {};

  return [
    {
      title: "Tên giáo trình",
      dataIndex: "syllabus_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Trạng thái",
      dataIndex: "syllabus_status_id",
      valueType: "select",
      valueEnum: syllabusStatus?.valueEnum || {},
      sorter: { multiple: 1 },
    },
  ];
}

export function SyllabusesFields(params) {
  const { syllabusStatus } = params || {};

  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="syllabus_name"
        label="Tên giáo trình"
        placeholder="Nhập tên giáo trình"
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="syllabus_status_id"
        label="Trạng thái"
        placeholder="Chọn trạng thái"
        rules={[{ required: true }]}
        options={syllabusStatus?.options || []}
      />
    </ProForm.Group>
  );
}
