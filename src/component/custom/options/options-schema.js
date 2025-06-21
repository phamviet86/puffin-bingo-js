// path: @/component/custom/options/options-schema.js

import { ProForm, ProFormText, ProFormSelect } from "@ant-design/pro-form";
import { COLOR_ENUM } from "@/component/config";

export function OptionsColumns() {
  return [
    {
      title: "ID",
      dataIndex: "id",
      valueType: "text",
      search: false,
      width: 80,
      responsive: ["md"],
    },
    {
      title: "Bảng",
      dataIndex: "option_table",
      valueType: "text",
      sorter: { multiple: 1 },
      responsive: ["lg"],
    },
    {
      title: "Cột",
      dataIndex: "option_column",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Nhãn",
      dataIndex: "option_label",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Màu Sắc",
      dataIndex: "option_color",
      valueType: "select",
      valueEnum: COLOR_ENUM,
      sorter: { multiple: 1 },
      responsive: ["xl"],
    },
    {
      title: "Nhóm",
      dataIndex: "option_group",
      valueType: "text",
      sorter: { multiple: 1 },
      responsive: ["xxl"],
    },
  ];
}

export function OptionsFields() {
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="option_table"
        label="Bảng"
        placeholder="Nhập tên bảng"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="option_column"
        label="Cột"
        placeholder="Nhập tên cột"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="option_label"
        label="Nhãn"
        placeholder="Nhập nhãn"
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="option_color"
        label="Màu Sắc"
        placeholder="Chọn màu sắc"
        options={COLOR_ENUM}
      />
      <ProFormText
        name="option_group"
        label="Nhóm"
        placeholder="Nhập tên nhóm"
      />
    </ProForm.Group>
  );
}
