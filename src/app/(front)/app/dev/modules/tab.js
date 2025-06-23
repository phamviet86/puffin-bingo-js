// MODULES TAB PAGE

"use client";

import {
  PlusOutlined,
  InfoCircleOutlined,
  SyncOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { Space } from "antd";
import { PageContainer, Button } from "@/component/common";
import {
  ModulesTable,
  ModulesInfo,
  ModulesFormCreate,
  ModulesFormEdit,
  ModulesColumns,
  ModulesFields,
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
  const { moduleStatus } = usePageContext();

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
              key="modules-table-reload"
              icon={<SyncOutlined />}
              label="Tải lại"
              color="default"
              variant="filled"
              onClick={() => useModulesTable.reload()}
            />
            <ModulesFormCreate
              key="modules-form-create"
              fields={ModulesFields({ moduleStatus })}
              onFormSubmitSuccess={(result) => {
                useModulesInfo.close();
                useModulesTable.reload();
              }}
              title="Tạo học phần"
              trigger={<Button icon={<PlusOutlined />} label="Tạo mới" />}
            />
          </Space>
        }
      >
        <ModulesTable
          tableHook={useModulesTable}
          columns={ModulesColumns({ moduleStatus })}
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

  return (
    <PageContainer
      items={[{ title: "Hệ thống" }, { title: "Học phần" }]}
      title="Quản lý học phần"
      tabList={[modulesTab]}
    />
  );
}
