// path: @/component/common/drawer-info.js

import { useCallback } from "react";
import { message, Drawer } from "antd";
import { ProDescriptions } from "@ant-design/pro-components";
import { DRAWER_CONFIG } from "@/component/config";

export function DrawerInfo({
  onInfoRequest = undefined,
  onInfoRequestError = undefined,
  onInfoRequestSuccess = undefined,
  column = 1,
  infoHook = {},
  drawerProps = {},
  ...props
}) {
  const { infoRef, visible, close } = infoHook;
  const [messageApi, contextHolder] = message.useMessage();

  // Handlers
  const handleDataRequest = useCallback(
    async (params) => {
      if (!onInfoRequest) {
        messageApi.error("Data request handler not provided");
        return false;
      }

      try {
        const result = await onInfoRequest(params);
        // result: { success, message, data: array }
        onInfoRequestSuccess?.(result);
        return { success: true, data: result?.data?.[0] || {} };
      } catch (error) {
        messageApi.error(error?.message || "Đã xảy ra lỗi");
        onInfoRequestError?.(error);
        return false;
      }
    },
    [onInfoRequest, onInfoRequestSuccess, onInfoRequestError, messageApi]
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
          actionRef={infoRef}
          request={onInfoRequest ? handleDataRequest : undefined}
          column={column}
        />
      </Drawer>
    </>
  );
}
