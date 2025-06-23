// path: @/component/custom/lectures/lectures-schema.js

import {
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
} from "@ant-design/pro-form";

export function LecturesColumns(params) {
  const { modules, lectureStatus } = params || {};

  return [
    {
      title: "Tên bài giảng",
      dataIndex: "lecture_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Module",
      dataIndex: "module_id",
      valueType: "select",
      valueEnum: modules?.valueEnum || {},
      sorter: { multiple: 1 },
    },
    {
      title: "Trạng thái",
      dataIndex: "lecture_status_id",
      valueType: "select",
      valueEnum: lectureStatus?.valueEnum || {},
      sorter: { multiple: 1 },
    },
    {
      title: "Số thứ tự",
      dataIndex: "lecture_no",
      valueType: "text",
      sorter: { multiple: 1 },
      responsive: ["md"],
    },
    {
      title: "Mô tả",
      dataIndex: "lecture_desc",
      valueType: "textarea",
      sorter: { multiple: 1 },
      responsive: ["lg"],
    },
  ];
}

export function LecturesFields(params) {
  const { modules, lectureStatus } = params || {};

  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="lecture_name"
        label="Tên bài giảng"
        placeholder="Nhập tên bài giảng"
        rules={[{ required: true }]}
        colProps={{ xs: 24 }}
      />
      <ProFormSelect
        name="module_id"
        label="Module"
        placeholder="Chọn module"
        rules={[{ required: true }]}
        options={modules?.options || []}
        colProps={{ xs: 12 }}
      />
      <ProFormSelect
        name="lecture_status_id"
        label="Trạng thái"
        placeholder="Chọn trạng thái"
        rules={[{ required: true }]}
        options={lectureStatus?.options || []}
        colProps={{ xs: 12 }}
      />
      <ProFormText
        name="lecture_no"
        label="Số thứ tự"
        placeholder="Nhập số thứ tự"
        colProps={{ xs: 12 }}
      />
      <ProFormTextArea
        name="lecture_desc"
        label="Mô tả"
        placeholder="Nhập mô tả bài giảng"
        fieldProps={{ autoSize: { minRows: 3, maxRows: 6 } }}
        colProps={{ xs: 24 }}
      />
    </ProForm.Group>
  );
}
