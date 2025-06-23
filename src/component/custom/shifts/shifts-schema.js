// path: @/component/custom/shifts/shifts-schema.js

import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
  ProFormTimePicker,
} from "@ant-design/pro-form";

export function ShiftsColumns(params) {
  const { shiftStatus } = params;

  return [
    {
      title: "Tên giờ học",
      dataIndex: "shift_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Trạng thái",
      dataIndex: "shift_status_id",
      valueType: "select",
      valueEnum: shiftStatus?.valueEnum || {},
      sorter: { multiple: 1 },
    },
    {
      title: "Giờ bắt đầu",
      dataIndex: "shift_start_time",
      valueType: "time",
      sorter: { multiple: 1 },
      responsive: ["md"],
    },
    {
      title: "Giờ kết thúc",
      dataIndex: "shift_end_time",
      valueType: "time",
      sorter: { multiple: 1 },
      responsive: ["md"],
    },
    {
      title: "Mô tả",
      dataIndex: "shift_desc",
      valueType: "textarea",
      sorter: { multiple: 1 },
      responsive: ["lg"],
    },
  ];
}

export function ShiftsFields(params) {
  const { shiftStatus } = params;

  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="shift_name"
        label="Tên giờ học"
        placeholder="Nhập tên giờ học"
        rules={[{ required: true }]}
        colProps={{ xs: 12 }}
      />
      <ProFormSelect
        name="shift_status_id"
        label="Trạng thái"
        placeholder="Chọn trạng thái"
        rules={[{ required: true }]}
        colProps={{ xs: 12 }}
        options={shiftStatus?.options || []}
      />
      <ProFormTimePicker
        name="shift_start_time"
        label="Giờ bắt đầu"
        placeholder="Chọn giờ bắt đầu"
        rules={[{ required: true }]}
        fieldProps={{ format: "HH:mm" }}
        colProps={{ xs: 12 }}
        width="100%"
      />
      <ProFormTimePicker
        name="shift_end_time"
        label="Giờ kết thúc"
        placeholder="Chọn giờ kết thúc"
        rules={[{ required: true }]}
        fieldProps={{ format: "HH:mm" }}
        colProps={{ xs: 12 }}
        width="100%"
      />
      <ProFormTextArea
        name="shift_desc"
        label="Mô tả"
        placeholder="Nhập mô tả giờ học"
        fieldProps={{ autoSize: { minRows: 3, maxRows: 6 } }}
      />
    </ProForm.Group>
  );
}
