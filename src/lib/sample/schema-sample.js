// path: @/component/custom/options/options-schema.js

import { ProForm, ProFormText, ProFormSelect } from "@ant-design/pro-form";
import { COLOR_ENUM } from "@/component/config";
import { fetchOption } from "@/lib/util/fetch-util";

// use enum
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

// use request and params
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
    },
    {
      title: "Trạng thái",
      dataIndex: "lecture_status_id",
      valueType: "select",
      valueEnum: lectureStatus?.valueEnum || {},
      sorter: { multiple: 1 },
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
        colProps={{ sm: 12 }}
      />
      <ProFormSelect
        name="lecture_status_id"
        label="Trạng thái"
        placeholder="Chọn trạng thái"
        rules={[{ required: true }]}
        options={lectureStatus?.options || []}
        colProps={{ sm: 12 }}
      />
    </ProForm.Group>
  );
}
