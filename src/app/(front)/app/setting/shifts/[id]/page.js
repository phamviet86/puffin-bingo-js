// SHIFT DETAILS PAGE

"use client";

import { use } from "react";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, BackButton } from "@/component/common";
import {
  ShiftsDesc,
  ShiftsFormEdit,
  ShiftsColumns,
  ShiftsFields,
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
  const { shiftStatus } = usePageContext();
  const { id: shiftId } = use(params);

  // page content: shifts
  const useShiftsDesc = useDesc();
  const useShiftsForm = useForm();

  const pageButton = [
    <BackButton key="back-button" />,
    <ShiftsFormEdit
      formHook={useShiftsForm}
      fields={ShiftsFields({ shiftStatus })}
      onFormRequestParams={{ id: shiftId }}
      onFormSubmitSuccess={() => useShiftsDesc.reload()}
      onFormDeleteParams={{ id: shiftId }}
      onFormDeleteSuccess={() => {
        useShiftsForm.close();
        navBack();
      }}
      key="edit-form"
      title="Sửa ca học"
      trigger={<Button label="Sửa" />}
    />,
  ];

  const pageContent = (
    <ProCard bordered>
      <ShiftsDesc
        descHook={useShiftsDesc}
        columns={ShiftsColumns({ shiftStatus })}
        onDescRequestParams={{ id: shiftId }}
        onDescRequestSuccess={(result) =>
          useShiftsDesc.setDataSource(result?.data?.[0])
        }
      />
    </ProCard>
  );

  const pageTitle = useShiftsDesc?.dataSource?.shift_name || "Chi tiết";
  document.title = `Ca học - ${pageTitle}`;

  return (
    <PageContainer
      items={[
        { title: "Thiết lập" },
        { title: "Ca học", path: "/app/setting/shifts" },
        { title: pageTitle },
      ]}
      title={pageTitle}
      extra={pageButton}
      content={pageContent}
    />
  );
}
