// path: @/component/common/drawer.js

import { useCallback, useState, cloneElement } from "react";
import { Drawer as AntDrawer, message, Space } from "antd";
import { Button } from "@/components/common";
import { DRAWER_CONFIG } from "@/component/config";

export function Drawer({
  onDrawerOk = undefined,
  onDrawerOkError = undefined,
  onDrawerOkSuccess = undefined,
  onDrawerCancel = undefined,
  onDrawerCancelError = undefined,
  onDrawerCancelSuccess = undefined,
  showOkMessage = false,
  showCancelMessage = false,
  trigger = undefined,
  okText = "OK",
  cancelText = "Cancel",
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // Handlers
  const openDrawer = useCallback(() => {
    setVisible(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setVisible(false);
  }, []);

  const handleOk = useCallback(async () => {
    if (!onDrawerOk) {
      messageApi.error("OK handler not provided");
      return false;
    }

    try {
      const result = await onDrawerOk();
      closeDrawer();
      if (showOkMessage && result?.message) {
        messageApi.success(result.message);
      }
      onDrawerOkSuccess?.(result);
      return result || true;
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
      onDrawerOkError?.(error);
      return false;
    }
  }, [
    onDrawerOk,
    onDrawerOkSuccess,
    onDrawerOkError,
    showOkMessage,
    messageApi,
    closeDrawer,
  ]);

  const handleCancel = useCallback(async () => {
    if (!onDrawerCancel) {
      closeDrawer();
      return false;
    }

    try {
      const result = await onDrawerCancel();
      closeDrawer();
      if (showCancelMessage && result?.message) {
        messageApi.warning(result.message);
      }
      onDrawerCancelSuccess?.(result);
      return result || false;
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
      onDrawerCancelError?.(error);
      return false;
    }
  }, [
    onDrawerCancel,
    onDrawerCancelSuccess,
    onDrawerCancelError,
    showCancelMessage,
    messageApi,
    closeDrawer,
  ]);

  // Render the component
  return (
    <>
      {contextHolder}
      {trigger ? cloneElement(trigger, { onClick: openDrawer }) : null}
      <AntDrawer
        {...props}
        {...DRAWER_CONFIG}
        open={visible}
        onClose={closeDrawer}
        extra={
          <Space>
            <Button
              label={cancelText}
              onClick={handleCancel}
              color="default"
              variant="outlined"
              key="cancel-button"
            />
            <Button
              label={okText}
              onClick={handleOk}
              color="primary"
              variant="solid"
              key="ok-button"
            />
          </Space>
        }
      />
    </>
  );
}
