// ROOM DETAILS PAGE

"use client";

import { use } from "react";
import { EditOutlined } from "@ant-design/icons";
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
  const { navBack } = useNav();
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
      id={roomId}
      onFormSubmitSuccess={() => useRoomsDesc.reload()}
      onFormDeleteSuccess={() => {
        useRoomsForm.close();
        navBack();
      }}
      key="edit-form"
      title="Sửa phòng học"
      trigger={<Button label="Sửa" icon={<EditOutlined />} />}
    />,
  ];

  const pageContent = (
    <ProCard bordered>
      <RoomsDesc
        descHook={useRoomsDesc}
        columns={RoomsColumns({ roomStatus })}
        params={{ id: roomId }}
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
        { title: "Hệ thống" },
        { title: "Phòng học", path: "/app/dev/rooms" },
        { title: pageTitle },
      ]}
      title={pageTitle}
      extra={pageButton}
      content={pageContent}
    />
  );
}
