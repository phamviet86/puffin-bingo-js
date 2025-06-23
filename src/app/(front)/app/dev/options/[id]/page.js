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

export default function Page({ params }) {
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
        onDescRequestSuccess={(result) =>
          optionDesc.setDataSource(result?.data?.[0])
        }
      />
    </ProCard>
  );

  const pageTitle = optionDesc?.dataSource?.option_column || "Chi tiết";
  document.title = `Tùy chọn - ${pageTitle}`;

  return (
    <PageContainer
      items={[
        { title: "Hệ thống" },
        { title: "Tuỳ chọn", path: "/app/system/options" },
        { title: pageTitle },
      ]}
      title={pageTitle}
      extra={pageButton}
      content={pageContent}
      // tabList={[]}
    />
  );
}
