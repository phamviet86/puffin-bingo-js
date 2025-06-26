// COURSE DETAILS PAGE

"use client";

import { use } from "react";
import { Space } from "antd";
import {
  BankOutlined,
  InfoCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, BackButton } from "@/component/common";
import {
  CoursesDesc,
  CoursesFormEdit,
  CoursesColumns,
  CoursesFields,
  ClassesTable,
  ClassesInfo,
  ClassesFormEdit,
  CourseClassesColumns,
  ClassesFields,
  ClassesTransfer,
} from "@/component/custom";
import {
  useDesc,
  useForm,
  useNav,
  useTable,
  useInfo,
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

  // tab content: classes
  const useClassesTable = useTable();
  const useClassesInfo = useInfo();
  const useClassesForm = useForm();
  const useClassesTransfer = useTransfer();

  const classesTab = {
    key: "classes",
    label: "Lớp học",
    children: (
      <ProCard
        boxShadow
        title="Danh sách lớp học"
        extra={
          <Space>
            <Button
              label="Tải lại"
              color="default"
              variant="filled"
              onClick={() => useClassesTable.reload()}
            />
            <Button
              label="Tạo lớp"
              variant="filled"
              onClick={() => useClassesTransfer.open()}
            />
          </Space>
        }
      >
        <ClassesTable
          tableHook={useClassesTable}
          columns={CourseClassesColumns()}
          firstColumns={[
            {
              width: 56,
              align: "center",
              search: false,
              render: (_, record) => (
                <Button
                  icon={<InfoCircleOutlined />}
                  variant="link"
                  onClick={() => {
                    useClassesInfo.setDataSource(record);
                    useClassesInfo.open();
                  }}
                />
              ),
            },
          ]}
          lastColumns={[
            {
              width: 56,
              align: "center",
              search: false,
              render: (_, record) => (
                <Button
                  icon={<EditOutlined />}
                  variant="link"
                  onClick={() => {
                    useClassesForm.setId(record?.id);
                    useClassesForm.open();
                  }}
                />
              ),
              responsive: ["md"],
            },
          ]}
        />
        <ClassesInfo
          infoHook={useClassesInfo}
          columns={CourseClassesColumns()}
          dataSource={useClassesInfo.dataSource}
          drawerProps={{
            title: "Thông tin lớp học",
            extra: [
              <Button
                key="classes-form-edit"
                label="Sửa"
                variant="filled"
                onClick={() => {
                  useClassesInfo.close();
                  useClassesForm.setId(useClassesInfo?.dataSource?.id);
                  useClassesForm.open();
                }}
              />,
            ],
          }}
        />
        <ClassesFormEdit
          formHook={useClassesForm}
          fields={ClassesFields()}
          onFormRequestParams={{ id: useClassesForm.id }}
          onFormSubmitSuccess={() => useClassesTable.reload()}
          // enable if needed
          /* onFormDeleteParams={{ id: useClassesForm.id }}
        onFormDeleteSuccess={() => {
          useClassesForm.close();
          useClassesTable.reload();
        }} */
          title="Sửa lớp học"
        />
        <ClassesTransfer
          courseId={courseId}
          transferHook={useClassesTransfer}
          onTransferClose={() => {
            useClassesTable.reload();
          }}
          onSourceParams={{ syllabus_status_id: 7, module_status_id: 10 }}
          onTargetParams={{ course_id: courseId }}
        />
      </ProCard>
    ),
  };

  const pageTitle = useCoursesDesc?.dataSource?.course_name || "Chi tiết";
  document.title = `Khóa học - ${pageTitle}`;

  return (
    <PageContainer
      items={[
        {
          title: (
            <Space>
              <BankOutlined />
              <span>Quản lý</span>
            </Space>
          ),
        },
        { title: "Khóa học", path: "/app/manager/courses" },
        { title: pageTitle },
      ]}
      title={pageTitle}
      extra={pageButton}
      content={pageContent}
      tabList={[classesTab]}
    />
  );
}
