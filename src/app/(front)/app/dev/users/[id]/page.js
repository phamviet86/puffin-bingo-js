// USER DETAILS PAGE

"use client";

import { use } from "react";
import { EditOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, BackButton } from "@/component/common";
import {
  UsersDesc,
  UsersFormEdit,
  UsersColumns,
  UsersFields,
} from "@/component/custom";
import { useDesc, useForm, useNav } from "@/component/hook";
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
  const { navBack } = useNav();
  const { userStatus } = usePageContext();

  // page content: users
  const useUsersDesc = useDesc();
  const useUsersForm = useForm();

  const pageButton = [
    <BackButton key="back-button" />,
    <UsersFormEdit
      formHook={useUsersForm}
      fields={UsersFields({ userStatus })}
      id={userId}
      onFormSubmitSuccess={() => useUsersDesc.reload()}
      onFormDeleteSuccess={() => {
        useUsersForm.close();
        navBack();
      }}
      key="edit-form"
      title="Sửa người dùng"
      trigger={<Button label="Sửa" icon={<EditOutlined />} />}
    />,
  ];

  const pageContent = (
    <ProCard bordered>
      <UsersDesc
        descHook={useUsersDesc}
        columns={UsersColumns({ userStatus })}
        params={{ id: userId }}
        onDescRequestSuccess={(result) =>
          useUsersDesc.setDataSource(result?.data?.[0])
        }
      />
    </ProCard>
  );

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
    />
  );
}
