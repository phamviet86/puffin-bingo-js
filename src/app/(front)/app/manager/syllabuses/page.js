// SYLLABUSES LIST PAGE

"use client";

import { InfoCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, DetailButton } from "@/component/common";
import {
  SyllabusesTable,
  SyllabusesInfo,
  SyllabusesFormCreate,
  SyllabusesColumns,
  SyllabusesFields,
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
  const { syllabusStatus } = usePageContext();

  // page content: syllabuses
  const useSyllabusesTable = useTable();
  const useSyllabusesInfo = useInfo();

  const pageButton = [
    <Button
      key="refresh-button"
      label="Tải lại"
      color="default"
      variant="filled"
      onClick={() => useSyllabusesTable.reload()}
    />,
    <SyllabusesFormCreate
      key="create-form"
      fields={SyllabusesFields({ syllabusStatus })}
      onFormSubmitSuccess={(result) => {
        useSyllabusesInfo.close();
        navDetail(result?.data[0]?.id);
      }}
      title="Tạo giáo trình"
      trigger={<Button label="Tạo mới" />}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <SyllabusesTable
        tableHook={useSyllabusesTable}
        columns={SyllabusesColumns({ syllabusStatus })}
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
                  useSyllabusesInfo.setDataSource(record);
                  useSyllabusesInfo.open();
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
      <SyllabusesInfo
        infoHook={useSyllabusesInfo}
        columns={SyllabusesColumns({ syllabusStatus })}
        dataSource={useSyllabusesInfo.dataSource}
        drawerProps={{
          title: "Thông tin giáo trình",
          extra: [
            <DetailButton
              key="detail-button"
              label="Chi tiết"
              variant="filled"
              id={useSyllabusesInfo?.dataSource?.id}
            />,
          ],
        }}
      />
    </ProCard>
  );

  return (
    <PageContainer
      items={[{ title: "Quản lý" }, { title: "Giáo trình" }]}
      title="Quản lý giáo trình"
      extra={pageButton}
      content={pageContent}
    />
  );
}
