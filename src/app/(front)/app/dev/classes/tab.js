// CLASSES TAB PAGE

"use client";

import { InfoCircleOutlined, EditOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { Space } from "antd";
import { PageContainer, Button } from "@/component/common";
import {
  ClassesTable,
  ClassesInfo,
  ClassesFormCreate,
  ClassesFormEdit,
  ClassesColumns,
  ClassesFields,
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
  // Lấy context nếu cần (ví dụ: danh sách courses, modules)
  const pageContext = usePageContext();

  // tab content: classes
  const useClassesTable = useTable();
  const useClassesInfo = useInfo();
  const useClassesForm = useForm();

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
            <ClassesFormCreate
              fields={ClassesFields(pageContext)}
              onFormSubmitSuccess={() => {
                useClassesInfo.close();
                useClassesTable.reload();
              }}
              title="Tạo lớp học"
              trigger={<Button label="Tạo mới" />}
            />
          </Space>
        }
      >
        <ClassesTable
          tableHook={useClassesTable}
          columns={ClassesColumns(pageContext)}
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
                    useClassesInfo.setDataSource(record);
                    useClassesInfo.open();
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
          columns={ClassesColumns(pageContext)}
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
          fields={ClassesFields(pageContext)}
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
      </ProCard>
    ),
  };

  return (
    <PageContainer
      items={[{ title: "Đào tạo" }, { title: "Lớp học" }]}
      title="Quản lý lớp học"
      tabList={[classesTab]}
    />
  );
}
