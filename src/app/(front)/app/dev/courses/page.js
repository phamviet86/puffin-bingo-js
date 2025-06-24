// COURSES LIST PAGE

"use client";

import { InfoCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, DetailButton } from "@/component/common";
import {
  CoursesTable,
  CoursesInfo,
  CoursesFormCreate,
  CoursesColumns,
  CoursesFields,
} from "@/component/custom";
import { useTable, useInfo, useNav } from "@/component/hook";
import { PageProvider, usePageContext } from "./provider";

export default function Page(props) {
  return (
    <PageProvider>
      <PageContent {...props} />
    </PageProvider>
  );
}

function PageContent() {
  const { navDetail } = useNav();
  const {} = usePageContext();

  // page content: courses
  const useCoursesTable = useTable();
  const useCoursesInfo = useInfo();

  const pageButton = [
    <Button
      key="refresh-button"
      label="Tải lại"
      color="default"
      variant="filled"
      onClick={() => useCoursesTable.reload()}
    />,
    <CoursesFormCreate
      key="create-form"
      fields={CoursesFields({})}
      onFormSubmitSuccess={(result) => {
        useCoursesInfo.close();
        navDetail(result?.data[0]?.id);
      }}
      title="Tạo khóa học"
      trigger={<Button label="Tạo mới" />}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <CoursesTable
        tableHook={useCoursesTable}
        columns={CoursesColumns({})}
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
                  useCoursesInfo.setDataSource(record);
                  useCoursesInfo.open();
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
              <DetailButton
                icon={<EyeOutlined />}
                variant="link"
                id={record?.id}
              />
            ),
            responsive: ["md"],
          },
        ]}
      />
      <CoursesInfo
        infoHook={useCoursesInfo}
        columns={CoursesColumns({})}
        dataSource={useCoursesInfo.dataSource}
        drawerProps={{
          title: "Thông tin khóa học",
          extra: [
            <DetailButton
              key="detail-button"
              label="Chi tiết"
              variant="filled"
              id={useCoursesInfo?.dataSource?.id}
            />,
          ],
        }}
      />
    </ProCard>
  );

  return (
    <PageContainer
      items={[{ title: "Hệ thống" }, { title: "Khóa học" }]}
      title="Quản lý khóa học"
      extra={pageButton}
      content={pageContent}
    />
  );
}
