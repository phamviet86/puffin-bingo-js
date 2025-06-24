// ROLE DETAILS PAGE

"use client";

import { use } from "react";
import { Space } from "antd";
import { SettingOutlined } from "@ant-design/icons";
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
  // const { navBack } = useNav(); // enable this if you want to navigate back after delete
  const { roleStatus } = usePageContext();
  const { id: roleId } = use(params);

  // page content: roles
  const useRolesDesc = useDesc();
  const useRolesForm = useForm();

  const pageButton = [
    <BackButton key="back-button" />,
    <RolesFormEdit
      formHook={useRolesForm}
      fields={RolesFields({ roleStatus })}
      onFormRequestParams={{ id: roleId }}
      onFormSubmitSuccess={() => useRolesDesc.reload()}
      /* onFormDeleteParams={{ id: roleId }}
      onFormDeleteSuccess={() => {
        useRolesForm.close();
        navBack();
      }} */
      key="edit-form"
      title="Sửa vai trò"
      trigger={<Button label="Sửa" />}
    />,
  ];

  const pageContent = (
    <ProCard bordered>
      <RolesDesc
        descHook={useRolesDesc}
        columns={RolesColumns({ roleStatus })}
        onDescRequestParams={{ id: roleId }}
        onDescRequestSuccess={(result) =>
          useRolesDesc.setDataSource(result?.data?.[0])
        }
      />
    </ProCard>
  );

  const pageTitle = useRolesDesc?.dataSource?.role_name || "Chi tiết";
  document.title = `Vai trò - ${pageTitle}`;

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
        { title: "Vai trò", path: "/app/system/roles" },
        { title: pageTitle },
      ]}
      title={pageTitle}
      extra={pageButton}
      content={pageContent}
    />
  );
}
