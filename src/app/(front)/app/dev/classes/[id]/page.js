// CLASSES DETAIL PAGE

"use client";

import { use, useState } from "react";
import { Space, Dropdown } from "antd";
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
  EnrollmentsFormEdit,
  EnrollmentsColumns,
  EnrollmentsFields,
  EnrollmentsTransferByClass,
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
  const useEnrollmentsTransfer = useTransfer();
  const [enrollmentTypeId, setEnrollmentTypeId] = useState(20);
  const [roleParams, setRoleParams] = useState({});

  const enrollmentsTab = {
    key: "enrollments",
    label: "Danh sách lớp",
    children: (
      <ProCard
        boxShadow
        title="Danh sách lớp"
        extra={
          <Space>
            <Button
              label="Tải lại"
              color="default"
              variant="filled"
              onClick={() => useEnrollmentsTable.reload()}
            />
            <Dropdown.Button
              onClick={() => {
                setEnrollmentTypeId(18);
                setRoleParams({ role_names_like: "Giáo viên" });
                useEnrollmentsTransfer.setTitle("Thêm giáo viên");
                useEnrollmentsTransfer.open();
              }}
              type="primary"
              menu={{
                items: [
                  {
                    key: "add-teaching-assistant",
                    label: "Thêm trợ giảng",
                    onClick: () => {
                      setEnrollmentTypeId(19);
                      setRoleParams({ role_names_like: "Trợ giảng" });
                      useEnrollmentsTransfer.setTitle("Thêm trợ giảng");
                      useEnrollmentsTransfer.open();
                    },
                  },
                  {
                    key: "add-student",
                    label: "Thêm học viên",
                    onClick: () => {
                      setEnrollmentTypeId(20);
                      setRoleParams({});
                      useEnrollmentsTransfer.setTitle("Thêm học viên");
                      useEnrollmentsTransfer.open();
                    },
                  },
                ],
              }}
            >
              Thêm giáo viên
            </Dropdown.Button>
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
        <EnrollmentsTransferByClass
          classId={classId}
          enrollmentTypeId={enrollmentTypeId}
          enrollmentPaymentAmount={useClassesDesc?.dataSource?.class_fee || 0}
          transferHook={useEnrollmentsTransfer}
          onTransferClose={() => useEnrollmentsTable.reload()}
          onSourceParams={{ user_status_id_e: 14, ...roleParams }}
          onTargetParams={{
            class_id: classId,
            enrollment_type_id: enrollmentTypeId,
          }}
          modalProps={{ title: useEnrollmentsTransfer.title || "Thêm" }}
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
