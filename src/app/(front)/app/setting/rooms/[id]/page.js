// ROOM DETAILS PAGE

"use client";

import { use } from "react";
import { Space } from "antd";
import { ToolOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, BackButton } from "@/component/common";
import {
  RoomsDesc,
  RoomsFormEdit,
  RoomsColumns,
  RoomsFields,
} from "@/component/custom";
import { useDesc, useForm, useNav } from "@/component/hook";
import { PageProvider, usePageContext } from "../provider";

export default function Page(props) {
  return (
    <PageProvider>
      <PageContent {...props} />
    </PageProvider>
  );
}

function PageContent({ params }) {
  // const { navBack } = useNav(); // enable this if you want to navigate back after delete
  const { roomStatus } = usePageContext();
  const { id: roomId } = use(params);

  // page content: rooms
  const useRoomsDesc = useDesc();
  const useRoomsForm = useForm();

  const pageButton = [
    <BackButton key="back-button" />,
    <RoomsFormEdit
      formHook={useRoomsForm}
      fields={RoomsFields({ roomStatus })}
      onFormRequestParams={{ id: roomId }}
      onFormSubmitSuccess={() => useRoomsDesc.reload()}
      /* onFormDeleteParams={{ id: roomId }}
      onFormDeleteSuccess={() => {
        useRoomsForm.close();
        navBack();
      }} */
      key="edit-form"
      title="Sửa phòng học"
      trigger={<Button label="Sửa" />}
    />,
  ];

  const pageContent = (
    <ProCard bordered>
      <RoomsDesc
        descHook={useRoomsDesc}
        columns={RoomsColumns({ roomStatus })}
        onDescRequestParams={{ id: roomId }}
        onDescRequestSuccess={(result) =>
          useRoomsDesc.setDataSource(result?.data?.[0])
        }
      />
    </ProCard>
  );

  const pageTitle = useRoomsDesc?.dataSource?.room_name || "Chi tiết";
  document.title = `Phòng học - ${pageTitle}`;

  return (
    <PageContainer
      items={[
        {
          title: (
            <Space>
              <ToolOutlined />
              <span>Thiết lập</span>
            </Space>
          ),
        },
        { title: "Phòng học", path: "/app/setting/rooms" },
        { title: pageTitle },
      ]}
      title={pageTitle}
      extra={pageButton}
      content={pageContent}
    />
  );
}
