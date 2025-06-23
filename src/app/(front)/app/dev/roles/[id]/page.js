// ROLE DETAILS PAGE

"use client";

import { use } from "react";
import { EditOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, BackButton } from "@/component/common";
import {
  RolesDesc,
  RolesFormEdit,
  RolesColumns,
  RolesFields,
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
  const { navBack } = useNav();
  const { id: roleId } = use(params);
  const { roleStatus } = usePageContext();

  // page content: roles
  const roleDesc = useDesc();
  const roleForm = useForm();

  const pageButton = [
    <BackButton key="back-button" />,
    <RolesFormEdit
      formHook={roleForm}
      fields={RolesFields({ roleStatus })}
      id={roleId}
      onFormSubmitSuccess={() => roleDesc.reload()}
      onFormDeleteSuccess={() => {
        roleForm.close();
        navBack();
      }}
      key="edit-form"
      title="Sửa vai trò"
      trigger={<Button label="Sửa" icon={<EditOutlined />} />}
    />,
  ];

  const pageContent = (
    <ProCard bordered>
      <RolesDesc
        descHook={roleDesc}
        columns={RolesColumns({ roleStatus })}
        params={{ id: roleId }}
        onDescRequestSuccess={(result) =>
          roleDesc.setDataSource(result?.data?.[0])
        }
      />
    </ProCard>
  );

  const pageTitle = roleDesc?.dataSource?.name || "Chi tiết";
  document.title = `Vai trò - ${pageTitle}`;

  return (
    <PageContainer
      items={[
        { title: "Hệ thống" },
        { title: "Vai trò", path: "/app/dev/roles" },
        { title: pageTitle },
      ]}
      title={pageTitle}
      extra={pageButton}
      content={pageContent}
      // tabList={[]}
    />
  );
}
