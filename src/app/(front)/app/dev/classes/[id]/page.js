// CLASSES DETAIL PAGE

"use client";

import { use } from "react";
import { Space } from "antd";
import { CodeOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, BackButton } from "@/component/common";
import {
  ClassesDesc,
  ClassesFormEdit,
  ClassesColumns,
  ClassesFields,
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
  // const { navBack } = useNav(); // enable if you want to navigate back after delete
  const { courseOptions, moduleOptions } = usePageContext();
  const { id: classId } = use(params);

  const useClassesDesc = useDesc();
  const useClassesForm = useForm();

  const pageButton = [
    <BackButton key="back-button" />,
    <ClassesFormEdit
      formHook={useClassesForm}
      fields={ClassesFields({ courseOptions, moduleOptions })}
      onFormRequestParams={{ id: classId }}
      onFormSubmitSuccess={() => useClassesDesc.reload()}
      /* onFormDeleteParams={{ id: classId }}
      onFormDeleteSuccess={() => {
        useClassesForm.close();
        navBack();
      }} */
      key="edit-form"
      title="Sửa lớp học"
      trigger={<Button label="Sửa" />}
    />,
  ];

  const pageContent = (
    <ProCard bordered>
      <ClassesDesc
        descHook={useClassesDesc}
        columns={ClassesColumns({ courseOptions, moduleOptions })}
        onDescRequestParams={{ id: classId }}
        onDescRequestSuccess={(result) =>
          useClassesDesc.setDataSource(result?.data?.[0])
        }
      />
    </ProCard>
  );

  const pageTitle = useClassesDesc?.dataSource?.class_name || "Chi tiết";
  document.title = `Lớp học - ${pageTitle}`;

  return (
    <PageContainer
      items={[
        {
          title: (
            <Space>
              <CodeOutlined style={{ color: "#fa541c" }} />
              <span>Development</span>
            </Space>
          ),
          path: "/app/dev",
        },
        { title: "Lớp học", path: "/app/dev/classes" },
        { title: pageTitle },
      ]}
      title={pageTitle}
      extra={pageButton}
      content={pageContent}
    />
  );
}
