// OPTIONS LIST PAGE

"use client";

import { InfoCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, DetailButton } from "@/component/common";
import {
  OptionsTable,
  OptionsInfo,
  OptionsFormCreate,
  OptionsColumns,
  OptionsFields,
} from "@/component/custom";
import { useTable, useInfo, useNav } from "@/component/hook";

export default function Page() {
  const { navDetail } = useNav();

  // page content: options
  const useOptionsTable = useTable();
  const useOptionsInfo = useInfo();

  const pageButton = [
    <Button
      key="refresh-button"
      label="Tải lại"
      color="default"
      variant="filled"
      onClick={() => useOptionsTable.reload()}
    />,
    <OptionsFormCreate
      key="create-form"
      fields={OptionsFields()}
      initialValues={{ option_color: "default" }}
      onFormSubmitSuccess={(result) => {
        useOptionsInfo.close();
        navDetail(result?.data[0]?.id);
      }}
      title="Tạo tùy chọn"
      trigger={<Button label="Tạo mới" />}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <OptionsTable
        tableHook={useOptionsTable}
        columns={OptionsColumns()}
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
                  useOptionsInfo.setDataSource(record);
                  useOptionsInfo.open();
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
      <OptionsInfo
        infoHook={useOptionsInfo}
        columns={OptionsColumns()}
        dataSource={useOptionsInfo.dataSource}
        drawerProps={{
          title: "Thông tin tùy chọn",
          extra: [
            <DetailButton
              key="detail-button"
              label="Chi tiết"
              variant="filled"
              id={useOptionsInfo?.dataSource?.id}
            />,
          ],
        }}
      />
    </ProCard>
  );

  return (
    <PageContainer
      items={[{ title: "Hệ thống" }, { title: "Tùy chọn" }]}
      title="Quản lý tùy chọn"
      extra={pageButton}
      content={pageContent}
    />
  );
}
