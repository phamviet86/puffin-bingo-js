// path: @/component/common/drawer-form.js

import { useCallback } from "react";
import { message, Popconfirm } from "antd";
import { DrawerForm as AntDrawerForm } from "@ant-design/pro-components";
import { Button } from "@/component/common";
import { FORM_CONFIG, DRAWER_CONFIG } from "@/component/config";

export function DrawerForm({
  fields = null,
  formRequest = undefined,
  formRequestError = undefined,
  formRequestSuccess = undefined,
  formSubmit = undefined,
  formSubmitError = undefined,
  formSubmitSuccess = undefined,
  formDelete = undefined,
  formDeleteError = undefined,
  formDeleteSuccess = undefined,
  formHook = {},
  ...props
}) {
  const { formRef, visible, setVisible } = formHook;
  const [messageApi, contextHolder] = message.useMessage();

  // Handlers
  const handleDataRequest = useCallback(
    async (params) => {
      if (!formRequest) {
        messageApi.error("Data request handler not provided");
        return false;
      }

      try {
        const result = await formRequest(params);
        // result: { success, message, data: array }
        formRequestSuccess?.(result);
        return result.data[0] || {};
      } catch (error) {
        messageApi.error(error.message || "Đã xảy ra lỗi");
        formRequestError?.(error);
        return false;
      }
    },
    [formRequest, formRequestSuccess, formRequestError, messageApi]
  );

  const handleDataSubmit = useCallback(
    async (values) => {
      if (!formSubmit) {
        messageApi.error("Data submit handler not provided");
        return false;
      }
      if (!values) return false;

      try {
        const result = await formSubmit(values);
        // result: { success, message, data: array }
        messageApi.success(result.message);
        formSubmitSuccess?.(result);
        return true;
      } catch (error) {
        messageApi.error(error.message || "Đã xảy ra lỗi");
        formSubmitError?.(error);
        return false;
      }
    },
    [formSubmit, formSubmitSuccess, formSubmitError, messageApi]
  );

  const handleDataDelete = useCallback(async () => {
    if (!formDelete) {
      messageApi.error("Data delete handler not provided");
      return false;
    }

    try {
      const result = await formDelete();
      // result: { success, message, data: array }
      messageApi.success(result.message);
      formDeleteSuccess?.(result);
      return true;
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
      formDeleteError?.(error);
      return false;
    }
  }, [formDelete, formDeleteSuccess, formDeleteError, messageApi]);

  // Render component
  return (
    <>
      {contextHolder}
      <AntDrawerForm
        {...props}
        {...FORM_CONFIG}
        formRef={formRef}
        request={formRequest ? handleDataRequest : undefined}
        onFinish={formSubmit ? handleDataSubmit : undefined}
        open={visible}
        onOpenChange={setVisible}
        drawerProps={DRAWER_CONFIG}
        submitter={{
          render: (_, defaultDoms) => {
            return [
              formDelete ? (
                <Popconfirm
                  title="Xác nhận xóa?"
                  description="Bạn có chắc chắn muốn xóa?"
                  onConfirm={handleDataDelete}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button key="delete-button" color="danger" variant="solid">
                    Xoá
                  </Button>
                </Popconfirm>
              ) : (
                []
              ),
              ...defaultDoms,
            ];
          },
        }}
      >
        {fields}
      </AntDrawerForm>
    </>
  );
}
