// SHIFTS LIST PAGE

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
  ShiftsTable,
  ShiftsInfo,
  ShiftsFormCreate,
  ShiftsColumns,
  ShiftsFields,
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
  const { shiftStatus } = usePageContext();

  // page content: shifts
  const useShiftsTable = useTable();
  const useShiftsInfo = useInfo();

  const pageButton = [
    <Button
      key="refresh-button"
      label="Tải lại"
      color="default"
      variant="filled"
      onClick={() => useShiftsTable.reload()}
    />,
    <ShiftsFormCreate
      key="create-form"
      fields={ShiftsFields({ shiftStatus })}
      onFormSubmitSuccess={(result) => {
        useShiftsInfo.close();
        navDetail(result?.data[0]?.id);
      }}
      title="Tạo ca học"
      trigger={<Button label="Tạo mới" />}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <ShiftsTable
        tableHook={useShiftsTable}
        columns={ShiftsColumns({ shiftStatus })}
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
                  useShiftsInfo.setDataSource(record);
                  useShiftsInfo.open();
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
      <ShiftsInfo
        infoHook={useShiftsInfo}
        columns={ShiftsColumns({ shiftStatus })}
        dataSource={useShiftsInfo.dataSource}
        drawerProps={{
          title: "Thông tin ca học",
          extra: [
            <DetailButton
              key="detail-button"
              label="Chi tiết"
              variant="filled"
              id={useShiftsInfo?.dataSource?.id}
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
        { title: "Ca học" },
      ]}
      title="Quản lý ca học"
      extra={pageButton}
      content={pageContent}
    />
  );
}
