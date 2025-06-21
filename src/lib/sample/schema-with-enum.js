// path: @/component/custom/options/options-schema.js

import { ProForm, ProFormSelect } from "@ant-design/pro-form";
import { COLOR_ENUM } from "@/component/config";

export function OptionsColumns() {
  return [
    {
      title: "Màu Sắc",
      dataIndex: "option_color",
      valueType: "select",
      valueEnum: COLOR_ENUM,
      sorter: { multiple: 1 },
    },
  ];
}

export function OptionsFields() {
  return (
    <ProForm.Group>
      <ProFormSelect
        name="option_color"
        label="Màu Sắc"
        placeholder="Chọn màu sắc"
        options={COLOR_ENUM}
      />
    </ProForm.Group>
  );
}
