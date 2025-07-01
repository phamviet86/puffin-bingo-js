// SCHEDULES TAB PAGE

"use client";

import { InfoCircleOutlined, EditOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { Space } from "antd";
import { PageContainer, Button } from "@/component/common";
import {
  SchedulesTable,
  SchedulesInfo,
  SchedulesFormCreate,
  SchedulesFormEdit,
  SchedulesColumns,
  SchedulesFields,
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
  const {
    scheduleStatus,
    classSelection,
    shiftSelection,
    lectureSelection,
    roomSelection,
  } = usePageContext();

  const useSchedulesTable = useTable();
  const useSchedulesInfo = useInfo();
  const useSchedulesForm = useForm();

  const schedulesTab = {
    key: "schedules",
    label: "Lịch học",
    children: (
      <ProCard
        boxShadow
        title="Danh sách lịch học"
        extra={
          <Space>
            <Button
              label="Tải lại"
              color="default"
              variant="filled"
              onClick={() => useSchedulesTable.reload()}
            />
            <SchedulesFormCreate
              fields={SchedulesFields({
                scheduleStatus,
                classSelection,
                shiftSelection,
                lectureSelection,
                roomSelection,
              })}
              onFormSubmitSuccess={() => {
                useSchedulesInfo.close();
                useSchedulesTable.reload();
              }}
              title="Tạo lịch học"
              trigger={<Button label="Tạo mới" variant="filled" />}
            />
          </Space>
        }
      >
        <SchedulesTable
          tableHook={useSchedulesTable}
          columns={SchedulesColumns({
            scheduleStatus,
            classSelection,
            shiftSelection,
            lectureSelection,
            roomSelection,
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
                    useSchedulesInfo.setDataSource(record);
                    useSchedulesInfo.open();
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
                    useSchedulesForm.setParams({ id: record?.id });
                    useSchedulesForm.open();
                  }}
                />
              ),
              responsive: ["md"],
            },
          ]}
        />
        <SchedulesInfo
          infoHook={useSchedulesInfo}
          columns={SchedulesColumns({
            scheduleStatus,
            classSelection,
            shiftSelection,
            lectureSelection,
            roomSelection,
          })}
          dataSource={useSchedulesInfo.dataSource}
          drawerProps={{
            title: "Thông tin lịch học",
            extra: [
              <Button
                key="schedules-form-edit"
                label="Sửa"
                variant="filled"
                onClick={() => {
                  useSchedulesInfo.close();
                  useSchedulesForm.setId(useSchedulesInfo?.dataSource?.id);
                  useSchedulesForm.open();
                }}
              />,
            ],
          }}
        />
        <SchedulesFormEdit
          formHook={useSchedulesForm}
          fields={SchedulesFields({
            scheduleStatus,
            classSelection,
            shiftSelection,
            lectureSelection,
            roomSelection,
          })}
          onFormRequestParams={{ id: useSchedulesForm.id }}
          onFormSubmitSuccess={() => useSchedulesTable.reload()}
          /*
          onFormDeleteParams={{ id: useSchedulesForm.id }}
          onFormDeleteSuccess={() => {
            useSchedulesForm.close();
            useSchedulesTable.reload();
          }}
          */
          title="Sửa lịch học"
        />
      </ProCard>
    ),
  };

  return (
    <PageContainer
      items={[{ title: "Đào tạo" }, { title: "Lịch học" }]}
      title="Quản lý lịch học"
      tabList={[schedulesTab]}
    />
  );
}
