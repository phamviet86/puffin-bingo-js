// ENROLLMENTS TAB PAGE

"use client";

import { InfoCircleOutlined, EditOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { Space } from "antd";
import { PageContainer, Button } from "@/component/common";
import {
  EnrollmentsTable,
  EnrollmentsInfo,
  EnrollmentsFormCreate,
  EnrollmentsFormEdit,
  EnrollmentsColumns,
  EnrollmentsFields,
} from "@/component/custom";
import { useTable, useInfo, useForm } from "@/component/hook";
import { PageProvider, usePageContext } from "./provider";

export default function Page(props) {
  return (
    <PageProvider>
      <PageContent {...props} />
    </PageProvider>
  );
}

function PageContent() {
  const { enrollmentType, enrollmentPaymentType } = usePageContext();

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

  return (
    <PageContainer
      items={[{ title: "Hệ thống" }, { title: "Đăng ký" }]}
      title="Quản lý đăng ký"
      tabList={[enrollmentsTab]}
    />
  );
}
