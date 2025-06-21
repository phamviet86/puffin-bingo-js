// path: @/component/common/pro-descriptions.js

import { useCallback } from "react";
import { message } from "antd";
import { ProDescriptions as AntProDescriptions } from "@ant-design/pro-components";

export function ProDescriptions({
  onDataRequest = undefined,
  onDataRequestError = undefined,
  onDataRequestSuccess = undefined,
  column = { xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 },
  descHook = {},
  ...props
}) {
  const { descRef } = descHook;
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
      <AntProDescriptions
        {...props}
        actionRef={descRef}
        request={onDataRequest ? handleDataRequest : undefined}
        column={column}
      />
    </>
  );
}
