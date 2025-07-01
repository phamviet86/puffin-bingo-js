// SCHEDULES LIST PAGE

"use client";

import { useState } from "react";
import { Space } from "antd";
import { CodeOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button } from "@/component/common";
import {
  SchedulesFormCreate,
  SchedulesFormEdit,
  SchedulesFields,
  SchedulesCalendar,
  SchedulesTransfer,
  ScheduleClassesTable,
  ScheduleClassesColumns,
} from "@/component/custom";
import { useTable, useCalendar, useForm, useTransfer } from "@/component/hook";
import { PageProvider, usePageContext } from "./provider";
import { convertIsoDate } from "@/lib/util/convert-util";

export default function Page(props) {
  return (
    <PageProvider>
      <PageContent {...props} />
    </PageProvider>
  );
}

function PageContent() {
  const { scheduleStatus, shiftSelection, roomSelection } = usePageContext();
  const useSchedulesCalendar = useCalendar();
  const useScheduleFormCreate = useForm();
  const useScheduleFormEdit = useForm();
  const useScheduleClassesTable = useTable();
  const useSchedulesTransfer = useTransfer();

  const [transferDateRange, setTransferDateRange] = useState({});

  const reloadData = () => {
    useSchedulesCalendar.reload();
    useScheduleClassesTable.reload();
  };

  const pageButton = [
    <Button
      key="reload-button"
      label="Tải lại"
      color="default"
      variant="filled"
      onClick={reloadData}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <SchedulesCalendar
        calendarHook={useSchedulesCalendar}
        onCalendarRequestParams={{
          schedule_date_gte: useSchedulesCalendar.startDate,
          schedule_date_lt: useSchedulesCalendar.endDate,
        }}
        eventClick={(clickInfo) => {
          useScheduleFormEdit.setParams({ id: clickInfo.event.id });
          useScheduleFormEdit.open();
        }}
        navLinkWeekClick={(startDate) => {
          setTransferDateRange({
            date1: convertIsoDate(startDate),
            date2: convertIsoDate(startDate, 7),
            date3: convertIsoDate(startDate, 14),
          });
          useSchedulesTransfer.open();
        }}
      />
      <SchedulesFormCreate
        formHook={useScheduleFormCreate}
        fields={SchedulesFields({
          scheduleStatus,
          shiftSelection,
          roomSelection,
        })}
        initialValues={useScheduleFormCreate.initialValues}
        onFormSubmitSuccess={reloadData}
        title="Tạo lịch học"
      />
      <SchedulesFormEdit
        formHook={useScheduleFormEdit}
        fields={SchedulesFields({
          scheduleStatus,
          shiftSelection,
          roomSelection,
        })}
        onFormRequestParams={useScheduleFormEdit.params}
        onFormSubmitSuccess={reloadData}
        title="Sửa lịch học"
      />
      <SchedulesTransfer
        transferHook={useSchedulesTransfer}
        onSourceParams={{
          schedule_date_gte: transferDateRange.date1,
          schedule_date_lt: transferDateRange.date2,
        }}
        onTargetParams={{
          schedule_date_gte: transferDateRange.date2,
          schedule_date_lt: transferDateRange.date3,
        }}
        onTransferClose={reloadData}
      />
    </ProCard>
  );

  const schedulesTab = {
    key: "schedules",
    label: "Danh sách lớp",
    children: (
      <ProCard boxShadow>
        <ScheduleClassesTable
          tableHook={useScheduleClassesTable}
          dateRange={{
            startDate: useSchedulesCalendar.startDate,
            endDate: useSchedulesCalendar.endDate,
          }}
          columns={ScheduleClassesColumns()}
          leftColumns={[
            {
              width: 56,
              align: "center",
              search: false,
              render: (_, record) => (
                <Button
                  icon={<PlusSquareOutlined />}
                  variant="link"
                  onClick={() => {
                    useScheduleFormCreate.setTitle("Thêm lịch học");
                    useScheduleFormCreate.setInitialValues({
                      class_id: record.id,
                      course_name: record.course_name,
                      module_name: record.module_name,
                      schedule_status_id: 23,
                    });
                    useScheduleFormCreate.open();
                  }}
                />
              ),
            },
          ]}
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
              <CodeOutlined style={{ color: "#fa541c" }} />
              <span>Development</span>
            </Space>
          ),
          path: "/app/dev",
        },
        { title: "Lịch học" },
      ]}
      title="Quản lý lịch học"
      extra={pageButton}
      content={pageContent}
      tabList={[schedulesTab]}
    />
  );
}
