// CLASSES LIST PAGE

"use client";

import { Space } from "antd";
import {
  BankOutlined,
  InfoCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, DetailButton } from "@/component/common";
import { ClassesTable, ClassesInfo, ClassesColumns } from "@/component/custom";
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
  const {} = usePageContext();

  const useClassesTable = useTable();
  const useClassesInfo = useInfo();

  const pageButton = [
    <Button
      key="refresh-button"
      label="Tải lại"
      color="default"
      variant="filled"
      onClick={() => useClassesTable.reload()}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <ClassesTable
        tableHook={useClassesTable}
        columns={ClassesColumns()}
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
                  useClassesInfo.setDataSource(record);
                  useClassesInfo.open();
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
      <ClassesInfo
        infoHook={useClassesInfo}
        columns={ClassesColumns()}
        dataSource={useClassesInfo.dataSource}
        drawerProps={{
          title: "Thông tin lớp học",
          extra: [
            <DetailButton
              key="detail-button"
              label="Chi tiết"
              variant="filled"
              id={useClassesInfo?.dataSource?.id}
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
              <BankOutlined />
              <span>Quản lý</span>
            </Space>
          ),
        },
        { title: "Lớp học" },
      ]}
      title="Quản lý lớp học"
      extra={pageButton}
      content={pageContent}
    />
  );
}
