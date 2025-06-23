// ROLES LIST PAGE

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

  const useRolesTable = useTable();
  const useRolesInfo = useInfo();

  const pageButton = [
    <Button
      key="refresh-button"
      icon={<SyncOutlined />}
      label="Tải lại"
      color="default"
      variant="filled"
      onClick={() => useRolesTable.reload()}
    />,
    <RolesFormCreate
      key="create-form"
      fields={RolesFields({ roleStatus })}
      initialValues={{ role_color: "default" }}
      onFormSubmitSuccess={(result) => {
        useRolesInfo.close();
        navDetail(result?.data[0]?.id);
      }}
      title="Tạo vai trò"
      trigger={<Button icon={<PlusOutlined />} label="Tạo mới" />}
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
        columns={RolesColumns()}
        dataSource={useRolesInfo.dataSource}
        drawerProps={{
          title: "Thông tin vai trò",
          extra: [
            <DetailButton
              key="detail-button"
              label="Xem chi tiết"
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
      items={[{ title: "Hệ thống" }, { title: "Vai trò" }]}
      title="Quản lý vai trò"
      extra={pageButton}
      content={pageContent}
    />
  );
}
