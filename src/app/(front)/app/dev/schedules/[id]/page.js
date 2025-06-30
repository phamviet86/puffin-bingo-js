// SCHEDULES DETAIL PAGE

"use client";

import { use } from "react";
import { Space } from "antd";
import { CodeOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, BackButton } from "@/component/common";
import {
  SchedulesDesc,
  SchedulesFormEdit,
  SchedulesColumns,
  SchedulesFields,
} from "@/component/custom";
import { useDesc, useForm, useNav } from "@/component/hook";
import { PageProvider, usePageContext } from "../provider";

export default function Page(props) {
  return (
    <PageProvider>
      <PageContent {...props} />
    </PageProvider>
  );
}

function PageContent({ params }) {
  // const { navBack } = useNav(); // enable if you want to navigate back after delete
  const {
    scheduleStatus,
    classSelection,
    shiftSelection,
    lectureSelection,
    roomSelection,
  } = usePageContext();
  const { id: scheduleId } = use(params);
  const useSchedulesDesc = useDesc();
  const useSchedulesForm = useForm();

  const pageButton = [
    <BackButton key="back-button" />,
    <SchedulesFormEdit
      formHook={useSchedulesForm}
      fields={SchedulesFields({
        scheduleStatus,
        classSelection,
        shiftSelection,
        lectureSelection,
        roomSelection,
      })}
      onFormRequestParams={{ id: scheduleId }}
      onFormSubmitSuccess={() => useSchedulesDesc.reload()}
      /* onFormDeleteParams={{ id: scheduleId }}
      onFormDeleteSuccess={() => {
        useSchedulesForm.close();
        navBack();
      }} */
      key="edit-form"
      title="Sửa lịch học"
      trigger={<Button label="Sửa" />}
    />,
  ];

  const pageContent = (
    <ProCard bordered>
      <SchedulesDesc
        descHook={useSchedulesDesc}
        columns={SchedulesColumns({
          scheduleStatus,
          classSelection,
          shiftSelection,
          lectureSelection,
          roomSelection,
        })}
        onDescRequestParams={{ id: scheduleId }}
        onDescRequestSuccess={(result) =>
          useSchedulesDesc.setDataSource(result?.data?.[0])
        }
      />
    </ProCard>
  );

  const pageTitle = useSchedulesDesc?.dataSource?.schedule_desc || "Chi tiết";
  document.title = `Lịch học - ${pageTitle}`;

  return (
    <PageContainer
      items={[
        {
          title: (
            <Space>
              <CodeOutlined style={{ color: "#fa541c" }} />
              <span>Development</span>
            </Space>
          ),
          path: "/app/dev",
        },
        { title: "Lịch học", path: "/app/system/schedules" },
        { title: pageTitle },
      ]}
      title={pageTitle}
      extra={pageButton}
      content={pageContent}
    />
  );
}
