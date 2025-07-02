// USER DETAILS PAGE

"use client";

import { use } from "react";
import { Space } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, BackButton } from "@/component/common";
import {
  UsersDesc,
  UsersFormEdit,
  AdminUsersColumns,
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
      key="edit-form"
      title="Sửa người dùng"
      trigger={<Button label="Sửa" />}
    />,
  ];

  const pageContent = (
    <ProCard bordered>
      <UsersDesc
        descHook={useUsersDesc}
        columns={AdminUsersColumns({ userStatus })}
        onDescRequestParams={{ id: userId }}
        onDescRequestSuccess={(result) =>
          useUsersDesc.setDataSource(result?.data?.[0])
        }
      />
    </ProCard>
  );

  // tab content: user-roles
  const userRolesTab = {
    key: "enrollments",
    label: "Đăng ký học",
    children: (
      <ProCard
        boxShadow
        title="Danh sách lớp"
        extra={
          <Space>
            <Button key="add-modules" label="Chờ lớp" variant="filled" />
            <Button key="add-classes" label="Xếp lớp" variant="filled" />
          </Space>
        }
      ></ProCard>
    ),
  };

  const pageTitle = useUsersDesc?.dataSource?.user_name || "Chi tiết";
  document.title = `Người dùng - ${pageTitle}`;

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
        { title: pageTitle },
      ]}
      title={pageTitle}
      extra={pageButton}
      content={pageContent}
      tabList={[userRolesTab]}
    />
  );
}
