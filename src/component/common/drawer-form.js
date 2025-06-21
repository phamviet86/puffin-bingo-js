// path: @/component/common/drawer-form.js

import { useCallback } from "react";
import { message } from "antd";
import { DrawerForm as AntDrawerForm } from "@ant-design/pro-components";
import { FORM_CONFIG, DRAWER_CONFIG } from "@/component/config";

export function DrawerForm({
  fields = null,
  onDataRequest = undefined,
  onDataRequestError = undefined,
  onDataRequestSuccess = undefined,
  onDataSubmit = undefined,
  onDataSubmitError = undefined,
  onDataSubmitSuccess = undefined,
  formHook = {},
  ...props
}) {
  const { formRef, visible, setVisible } = formHook;
  const [messageApi, contextHolder] = message.useMessage();

  // Handlers
  const handleDataRequest = useCallback(
    async (params) => {
      if (!onDataRequest) {
        messageApi.error("Data request handler not provided");
        return false;
      }

      try {
        const result = await onDataRequest(params);
        // result: { success, message, data: array }
        onDataRequestSuccess?.(result);
        return result.data[0] || {};
      } catch (error) {
        messageApi.error(error.message || "Đã xảy ra lỗi");
        onDataRequestError?.(error);
        return false;
      }
    },
    [onDataRequest, onDataRequestSuccess, onDataRequestError, messageApi]
  );

  const handleDataSubmit = useCallback(
    async (values) => {
      if (!onDataSubmit) {
        messageApi.error("Data submit handler not provided");
        return false;
      }
      if (!values) return false;

      try {
        const result = await onDataSubmit(values);
        // result: { success, message, data: array }
        messageApi.success(result.message);
        onDataSubmitSuccess?.(result);
        return true;
      } catch (error) {
        messageApi.error(error.message || "Đã xảy ra lỗi");
        onDataSubmitError?.(error);
        return false;
      }
    },
    [onDataSubmit, onDataSubmitSuccess, onDataSubmitError, messageApi]
  );

  // Render component
  return (
    <>
      {contextHolder}
      <AntDrawerForm
        {...props}
        {...FORM_CONFIG}
        formRef={formRef}
        request={onDataRequest ? handleDataRequest : undefined}
        onFinish={onDataSubmit ? handleDataSubmit : undefined}
        open={visible}
        onOpenChange={setVisible}
        drawerProps={DRAWER_CONFIG}
      >
        {fields}
      </AntDrawerForm>
    </>
  );
}
