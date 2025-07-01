// SYLLABUS DETAILS PAGE

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
  LecturesTable,
  LecturesInfo,
  LecturesFormCreate,
  LecturesFormEdit,
  LecturesColumns,
  LecturesFields,
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
  // const { navBack } = useNav(); // enable this if you want to navigate back after delete
  const { syllabusStatus, moduleStatus, lectureStatus } = usePageContext();

  // page content: syllabuses
  const useSyllabusesDesc = useDesc();
  const useSyllabusesForm = useForm();

  const pageButton = [
    <BackButton key="back-button" />,
    <SyllabusesFormEdit
      formHook={useSyllabusesForm}
      fields={SyllabusesFields({ syllabusStatus })}
      onFormRequestParams={{ id: syllabusId }}
      onFormSubmitSuccess={() => useSyllabusesDesc.reload()}
      /* onFormDeleteParams={{ id: syllabusId }}
      onFormDeleteSuccess={() => {
        useSyllabusesForm.close();
        navBack();
      }} */
      key="edit-form"
      title="Sửa giáo trình"
      trigger={<Button label="Sửa" />}
    />,
  ];

  const pageContent = (
    <ProCard bordered>
      <SyllabusesDesc
        descHook={useSyllabusesDesc}
        columns={SyllabusesColumns({ syllabusStatus })}
        onDescRequestParams={{ id: syllabusId }}
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
              trigger={<Button label="Tạo mới" variant="filled" />}
            />
          </Space>
        }
      >
        <ModulesTable
          tableHook={useModulesTable}
          columns={ModulesColumns({ moduleStatus })}
          onTableRequestParams={{ syllabus_id: syllabusId }}
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
                    useModulesForm.setParams({ id: record?.id });
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
                  useModulesForm.setParams({
                    id: useModulesInfo?.dataSource?.id,
                  });
                  useModulesForm.open();
                }}
              />,
            ],
          }}
        />
        <ModulesFormEdit
          formHook={useModulesForm}
          fields={ModulesFields({ moduleStatus })}
          onFormRequestParams={useModulesForm.params}
          onFormSubmitSuccess={() => useModulesTable.reload()}
          /* onFormDeleteParams={{ id: useModulesForm.id }}
          onFormDeleteSuccess={() => {
            useModulesForm.close();
            useModulesTable.reload();
          }} */
          title="Sửa học phần"
        />
      </ProCard>
    ),
  };

  // tab content: lectures
  const useLecturesTable = useTable();
  const useLecturesInfo = useInfo();
  const useLecturesForm = useForm();

  const lecturesTab = {
    key: "lectures",
    label: "Bài giảng",
    children: (
      <ProCard
        boxShadow
        title="Danh sách bài giảng"
        extra={
          <Space>
            <Button
              label="Tải lại"
              color="default"
              variant="filled"
              onClick={() => useLecturesTable.reload()}
            />
            <LecturesFormCreate
              fields={LecturesFields({ syllabusId, lectureStatus })}
              onFormSubmitSuccess={(result) => {
                useLecturesInfo.close();
                useLecturesTable.reload();
              }}
              title="Tạo bài giảng"
              trigger={<Button label="Tạo mới" variant="filled" />}
            />
          </Space>
        }
      >
        <LecturesTable
          tableHook={useLecturesTable}
          columns={LecturesColumns({ syllabusId, lectureStatus })}
          onTableRequestParams={{ syllabus_id: syllabusId }}
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
                    useLecturesInfo.setDataSource(record);
                    useLecturesInfo.open();
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
                    useLecturesForm.setParams({ id: record?.id });
                    useLecturesForm.open();
                  }}
                />
              ),
              responsive: ["md"],
            },
          ]}
        />
        <LecturesInfo
          infoHook={useLecturesInfo}
          columns={LecturesColumns({ syllabusId, lectureStatus })}
          dataSource={useLecturesInfo.dataSource}
          drawerProps={{
            title: "Thông tin bài giảng",
            extra: [
              <Button
                key="lectures-form-edit"
                label="Sửa"
                variant="filled"
                onClick={() => {
                  useLecturesInfo.close();
                  useLecturesForm.setParams({
                    id: useLecturesInfo?.dataSource?.id,
                  });
                  useLecturesForm.open();
                }}
              />,
            ],
          }}
        />
        <LecturesFormEdit
          formHook={useLecturesForm}
          fields={LecturesFields({ syllabusId, lectureStatus })}
          onFormRequestParams={useLecturesForm.params}
          onFormSubmitSuccess={() => useLecturesTable.reload()}
          /* onFormDeleteParams={{ id: useLecturesForm.id }}
          onFormDeleteSuccess={() => {
            useLecturesForm.close();
            useLecturesTable.reload();
          }} */
          title="Sửa bài giảng"
        />
      </ProCard>
    ),
  };

  const pageTitle = useSyllabusesDesc?.dataSource?.syllabus_name || "Chi tiết";
  document.title = `Giáo trình - ${pageTitle}`;

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
        { title: "Giáo trình", path: "/app/manager/syllabuses" },
        { title: pageTitle },
      ]}
      title={pageTitle}
      extra={pageButton}
      content={pageContent}
      tabList={[modulesTab, lecturesTab]}
    />
  );
}
