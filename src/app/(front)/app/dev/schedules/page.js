// SCHEDULES LIST PAGE

"use client";

import { Space } from "antd";
import {
  CodeOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, DetailButton } from "@/component/common";
import {
  SchedulesTable,
  SchedulesInfo,
  SchedulesFormCreate,
  SchedulesFormEdit,
  SchedulesColumns,
  SchedulesFields,
  SchedulesCalendar,
  ScheduleClassesTable,
  ScheduleClassesColumns,
} from "@/component/custom";
import {
  useTable,
  useInfo,
  useNav,
  useCalendar,
  useForm,
} from "@/component/hook";
import { PageProvider, usePageContext } from "./provider";

export default function Page(props) {
  return (
    <PageProvider>
      <PageContent {...props} />
    </PageProvider>
  );
}

function PageContent() {
  const { scheduleStatus, shiftSelection, roomSelection } = usePageContext();
  const useSchedulesInfo = useInfo();
  const useSchedulesCalendar = useCalendar();
  const useScheduleFormCreate = useForm();
  const useScheduleFormEdit = useForm();
  const useScheduleClassesTable = useTable();

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
          useSchedulesInfo.setParams({ id: clickInfo.event.id });
          useSchedulesInfo.open();
        }}
      />
      <SchedulesInfo
        infoHook={useSchedulesInfo}
        columns={SchedulesColumns({
          scheduleStatus,
          shiftSelection,
          roomSelection,
        })}
        onDescRequestParams={useSchedulesInfo.params}
        dataSource={useSchedulesInfo.dataSource}
        drawerProps={{
          title: "Thông tin lịch học",
          extra: [
            <DetailButton
              key="detail-button"
              label="Chi tiết"
              variant="filled"
              id={useSchedulesInfo?.params?.id}
            />,
          ],
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
        onFormRequestParams={{ id: "" }}
        onFormSubmitSuccess={reloadData}
        title="Sửa lịch học"
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
          rightColumns={[
            {
              width: 56,
              align: "center",
              search: false,
              render: (_, record) => (
                <Button
                  icon={<PlusOutlined />}
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

                    console.log(
                      "Creating schedule for class:",
                      record.id,
                      record.course_name,
                      record.module_name
                    );
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
