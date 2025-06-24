"use client";

import { use } from "react";
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
  const useOptionDesc = useDesc();
  const useOptionForm = useForm();

  const pageButton = [
    <BackButton key="back-button" />,
    <OptionsFormEdit
      formHook={useOptionForm}
      fields={OptionsFields()}
      onFormRequestParams={{ id: optionId }}
      onFormDeleteParams={{ id: optionId }}
      onFormSubmitSuccess={() => useOptionDesc.reload()}
      onFormDeleteSuccess={() => {
        useOptionForm.close();
        navBack();
      }}
      key="edit-form"
      title="Sửa tùy chọn"
      trigger={<Button label="Sửa" />}
    />,
  ];

  const pageContent = (
    <ProCard bordered>
      <OptionsDesc
        descHook={useOptionDesc}
        columns={OptionsColumns()}
        onDescRequestParams={{ id: optionId }}
        onDescRequestSuccess={(result) =>
          useOptionDesc.setDataSource(result?.data?.[0])
        }
      />
    </ProCard>
  );

  const pageTitle = useOptionDesc?.dataSource?.option_column || "Chi tiết";
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
