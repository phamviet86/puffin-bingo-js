// ROOMS LIST PAGE

"use client";

import { Space } from "antd";
import {
  ToolOutlined,
  InfoCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, DetailButton } from "@/component/common";
import {
  RoomsTable,
  RoomsInfo,
  RoomsFormCreate,
  RoomsColumns,
  RoomsFields,
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
  const { roomStatus } = usePageContext();

  // page content: rooms
  const useRoomsTable = useTable();
  const useRoomsInfo = useInfo();

  const pageButton = [
    <Button
      key="refresh-button"
      label="Tải lại"
      color="default"
      variant="filled"
      onClick={() => useRoomsTable.reload()}
    />,
    <RoomsFormCreate
      key="create-form"
      fields={RoomsFields({ roomStatus })}
      onFormSubmitSuccess={(result) => {
        useRoomsInfo.close();
        navDetail(result?.data[0]?.id);
      }}
      title="Tạo phòng học"
      trigger={<Button label="Tạo mới" />}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <RoomsTable
        tableHook={useRoomsTable}
        columns={RoomsColumns({ roomStatus })}
        firstColumns={[
          {
            width: 56,
            align: "center",
            search: false,
            render: (_, record) => (
              <Button
                icon={<InfoCircleOutlined />}
                variant="link"
                onClick={() => {
                  useRoomsInfo.setDataSource(record);
                  useRoomsInfo.open();
                }}
              />
            ),
          },
        ]}
        lastColumns={[
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
      <RoomsInfo
        infoHook={useRoomsInfo}
        columns={RoomsColumns({ roomStatus })}
        dataSource={useRoomsInfo.dataSource}
        drawerProps={{
          title: "Thông tin phòng học",
          extra: [
            <DetailButton
              key="detail-button"
              label="Chi tiết"
              variant="filled"
              id={useRoomsInfo?.dataSource?.id}
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
              <ToolOutlined />
              <span>Thiết lập</span>
            </Space>
          ),
        },
        { title: "Phòng học" },
      ]}
      title="Quản lý phòng học"
      extra={pageButton}
      content={pageContent}
    />
  );
}
