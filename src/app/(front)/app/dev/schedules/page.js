// SCHEDULES LIST PAGE

"use client";

import { Space } from "antd";
import {
  CodeOutlined,
  InfoCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, DetailButton } from "@/component/common";
import {
  SchedulesTable,
  SchedulesInfo,
  SchedulesFormCreate,
  SchedulesColumns,
  SchedulesFields,
} from "@/component/custom";
import { useTable, useInfo, useNav } from "@/component/hook";
import { PageProvider, usePageContext } from "./provider";

export default function Page(props) {
  return (
    <PageProvider>
      <PageContent {...props} />
    </PageProvider>
  );
}

function PageContent() {
  const { navDetail } = useNav();
  const {
    scheduleStatus,
    classSelection,
    shiftSelection,
    lectureSelection,
    roomSelection,
  } = usePageContext();
  const useSchedulesTable = useTable();
  const useSchedulesInfo = useInfo();

  const pageButton = [
    <Button
      key="refresh-button"
      label="Tải lại"
      color="default"
      variant="filled"
      onClick={() => useSchedulesTable.reload()}
    />,
    <SchedulesFormCreate
      key="create-form"
      fields={SchedulesFields({
        scheduleStatus,
        classSelection,
        shiftSelection,
        lectureSelection,
        roomSelection,
      })}
      onFormSubmitSuccess={(result) => {
        useSchedulesInfo.close();
        navDetail(result?.data[0]?.id);
      }}
      title="Tạo lịch học"
      trigger={<Button label="Tạo mới" />}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <SchedulesTable
        tableHook={useSchedulesTable}
        columns={SchedulesColumns({
          scheduleStatus,
          classSelection,
          shiftSelection,
          lectureSelection,
          roomSelection,
        })}
        leftColumns={[
          {
            width: 56,
            align: "center",
            search: false,
            render: (_, record) => (
              <Button
                icon={<InfoCircleOutlined />}
                variant="link"
                onClick={() => {
                  useSchedulesInfo.setDataSource(record);
                  useSchedulesInfo.open();
                }}
              />
            ),
          },
        ]}
        rightColumns={[
          {
            width: 56,
            align: "center",
            search: false,
            render: (_, record) => (
              <DetailButton
                icon={<EyeOutlined />}
                variant="link"
                id={record?.id}
              />
            ),
            responsive: ["md"],
          },
        ]}
      />
      <SchedulesInfo
        infoHook={useSchedulesInfo}
        columns={SchedulesColumns()}
        dataSource={useSchedulesInfo.dataSource}
        drawerProps={{
          title: "Thông tin lịch học",
          extra: [
            <DetailButton
              key="detail-button"
              label="Chi tiết"
              variant="filled"
              id={useSchedulesInfo?.dataSource?.id}
            />,
          ],
        }}
      />
    </ProCard>
  );

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
        { title: "Lịch học" },
      ]}
      title="Quản lý lịch học"
      extra={pageButton}
      content={pageContent}
    />
  );
}
