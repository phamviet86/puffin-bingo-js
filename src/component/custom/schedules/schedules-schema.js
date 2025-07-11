// path: @/component/custom/schedules/schedules-schema.js

import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormDatePicker,
  ProFormTextArea,
} from "@ant-design/pro-form";
import { renderTagFromEnum } from "@/lib/util/render-util";

export function SchedulesColumns(params) {
  const { scheduleStatus, shiftSelection, roomSelection } = params;
  return [
    {
      title: "Khoá học",
      dataIndex: "course_name",
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
      title: "Ngày học",
      dataIndex: "schedule_date",
      valueType: "date",
      sorter: { multiple: 1 },
    },
    {
      title: "Ca học",
      dataIndex: "shift_id",
      valueType: "text",
      valueEnum: shiftSelection?.valueEnum,
      sorter: { multiple: 1 },
    },
    {
      title: "Trạng thái",
      dataIndex: "schedule_status_id",
      valueType: "select",
      valueEnum: scheduleStatus?.valueEnum,
      sorter: { multiple: 1 },
      render: (_, record) =>
        renderTagFromEnum(record.schedule_status_id, scheduleStatus?.valueEnum),
    },
    {
      title: "Phòng học",
      dataIndex: "room_id",
      valueType: "text",
      valueEnum: roomSelection?.valueEnum,
      sorter: { multiple: 1 },
      responsive: ["md"],
    },
    {
      title: "Ghi chú",
      dataIndex: "schedule_desc",
      valueType: "textarea",
      sorter: { multiple: 1 },
      responsive: ["md"],
    },
  ];
}

export function SchedulesFields(params) {
  const { scheduleStatus, shiftSelection, roomSelection } = params;
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText name="class_id" label="ID Lớp học" hidden disabled />
      <ProFormText name="lecture_id" label="ID bài giảng" hidden disabled />
      <ProFormText name="source_id" label="ID Nguồn lịch" hidden disabled />

      <ProFormText
        name="course_name"
        label="Khóa học"
        disabled
        colProps={{ xs: 12 }}
      />
      <ProFormText
        name="module_name"
        label="Học phần"
        disabled
        colProps={{ xs: 12 }}
      />

      <ProFormDatePicker
        name="schedule_date"
        label="Ngày học"
        placeholder="Chọn ngày học"
        rules={[{ required: true }]}
        colProps={{ xs: 12 }}
        width="100%"
      />
      <ProFormSelect
        name="shift_id"
        label="Ca học"
        placeholder="Nhập ca học"
        options={shiftSelection?.options}
        rules={[{ required: true }]}
        colProps={{ xs: 12 }}
      />

      <ProFormSelect
        name="room_id"
        label="Phòng học"
        placeholder="Nhập phòng học"
        options={roomSelection?.options}
        colProps={{ xs: 12 }}
      />
      <ProFormSelect
        name="schedule_status_id"
        label="Trạng thái"
        placeholder="Nhập trạng thái"
        options={scheduleStatus?.options}
        rules={[{ required: true }]}
        colProps={{ xs: 12 }}
      />
      <ProFormTextArea
        name="schedule_desc"
        label="Ghi chú lịch học"
        placeholder="Nhập ghi chú lịch học"
        fieldProps={{ autoSize: { minRows: 3, maxRows: 6 } }}
      />
    </ProForm.Group>
  );
}
