// path: @/component/custom/rooms/rooms-schema.js

import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
} from "@ant-design/pro-form";

export function RoomsColumns(params) {
  const { roomStatus } = params;

  return [
    {
      title: "Tên phòng",
      dataIndex: "room_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Trạng thái",
      dataIndex: "room_status_id",
      valueType: "text",
      valueEnum: roomStatus?.valueEnum || {},
      sorter: { multiple: 1 },
    },
    {
      title: "Mô tả",
      dataIndex: "room_desc",
      valueType: "textarea",
      sorter: { multiple: 1 },
      responsive: ["md"],
    },
  ];
}

export function RoomsFields(params) {
  const { roomStatus } = params;

  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="room_name"
        label="Tên phòng"
        placeholder="Nhập tên phòng"
        rules={[{ required: true }]}
        colProps={{ sm: 12 }}
      />
      <ProFormSelect
        name="room_status_id"
        label="Trạng thái"
        placeholder="Chọn trạng thái"
        rules={[{ required: true }]}
        options={roomStatus?.options || []}
        colProps={{ sm: 12 }}
      />
      <ProFormTextArea
        name="room_desc"
        label="Mô tả"
        placeholder="Nhập mô tả phòng"
        fieldProps={{ autoSize: { minRows: 3, maxRows: 6 } }}
      />
    </ProForm.Group>
  );
}
