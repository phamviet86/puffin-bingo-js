// ROLES LIST PAGE

"use client";

import { Space } from "antd";
import {
  SettingOutlined,
  InfoCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, DetailButton } from "@/component/common";
import {
  RolesTable,
  RolesInfo,
  RolesFormCreate,
  RolesColumns,
  RolesFields,
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
  const { roleStatus } = usePageContext();

  // page content: roles
  const useRolesTable = useTable();
  const useRolesInfo = useInfo();

  const pageButton = [
    <Button
      key="refresh-button"
      label="Tải lại"
      color="default"
      variant="filled"
      onClick={() => useRolesTable.reload()}
    />,
    <RolesFormCreate
      key="create-form"
      fields={RolesFields({ roleStatus })}
      onFormSubmitSuccess={(result) => {
        useRolesInfo.close();
        navDetail(result?.data[0]?.id);
      }}
      title="Tạo vai trò"
      trigger={<Button label="Tạo mới" />}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <RolesTable
        tableHook={useRolesTable}
        columns={RolesColumns({ roleStatus })}
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
                  useRolesInfo.setDataSource(record);
                  useRolesInfo.open();
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
      <RolesInfo
        infoHook={useRolesInfo}
        columns={RolesColumns({ roleStatus })}
        dataSource={useRolesInfo.dataSource}
        drawerProps={{
          title: "Thông tin vai trò",
          extra: [
            <DetailButton
              key="detail-button"
              label="Chi tiết"
              variant="filled"
              id={useRolesInfo?.dataSource?.id}
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
              <SettingOutlined />
              <span>Hệ thống</span>
            </Space>
          ),
        },
        { title: "Vai trò" },
      ]}
      title="Quản lý vai trò"
      extra={pageButton}
      content={pageContent}
    />
  );
}
