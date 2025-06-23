// SYLLABUS DETAILS PAGE

"use client";

import { use } from "react";
import { EditOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, BackButton } from "@/component/common";
import {
  SyllabusesDesc,
  SyllabusesFormEdit,
  SyllabusesColumns,
  SyllabusesFields,
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
  const { syllabusStatus } = usePageContext();
  const { id: syllabusId } = use(params);

  // page content: syllabuses
  const useSyllabusesDesc = useDesc();
  const useSyllabusesForm = useForm();

  const pageButton = [
    <BackButton key="back-button" />,
    <SyllabusesFormEdit
      formHook={useSyllabusesForm}
      fields={SyllabusesFields({ syllabusStatus })}
      id={syllabusId}
      onFormSubmitSuccess={() => useSyllabusesDesc.reload()}
      onFormDeleteSuccess={() => {
        useSyllabusesForm.close();
        navBack();
      }}
      key="edit-form"
      title="Sửa giáo trình"
      trigger={<Button label="Sửa" icon={<EditOutlined />} />}
    />,
  ];

  const pageContent = (
    <ProCard bordered>
      <SyllabusesDesc
        descHook={useSyllabusesDesc}
        columns={SyllabusesColumns({ syllabusStatus })}
        params={{ id: syllabusId }}
        onDescRequestSuccess={(result) =>
          useSyllabusesDesc.setDataSource(result?.data?.[0])
        }
      />
    </ProCard>
  );

  const pageTitle = useSyllabusesDesc?.dataSource?.syllabus_name || "Chi tiết";
  document.title = `Giáo trình - ${pageTitle}`;

  return (
    <PageContainer
      items={[
        { title: "Hệ thống" },
        { title: "Giáo trình", path: "/app/dev/syllabuses" },
        { title: pageTitle },
      ]}
      title={pageTitle}
      extra={pageButton}
      content={pageContent}
    />
  );
}
