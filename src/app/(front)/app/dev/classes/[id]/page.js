// CLASSES DETAIL PAGE

"use client";

import { use } from "react";
import { Space } from "antd";
import {
  CodeOutlined,
  InfoCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, BackButton } from "@/component/common";
import {
  ClassesDesc,
  ClassesFormEdit,
  ClassesColumns,
  ClassesFields,
  EnrollmentsTable,
  EnrollmentsInfo,
  EnrollmentsFormCreate,
  EnrollmentsFormEdit,
  EnrollmentsColumns,
  EnrollmentsFields,
} from "@/component/custom";
import { useDesc, useForm, useNav, useTable, useInfo } from "@/component/hook";
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
  const { enrollmentType, enrollmentPaymentType } = usePageContext();
  const { id: classId } = use(params);

  const useClassesDesc = useDesc();
  const useClassesForm = useForm();

  const pageButton = [
    <BackButton key="back-button" />,
    <ClassesFormEdit
      formHook={useClassesForm}
      fields={ClassesFields()}
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
        columns={ClassesColumns()}
        onDescRequestParams={{ id: classId }}
        onDescRequestSuccess={(result) =>
          useClassesDesc.setDataSource(result?.data?.[0])
        }
      />
    </ProCard>
  );

  // tab content: enrollments
  const useEnrollmentsTable = useTable();
  const useEnrollmentsInfo = useInfo();
  const useEnrollmentsForm = useForm();

  const enrollmentsTab = {
    key: "enrollments",
    label: "Đăng ký",
    children: (
      <ProCard
        boxShadow
        title="Danh sách đăng ký"
        extra={
          <Space>
            <Button
              label="Tải lại"
              color="default"
              variant="filled"
              onClick={() => useEnrollmentsTable.reload()}
            />
            <EnrollmentsFormCreate
              fields={EnrollmentsFields({
                enrollmentType,
                enrollmentPaymentType,
              })}
              onFormSubmitSuccess={(result) => {
                useEnrollmentsInfo.close();
                useEnrollmentsTable.reload();
              }}
              title="Tạo đăng ký"
              trigger={<Button label="Tạo mới" variant="filled" />}
            />
          </Space>
        }
      >
        <EnrollmentsTable
          tableHook={useEnrollmentsTable}
          columns={EnrollmentsColumns({
            enrollmentType,
            enrollmentPaymentType,
          })}
          leftColumns={[
            {
              width: 56,
              align: "center",
              search: false,
              render: (_, record) => (
                <Button
                  icon={<InfoCircleOutlined />}
                  variant="link"
                  onClick={() => {
                    useEnrollmentsInfo.setDataSource(record);
                    useEnrollmentsInfo.open();
                  }}
                />
              ),
            },
          ]}
          rightColumns={[
            {
              width: 56,
              align: "center",
              search: false,
              render: (_, record) => (
                <Button
                  icon={<EditOutlined />}
                  variant="link"
                  onClick={() => {
                    useEnrollmentsForm.setId(record?.id);
                    useEnrollmentsForm.open();
                  }}
                />
              ),
              responsive: ["md"],
            },
          ]}
        />
        <EnrollmentsInfo
          infoHook={useEnrollmentsInfo}
          columns={EnrollmentsColumns({
            enrollmentType,
            enrollmentPaymentType,
          })}
          dataSource={useEnrollmentsInfo.dataSource}
          drawerProps={{
            title: "Thông tin đăng ký",
            extra: [
              <Button
                key="enrollments-form-edit"
                label="Sửa"
                variant="filled"
                onClick={() => {
                  useEnrollmentsInfo.close();
                  useEnrollmentsForm.setId(useEnrollmentsInfo?.dataSource?.id);
                  useEnrollmentsForm.open();
                }}
              />,
            ],
          }}
        />
        <EnrollmentsFormEdit
          formHook={useEnrollmentsForm}
          fields={EnrollmentsFields({ enrollmentType, enrollmentPaymentType })}
          onFormRequestParams={{ id: useEnrollmentsForm.id }}
          onFormSubmitSuccess={() => useEnrollmentsTable.reload()}
          onFormDeleteParams={{ id: useEnrollmentsForm.id }}
          onFormDeleteSuccess={() => {
            useEnrollmentsForm.close();
            useEnrollmentsTable.reload();
          }}
          title="Sửa đăng ký"
        />
      </ProCard>
    ),
  };

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
      tabList={[enrollmentsTab]}
    />
  );
}
