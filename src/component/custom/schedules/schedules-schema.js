// path: @/component/custom/schedules/schedules-schema.js

import {
  ProForm,
  ProFormText,
  ProFormDatePicker,
  ProFormTextArea,
} from "@ant-design/pro-form";

export function SchedulesColumns() {
  return [
    {
      title: "Lớp học",
      dataIndex: "class_id",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Ca học",
      dataIndex: "shift_id",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Ngày học",
      dataIndex: "schedule_date",
      valueType: "date",
      sorter: { multiple: 1 },
    },
    {
      title: "Trạng thái lịch học",
      dataIndex: "schedule_status_id",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Nguồn lịch",
      dataIndex: "source_id",
      valueType: "text",
      sorter: { multiple: 1 },
      responsive: ["md"],
    },
    {
      title: "Giảng viên",
      dataIndex: "lecture_id",
      valueType: "text",
      sorter: { multiple: 1 },
      responsive: ["md"],
    },
    {
      title: "Phòng học",
      dataIndex: "room_id",
      valueType: "text",
      sorter: { multiple: 1 },
      responsive: ["md"],
    },
    {
      title: "Ghi chú lịch học",
      dataIndex: "schedule_desc",
      valueType: "textarea",
      sorter: { multiple: 1 },
      responsive: ["md"],
    },
  ];
}

export function SchedulesFields() {
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="class_id"
        label="Lớp học"
        placeholder="Nhập lớp học"
        rules={[{ required: true }]}
        colProps={{ sm: 12 }}
      />
      <ProFormText
        name="shift_id"
        label="Ca học"
        placeholder="Nhập ca học"
        rules={[{ required: true }]}
        colProps={{ sm: 12 }}
      />
      <ProFormDatePicker
        name="schedule_date"
        label="Ngày học"
        placeholder="Chọn ngày học"
        rules={[{ required: true }]}
        colProps={{ sm: 12 }}
      />
      <ProFormText
        name="schedule_status_id"
        label="Trạng thái lịch học"
        placeholder="Nhập trạng thái lịch học"
        rules={[{ required: true }]}
        colProps={{ sm: 12 }}
      />
      <ProFormText
        name="source_id"
        label="Nguồn lịch"
        placeholder="Nhập nguồn lịch"
        colProps={{ sm: 12 }}
      />
      <ProFormText
        name="lecture_id"
        label="Giảng viên"
        placeholder="Nhập giảng viên"
        colProps={{ sm: 12 }}
      />
      <ProFormText
        name="room_id"
        label="Phòng học"
        placeholder="Nhập phòng học"
        colProps={{ sm: 12 }}
      />
      <ProFormTextArea
        name="schedule_desc"
        label="Ghi chú lịch học"
        placeholder="Nhập ghi chú lịch học"
        fieldProps={{ autoSize: { minRows: 3, maxRows: 6 } }}
        colProps={{ sm: 24 }}
      />
    </ProForm.Group>
  );
}
