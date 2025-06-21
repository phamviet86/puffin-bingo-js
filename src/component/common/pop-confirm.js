// path: @/component/common/pop-confirm.js

import { useCallback } from "react";
import { Popconfirm as AntPopconfirm, message } from "antd";

export function Popconfirm({
  popConfirm = undefined,
  popConfirmError = undefined,
  popConfirmSuccess = undefined,
  popCancel = undefined,
  popCancelError = undefined,
  popCancelSuccess = undefined,
  showConfirmMessage = false,
  showCancelMessage = false,
  ...props
}) {
  const [messageApi, contextHolder] = message.useMessage();

  // Handlers
  const handleConfirm = useCallback(async () => {
    if (!popConfirm) {
      messageApi.error("Data confirm handler not provided");
      return false;
    }

    try {
      const result = await popConfirm();
      if (showConfirmMessage && result?.message) {
        messageApi.success(result.message);
      }
      popConfirmSuccess?.(result);
      return result || true;
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
      popConfirmError?.(error);
      return false;
    }
  }, [
    popConfirm,
    popConfirmSuccess,
    popConfirmError,
    showConfirmMessage,
    messageApi,
  ]);

  const handleCancel = useCallback(async () => {
    if (!popCancel) {
      messageApi.error("Data cancel handler not provided");
      return false;
    }

    try {
      const result = await popCancel();
      if (showCancelMessage && result?.message) {
        messageApi.warning(result.message);
      }
      popCancelSuccess?.(result);
      return result || false;
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
      popCancelError?.(error);
      return false;
    }
  }, [
    popCancel,
    popCancelSuccess,
    popCancelError,
    showCancelMessage,
    messageApi,
  ]);

  // Render component
  return (
    <>
      {contextHolder}
      <AntPopconfirm
        {...props}
        onConfirm={popConfirm ? handleConfirm : undefined}
        onCancel={popCancel ? handleCancel : undefined}
      />
    </>
  );
}
