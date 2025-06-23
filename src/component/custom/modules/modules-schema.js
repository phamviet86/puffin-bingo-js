// path: @/component/custom/modules/modules-schema.js

import {
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
} from "@ant-design/pro-form";

export function ModulesColumns(params) {
  const { moduleStatus } = params || {};

  return [
    {
      title: "Tên học phần",
      dataIndex: "module_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Trạng thái",
      dataIndex: "module_status_id",
      valueType: "select",
      valueEnum: moduleStatus?.valueEnum || {},
      sorter: { multiple: 1 },
    },
    {
      title: "Mô tả",
      dataIndex: "module_desc",
      valueType: "textarea",
      sorter: { multiple: 1 },
      responsive: ["md"],
    },
  ];
}

export function ModulesFields(params) {
  const { moduleStatus } = params || {};

  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText name="syllabus_id" label="ID giáo trình" hidden disabled />
      <ProFormText
        name="module_name"
        label="Tên học phần"
        placeholder="Nhập tên học phần"
        rules={[{ required: true }]}
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormSelect
        name="module_status_id"
        label="Trạng thái"
        placeholder="Chọn trạng thái"
        rules={[{ required: true }]}
        options={moduleStatus?.options || []}
        colProps={{ xs: 24, sm: 12 }}
      />
      <ProFormTextArea
        name="module_desc"
        label="Mô tả"
        placeholder="Nhập mô tả học phần"
        fieldProps={{ autoSize: { minRows: 3, maxRows: 6 } }}
      />
    </ProForm.Group>
  );
}
