// LECTURES TAB PAGE

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
  LecturesTable,
  LecturesInfo,
  LecturesFormCreate,
  LecturesFormEdit,
  LecturesColumns,
  LecturesFields,
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
  const { modules, lectureStatus } = usePageContext();

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
              icon={<SyncOutlined />}
              label="Tải lại"
              color="default"
              variant="filled"
              onClick={() => useLecturesTable.reload()}
            />
            <LecturesFormCreate
              fields={LecturesFields({ modules, lectureStatus })}
              onFormSubmitSuccess={(result) => {
                useLecturesInfo.close();
                useLecturesTable.reload();
              }}
              title="Tạo bài giảng"
              trigger={<Button icon={<PlusOutlined />} label="Tạo mới" />}
            />
          </Space>
        }
      >
        <LecturesTable
          tableHook={useLecturesTable}
          columns={LecturesColumns({ modules, lectureStatus })}
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
                    useLecturesForm.setId(record?.id);
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
          columns={LecturesColumns({ modules, lectureStatus })}
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
                  useLecturesForm.setId(useLecturesInfo?.dataSource?.id);
                  useLecturesForm.open();
                }}
              />,
            ],
          }}
        />
        <LecturesFormEdit
          formHook={useLecturesForm}
          fields={LecturesFields({ modules, lectureStatus })}
          id={useLecturesForm.id}
          onFormSubmitSuccess={() => useLecturesTable.reload()}
          onFormDeleteSuccess={() => {
            useLecturesForm.close();
            useLecturesTable.reload();
          }}
          title="Sửa bài giảng"
        />
      </ProCard>
    ),
  };

  return (
    <PageContainer
      items={[{ title: "Hệ thống" }, { title: "Bài giảng" }]}
      title="Quản lý bài giảng"
      tabList={[lecturesTab]}
    />
  );
}
