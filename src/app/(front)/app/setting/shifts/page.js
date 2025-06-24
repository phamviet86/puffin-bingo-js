// SHIFTS LIST PAGE

"use client";

import {
  PlusOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  SyncOutlined,
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
      icon={<SyncOutlined />}
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
      trigger={<Button icon={<PlusOutlined />} label="Tạo mới" />}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <ShiftsTable
        tableHook={useShiftsTable}
        columns={ShiftsColumns({ shiftStatus })}
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
                  useShiftsInfo.setDataSource(record);
                  useShiftsInfo.open();
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
      items={[{ title: "Thiết lập" }, { title: "Ca học" }]}
      title="Quản lý ca học"
      extra={pageButton}
      content={pageContent}
    />
  );
}
