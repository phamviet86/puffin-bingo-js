// USER_ROLES TAB PAGE

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
  UserRolesTable,
  UserRolesInfo,
  UserRolesFormCreate,
  UserRolesFormEdit,
  UserRolesColumns,
  UserRolesFields,
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
  // tab content: user-roles
  const useUserRolesTable = useTable();
  const useUserRolesInfo = useInfo();
  const useUserRolesForm = useForm();

  const userRolesTab = {
    key: "user-roles",
    label: "Phân quyền",
    children: (
      <ProCard
        boxShadow
        title="Danh sách phân quyền"
        extra={
          <Space>
            <Button
              icon={<SyncOutlined />}
              label="Tải lại"
              color="default"
              variant="filled"
              onClick={() => useUserRolesTable.reload()}
            />
            <UserRolesFormCreate
              fields={UserRolesFields()}
              onFormSubmitSuccess={(result) => {
                useUserRolesInfo.close();
                useUserRolesTable.reload();
              }}
              title="Tạo phân quyền"
              trigger={<Button icon={<PlusOutlined />} label="Tạo mới" />}
            />
          </Space>
        }
      >
        <UserRolesTable
          tableHook={useUserRolesTable}
          columns={UserRolesColumns()}
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
                    useUserRolesInfo.setDataSource(record);
                    useUserRolesInfo.open();
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
                    useUserRolesForm.setId(record?.id);
                    useUserRolesForm.open();
                  }}
                />
              ),
              responsive: ["md"],
            },
          ]}
        />
        <UserRolesInfo
          infoHook={useUserRolesInfo}
          columns={UserRolesColumns()}
          dataSource={useUserRolesInfo.dataSource}
          drawerProps={{
            title: "Thông tin phân quyền",
            extra: [
              <Button
                key="user-roles-form-edit"
                label="Sửa"
                variant="filled"
                onClick={() => {
                  useUserRolesInfo.close();
                  useUserRolesForm.setId(useUserRolesInfo?.dataSource?.id);
                  useUserRolesForm.open();
                }}
              />,
            ],
          }}
        />
        <UserRolesFormEdit
          formHook={useUserRolesForm}
          fields={UserRolesFields()}
          id={useUserRolesForm.id}
          onFormSubmitSuccess={() => useUserRolesTable.reload()}
          onFormDeleteSuccess={() => {
            useUserRolesForm.close();
            useUserRolesTable.reload();
          }}
          title="Sửa phân quyền"
        />
      </ProCard>
    ),
  };

  return (
    <PageContainer
      items={[{ title: "Hệ thống" }, { title: "Phân quyền" }]}
      title="Quản lý phân quyền"
      tabList={[userRolesTab]}
    />
  );
}
