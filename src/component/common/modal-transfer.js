// path: @/component/common/modal-transfer.js

import { useCallback } from "react";
import { message, Drawer } from "antd";
import { ProDescriptions } from "@ant-design/pro-components";
import { INFO_CONFIG, DRAWER_CONFIG } from "@/component/config";

export function ModalTransfer({
  infoRequest = undefined,
  infoRequestError = undefined,
  infoRequestSuccess = undefined,
  infoHook = {},
  drawerProps = {},
  ...props
}) {
  const { infoRef, visible, close } = infoHook;
  const [messageApi, contextHolder] = message.useMessage();

  // Handlers
  const handleDataRequest = useCallback(
    async (params) => {
      if (!infoRequest) {
        messageApi.error("Data request handler not provided");
        return false;
      }

      try {
        const result = await infoRequest(params);
        // result: { success, message, data: array }
        infoRequestSuccess?.(result);
        return { success: true, data: result?.data?.[0] || {} };
      } catch (error) {
        messageApi.error(error?.message || "Đã xảy ra lỗi");
        infoRequestError?.(error);
        return false;
      }
    },
    [infoRequest, infoRequestSuccess, infoRequestError, messageApi]
  );

  // Render the component
  return (
    <>
      {contextHolder}
      <Drawer
        {...drawerProps}
        {...DRAWER_CONFIG}
        open={visible}
        onClose={close}
      >
        <ProDescriptions
          {...props}
          {...INFO_CONFIG}
          actionRef={infoRef}
          request={infoRequest ? handleDataRequest : undefined}
        />
      </Drawer>
    </>
  );
}
