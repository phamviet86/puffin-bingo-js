// path: @/component/common/drawer-info.js

import { useCallback } from "react";
import { message, Drawer } from "antd";
import { ProDescriptions } from "@ant-design/pro-components";
import { INFO_CONFIG, DRAWER_CONFIG } from "@/component/config";

export function DrawerInfo({
  onDataRequest = undefined,
  onDataRequestError = undefined,
  onDataRequestSuccess = undefined,
  infoHook = {},
  drawerProps = {},
  ...props
}) {
  const { infoRef, visible, close } = infoHook;
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
        return { success: true, data: result?.data?.[0] || {} };
      } catch (error) {
        messageApi.error(error?.message || "Đã xảy ra lỗi");
        onDataRequestError?.(error);
        return false;
      }
    },
    [onDataRequest, onDataRequestSuccess, onDataRequestError, messageApi]
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
          request={onDataRequest ? handleDataRequest : undefined}
        />
      </Drawer>
    </>
  );
}
