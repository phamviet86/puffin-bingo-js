"use client";

import { use } from "react";
import { EditOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, BackButton } from "@/component/common";
import {
  OptionsDesc,
  OptionsFormEdit,
  OptionsColumns,
  OptionsFields,
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
  const {} = usePageContext();
  const { navBack } = useNav();
  const { id: optionId } = use(params);

  // page content: options
  const optionDesc = useDesc();
  const optionForm = useForm();

  const pageButton = [
    <BackButton key="back-button" />,
    <OptionsFormEdit
      formHook={optionForm}
      fields={OptionsFields()}
      id={optionId}
      onFormSubmitSuccess={() => optionDesc.reload()}
      onFormDeleteSuccess={() => {
        optionForm.close();
        navBack();
      }}
      key="edit-form"
      title="Sửa tùy chọn"
      trigger={<Button label="Sửa" icon={<EditOutlined />} />}
    />,
  ];

  const pageContent = (
    <ProCard bordered>
      <OptionsDesc
        descHook={optionDesc}
        columns={OptionsColumns()}
        params={{ id: optionId }}
        onDescRequestSuccess={(result) => {
          console.log("Desc request success:", result);
          optionDesc.setDataSource(result?.data?.[0]);
        }}
      />
    </ProCard>
  );

  const pageTitle = optionDesc?.dataSource?.option_column || "Chi tiết";
  document.title = `Tùy chọn - ${pageTitle}`;

  return (
    <PageContainer
      items={[
        { title: "Hệ thống" },
        { title: "Tuỳ chọn", path: "/app/manager/courses" },
        { title: pageTitle },
      ]}
      title={pageTitle}
      extra={pageButton}
      content={pageContent}
      // tabList={[]}
    />
  );
}
