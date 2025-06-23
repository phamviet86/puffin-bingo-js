// SYLLABUS DETAILS PAGE

"use client";

import { use } from "react";
import {
  PlusOutlined,
  InfoCircleOutlined,
  SyncOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { Space } from "antd";
import { PageContainer, Button, BackButton } from "@/component/common";
import {
  SyllabusesDesc,
  SyllabusesFormEdit,
  SyllabusesColumns,
  SyllabusesFields,
  ModulesTable,
  ModulesInfo,
  ModulesFormCreate,
  ModulesFormEdit,
  ModulesColumns,
  ModulesFields,
} from "@/component/custom";
import { useDesc, useForm, useTable, useInfo, useNav } from "@/component/hook";
import { PageProvider, usePageContext } from "../provider";

export default function Page(props) {
  return (
    <PageProvider>
      <PageContent {...props} />
    </PageProvider>
  );
}

function PageContent({ params }) {
  const { id: syllabusId } = use(params);
  const { navBack } = useNav();
  const { syllabusStatus, moduleStatus } = usePageContext();

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

  // tab content: modules
  const useModulesTable = useTable();
  const useModulesInfo = useInfo();
  const useModulesForm = useForm();

  const modulesTab = {
    key: "modules",
    label: "Học phần",
    children: (
      <ProCard
        boxShadow
        title="Danh sách học phần"
        extra={
          <Space>
            <Button
              icon={<SyncOutlined />}
              label="Tải lại"
              color="default"
              variant="filled"
              onClick={() => useModulesTable.reload()}
            />
            <ModulesFormCreate
              fields={ModulesFields({ moduleStatus })}
              onFormSubmitSuccess={(result) => {
                useModulesInfo.close();
                useModulesTable.reload();
              }}
              initialValues={{ syllabus_id: syllabusId }}
              title="Tạo học phần"
              trigger={<Button icon={<PlusOutlined />} label="Tạo mới" />}
            />
          </Space>
        }
      >
        <ModulesTable
          tableHook={useModulesTable}
          columns={ModulesColumns({ moduleStatus })}
          params={{ syllabus_id: syllabusId }}
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
                    useModulesInfo.setDataSource(record);
                    useModulesInfo.open();
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
                    useModulesForm.setId(record?.id);
                    useModulesForm.open();
                  }}
                />
              ),
              responsive: ["md"],
            },
          ]}
        />
        <ModulesInfo
          infoHook={useModulesInfo}
          columns={ModulesColumns({ moduleStatus })}
          dataSource={useModulesInfo.dataSource}
          drawerProps={{
            title: "Thông tin học phần",
            extra: [
              <Button
                key="modules-form-edit"
                label="Sửa"
                variant="filled"
                onClick={() => {
                  useModulesInfo.close();
                  useModulesForm.setId(useModulesInfo?.dataSource?.id);
                  useModulesForm.open();
                }}
              />,
            ],
          }}
        />
        <ModulesFormEdit
          formHook={useModulesForm}
          fields={ModulesFields({ moduleStatus })}
          id={useModulesForm.id}
          onFormSubmitSuccess={() => useModulesTable.reload()}
          onFormDeleteSuccess={() => {
            useModulesForm.close();
            useModulesTable.reload();
          }}
          title="Sửa học phần"
        />
      </ProCard>
    ),
  };

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
      tabList={[modulesTab]}
    />
  );
}
