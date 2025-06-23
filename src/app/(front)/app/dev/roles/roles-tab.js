// ROLES TAB PAGE

"use client";

import {
  PlusOutlined,
  InfoCircleOutlined,
  SyncOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button } from "@/component/common";
import {
  RolesTable,
  RolesInfo,
  RolesFormCreate,
  RolesFormEdit,
  RolesColumns,
  RolesFields,
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
  const { roleStatus } = usePageContext();

  // tab content: roles
  const useRolesTable = useTable();
  const useRolesInfo = useInfo();
  const useRolesForm = useForm();

  const rolesTab = {
    key: "roles",
    label: "Vai trò",
    children: (
      <ProCard
        boxShadow
        title="Danh sách vai trò"
        extra={[
          <Button
            key="roles-table-reload"
            icon={<SyncOutlined />}
            label="Tải lại"
            color="default"
            variant="filled"
            onClick={() => useRolesTable.reload()}
          />,
          <RolesFormCreate
            key="roles-form-create"
            fields={RolesFields({ roleStatus })}
            onFormSubmitSuccess={(result) => {
              useRolesInfo.close();
              useRolesTable.reload();
            }}
            title="Tạo vai trò"
            trigger={<Button icon={<PlusOutlined />} label="Tạo mới" />}
          />,
        ]}
      >
        <RolesTable
          tableHook={useRolesTable}
          columns={RolesColumns({ roleStatus })}
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
                    useRolesInfo.setDataSource(record);
                    useRolesInfo.open();
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
                    useRolesForm.setId(record?.id);
                    useRolesForm.open();
                  }}
                />
              ),
              responsive: ["md"],
            },
          ]}
        />
        <RolesInfo
          infoHook={useRolesInfo}
          columns={RolesColumns({ roleStatus })}
          dataSource={useRolesInfo.dataSource}
          drawerProps={{
            title: "Thông tin vai trò",
            extra: [
              <Button
                key="roles-form-edit"
                label="Sửa"
                variant="filled"
                onClick={() => {
                  useRolesInfo.close();
                  useRolesForm.setId(useRolesInfo?.dataSource?.id);
                  useRolesForm.open();
                }}
              />,
            ],
          }}
        />
        <RolesFormEdit
          formHook={useRolesForm}
          fields={RolesFields({ roleStatus })}
          id={useRolesForm.id}
          onFormSubmitSuccess={() => useRolesTable.reload()}
          onFormDeleteSuccess={() => {
            useRolesForm.close();
            useRolesTable.reload();
          }}
          title="Sửa vai trò"
        />
      </ProCard>
    ),
  };

  return (
    <PageContainer
      items={[{ title: "Hệ thống" }, { title: "Vai trò" }]}
      title="Quản lý vai trò"
      tabList={[rolesTab]}
    />
  );
}
