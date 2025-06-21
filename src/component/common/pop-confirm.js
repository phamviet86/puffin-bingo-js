// path: @/components/common/pop-confirm.js

import { useCallback } from "react";
import { Popconfirm as AntPopconfirm, message } from "antd";

export function Popconfirm({
  onPopConfirm = undefined,
  onPopConfirmError = undefined,
  onPopConfirmSuccess = undefined,
  onPopCancel = undefined,
  onPopCancelError = undefined,
  onPopCancelSuccess = undefined,
  showConfirmMessage = false,
  showCancelMessage = false,
  ...props
}) {
  const [messageApi, contextHolder] = message.useMessage();

  // Handlers
  const handleConfirm = useCallback(async () => {
    if (!onPopConfirm) {
      messageApi.error("Data confirm handler not provided");
      return false;
    }

    try {
      const result = await onPopConfirm();
      if (showConfirmMessage && result?.message) {
        messageApi.success(result.message);
      }
      onPopConfirmSuccess?.(result);
      return result || true;
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
      onPopConfirmError?.(error);
      return false;
    }
  }, [
    onPopConfirm,
    onPopConfirmSuccess,
    onPopConfirmError,
    showConfirmMessage,
    messageApi,
  ]);

  const handleCancel = useCallback(async () => {
    if (!onPopCancel) {
      messageApi.error("Data cancel handler not provided");
      return false;
    }

    try {
      const result = await onPopCancel();
      if (showCancelMessage && result?.message) {
        messageApi.warning(result.message);
      }
      onPopCancelSuccess?.(result);
      return result || false;
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
      onPopCancelError?.(error);
      return false;
    }
  }, [
    onPopCancel,
    onPopCancelSuccess,
    onPopCancelError,
    showCancelMessage,
    messageApi,
  ]);

  // Render component
  return (
    <>
      {contextHolder}
      <AntPopconfirm
        {...props}
        onConfirm={onPopConfirm ? handleConfirm : undefined}
        onCancel={onPopCancel ? handleCancel : undefined}
      />
    </>
  );
}
