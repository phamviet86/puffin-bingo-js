// USERS LIST PAGE

"use client";

import { Space } from "antd";
import {
  PhoneOutlined,
  InfoCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, DetailButton } from "@/component/common";
import {
  UsersTable,
  UsersInfo,
  UsersFormCreate,
  AdminUsersColumns,
  UsersFields,
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
  const { userStatus } = usePageContext();

  // page content: users
  const useUsersTable = useTable();
  const useUsersInfo = useInfo();

  const pageButton = [
    <Button
      key="refresh-button"
      label="Tải lại"
      color="default"
      variant="filled"
      onClick={() => useUsersTable.reload()}
    />,
    <UsersFormCreate
      key="create-form"
      fields={UsersFields({ userStatus })}
      onFormSubmitSuccess={(result) => {
        useUsersInfo.close();
        navDetail(result?.data[0]?.id);
      }}
      title="Tạo người dùng"
      trigger={<Button label="Tạo mới" />}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <UsersTable
        tableHook={useUsersTable}
        onTableRequestParams={{ role_names_null: true }}
        columns={AdminUsersColumns({ userStatus })}
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
                  useUsersInfo.setDataSource(record);
                  useUsersInfo.open();
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
      <UsersInfo
        infoHook={useUsersInfo}
        columns={AdminUsersColumns({ userStatus })}
        dataSource={useUsersInfo.dataSource}
        drawerProps={{
          title: "Thông tin người dùng",
          extra: [
            <DetailButton
              key="detail-button"
              label="Chi tiết"
              variant="filled"
              id={useUsersInfo?.dataSource?.id}
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
              <PhoneOutlined />
              <span>Quản sinh</span>
            </Space>
          ),
        },
        { title: "Học viên" },
      ]}
      title="Danh sách học viên"
      extra={pageButton}
      content={pageContent}
    />
  );
}
