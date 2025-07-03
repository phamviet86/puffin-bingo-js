// CLASSES DETAIL PAGE

"use client";

import { use, useState } from "react";
import { Space, Dropdown } from "antd";
import {
  BankOutlined,
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
  const { id: classId } = use(params);
  const { enrollmentType, enrollmentPaymentType } = usePageContext();

  // Hooks: Classes
  const useClassesDesc = useDesc();
  const useClassesForm = useForm();

  // Hooks: Enrollments
  const useEnrollments = {
    table: useTable(),
    info: useInfo(),
    form: useForm(),
    transfer: useTransfer(),
  };

  const [enrollmentTypeId, setEnrollmentTypeId] = useState(20);
  const [roleParams, setRoleParams] = useState({});

  const enrollmentColumns = EnrollmentsColumns({
    enrollmentType,
    enrollmentPaymentType,
  });

  const pageTitle =
    useClassesDesc?.dataSource?.course_name &&
    useClassesDesc?.dataSource?.module_name
      ? `${useClassesDesc.dataSource.course_name} - ${useClassesDesc.dataSource.module_name}`
      : "Chi tiết";
  document.title = `Lớp ${pageTitle}`;

  const enrollmentDropdownItems = [
    {
      key: "add-teaching-assistant",
      label: "Thêm trợ giảng",
      onClick: () => {
        setEnrollmentTypeId(19);
        setRoleParams({ role_names_like: "Trợ giảng" });
        useEnrollments.transfer.setTitle("Thêm trợ giảng");
        useEnrollments.transfer.open();
      },
    },
    {
      key: "add-student",
      label: "Thêm học viên",
      onClick: () => {
        setEnrollmentTypeId(20);
        setRoleParams({});
        useEnrollments.transfer.setTitle("Thêm học viên");
        useEnrollments.transfer.open();
      },
    },
  ];

  const pageButton = [
    <BackButton key="back-button" />,
    <ClassesFormEdit
      key="edit-form"
      title="Sửa lớp học"
      trigger={<Button label="Sửa" />}
      formHook={useClassesForm}
      fields={ClassesFields()}
      onFormRequestParams={{ id: classId }}
      onFormSubmitSuccess={() => useClassesDesc.reload()}
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
              onClick={() => useEnrollments.table.reload()}
            />
            <Dropdown.Button
              type="primary"
              menu={{ items: enrollmentDropdownItems }}
              onClick={() => {
                setEnrollmentTypeId(18);
                setRoleParams({ role_names_like: "Giáo viên" });
                useEnrollments.transfer.setTitle("Thêm giáo viên");
                useEnrollments.transfer.open();
              }}
            >
              Thêm giáo viên
            </Dropdown.Button>
          </Space>
        }
      >
        <EnrollmentsTable
          tableHook={useEnrollments.table}
          columns={enrollmentColumns}
          onTableRequestParams={{ class_id: classId }}
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
                    useEnrollments.info.setDataSource(record);
                    useEnrollments.info.open();
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
                    useEnrollments.form.setParams({ id: record?.id });
                    useEnrollments.form.open();
                  }}
                />
              ),
              responsive: ["md"],
            },
          ]}
        />
        <EnrollmentsInfo
          infoHook={useEnrollments.info}
          columns={enrollmentColumns}
          dataSource={useEnrollments.info.dataSource}
          drawerProps={{
            title: "Thông tin đăng ký",
            extra: [
              <Button
                key="enrollments-form-edit"
                label="Sửa"
                variant="filled"
                onClick={() => {
                  useEnrollments.info.close();
                  useEnrollments.form.setParams({
                    id: useEnrollments.info?.dataSource?.id,
                  });
                  useEnrollments.form.open();
                }}
              />,
            ],
          }}
        />
        <EnrollmentsFormEdit
          formHook={useEnrollments.form}
          fields={EnrollmentsFields({ enrollmentType, enrollmentPaymentType })}
          onFormRequestParams={useEnrollments.form.params}
          onFormSubmitSuccess={() => useEnrollments.table.reload()}
          title="Sửa đăng ký"
        />
        <EnrollmentsTransferByClass
          classId={classId}
          enrollmentTypeId={enrollmentTypeId}
          enrollmentPaymentAmount={useClassesDesc?.dataSource?.class_fee || 0}
          transferHook={useEnrollments.transfer}
          onTransferClose={() => useEnrollments.table.reload()}
          onSourceParams={{ user_status_id_e: 14, ...roleParams }}
          onTargetParams={{
            class_id: classId,
            enrollment_type_id: enrollmentTypeId,
          }}
          modalProps={{ title: useEnrollments.transfer.title || "Thêm" }}
        />
      </ProCard>
    ),
  };

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
        { title: "Lớp học", path: "/app/manager/classes" },
        { title: pageTitle },
      ]}
      title={pageTitle}
      extra={pageButton}
      content={pageContent}
      tabList={[enrollmentsTab]}
    />
  );
}