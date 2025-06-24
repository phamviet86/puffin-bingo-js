// USER DETAILS PAGE

"use client";

import { use } from "react";
import { ProCard } from "@ant-design/pro-components";
import { Space } from "antd";
import { PageContainer, Button, BackButton } from "@/component/common";
import {
  UsersDesc,
  UsersFormEdit,
  UsersColumns,
  UsersFields,
  UserRolesTable,
  UserRolesColumns,
  UserRolesTransfer,
} from "@/component/custom";
import {
  useDesc,
  useForm,
  useNav,
  useTable,
  useTransfer,
} from "@/component/hook";
import { PageProvider, usePageContext } from "../provider";

export default function Page(props) {
  return (
    <PageProvider>
      <PageContent {...props} />
    </PageProvider>
  );
}

function PageContent({ params }) {
  const { id: userId } = use(params);
  // const { navBack } = useNav(); // enable this if you want to navigate back after delete
  const { userStatus } = usePageContext();

  // page content: users
  const useUsersDesc = useDesc();
  const useUsersForm = useForm();

  const pageButton = [
    <BackButton key="back-button" />,
    <UsersFormEdit
      formHook={useUsersForm}
      fields={UsersFields({ userStatus })}
      onFormRequestParams={{ id: userId }}
      onFormSubmitSuccess={() => useUsersDesc.reload()}
      /* onFormDeleteParams={{ id: userId }}
      onFormDeleteSuccess={() => {
        useUsersForm.close();
        navBack();
      }} */
      key="edit-form"
      title="Sửa người dùng"
      trigger={<Button label="Sửa" />}
    />,
  ];

  const pageContent = (
    <ProCard bordered>
      <UsersDesc
        descHook={useUsersDesc}
        columns={UsersColumns({ userStatus })}
        onDescRequestParams={{ id: userId }}
        onDescRequestSuccess={(result) =>
          useUsersDesc.setDataSource(result?.data?.[0])
        }
      />
    </ProCard>
  );

  // tab content: user-roles
  const useUserRolesTable = useTable();
  const useUserRoleTransfer = useTransfer();

  const userRolesTab = {
    key: "user-roles",
    label: "Phân quyền",
    children: (
      <ProCard
        boxShadow
        title="Danh sách quyền"
        extra={
          <Space>
            <Button
              label="Tải lại"
              color="default"
              variant="filled"
              onClick={() => useUserRolesTable.reload()}
            />
            <Button
              label="Điều chỉnh"
              variant="filled"
              onClick={() => useUserRoleTransfer.open()}
            />
          </Space>
        }
      >
        <UserRolesTable
          tableHook={useUserRolesTable}
          columns={UserRolesColumns()}
          onTableRequestParams={{ user_id: userId }}
          showSearch={false}
        />
        <UserRolesTransfer
          transferHook={useUserRoleTransfer}
          userId={userId}
          onTransferClose={() => {
            useUsersDesc.reload();
            useUserRolesTable.reload();
          }}
        />
      </ProCard>
    ),
  };

  const pageTitle = useUsersDesc?.dataSource?.user_name || "Chi tiết";
  document.title = `Người dùng - ${pageTitle}`;

  return (
    <PageContainer
      items={[
        { title: "Quản lý" },
        { title: "Người dùng", path: "/app/manager/users" },
        { title: pageTitle },
      ]}
      title={pageTitle}
      extra={pageButton}
      content={pageContent}
      tabList={[userRolesTab]}
    />
  );
}
