// path: @/component/custom/lectures/lectures-schema.js

import {
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
} from "@ant-design/pro-form";
import { fetchOption } from "@/lib/util/fetch-util";

export function LecturesColumns(params) {
  const { syllabusId, lectureStatus } = params || {};

  return [
    {
      title: "Học phần",
      dataIndex: "module_id",
      valueType: "select",
      request: (params) =>
        fetchOption("/api/modules", params, {
          label: "module_name",
          value: "id",
        }),
      params: {
        syllabus_id_e: syllabusId,
      },
      sorter: { multiple: 1 },
      responsive: ["sm"],
    },
    {
      title: "Tên bài giảng",
      dataIndex: "lecture_name",
      valueType: "text",
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
      responsive: ["lg"],
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
  const { syllabusId, lectureStatus } = params || {};

  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormSelect
        name="module_id"
        label="Học phần"
        placeholder="Chọn học phần"
        rules={[{ required: true }]}
        request={(params) =>
          fetchOption("/api/modules", params, {
            label: "module_name",
            value: "id",
          })
        }
        params={{
          syllabus_id_e: syllabusId,
        }}
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
        name="lecture_name"
        label="Tên bài giảng"
        placeholder="Nhập tên bài giảng"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="lecture_no"
        label="Số thứ tự"
        placeholder="Nhập số thứ tự"
      />
      <ProFormTextArea
        name="lecture_desc"
        label="Mô tả"
        placeholder="Nhập mô tả bài giảng"
        fieldProps={{ autoSize: { minRows: 3, maxRows: 6 } }}
      />
    </ProForm.Group>
  );
}
