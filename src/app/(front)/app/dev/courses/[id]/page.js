// COURSE DETAILS PAGE

"use client";

import { use } from "react";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, BackButton } from "@/component/common";
import {
  CoursesDesc,
  CoursesFormEdit,
  CoursesColumns,
  CoursesFields,
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
  const {} = usePageContext();
  const { id: courseId } = use(params);

  // page content: courses
  const useCoursesDesc = useDesc();
  const useCoursesForm = useForm();

  const pageButton = [
    <BackButton key="back-button" />,
    <CoursesFormEdit
      formHook={useCoursesForm}
      fields={CoursesFields({})}
      onFormRequestParams={{ id: courseId }}
      onFormSubmitSuccess={() => useCoursesDesc.reload()}
      // enable if needed
      /* onFormDeleteParams={{ id: courseId }} 
      onFormDeleteSuccess={() => {
        useCoursesForm.close();
        navBack();
      }} */
      key="edit-form"
      title="Sửa khóa học"
      trigger={<Button label="Sửa" />}
    />,
  ];

  const pageContent = (
    <ProCard bordered>
      <CoursesDesc
        descHook={useCoursesDesc}
        columns={CoursesColumns({})}
        onDescRequestParams={{ id: courseId }}
        onDescRequestSuccess={(result) =>
          useCoursesDesc.setDataSource(result?.data?.[0])
        }
      />
    </ProCard>
  );

  const pageTitle = useCoursesDesc?.dataSource?.course_name || "Chi tiết";
  document.title = `Khóa học - ${pageTitle}`;

  return (
    <PageContainer
      items={[
        { title: "Hệ thống" },
        { title: "Khóa học", path: "/app/dev/courses" },
        { title: pageTitle },
      ]}
      title={pageTitle}
      extra={pageButton}
      content={pageContent}
    />
  );
}
