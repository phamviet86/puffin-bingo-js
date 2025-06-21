// path: @/component/common/drawer.js

import { useCallback, useState, cloneElement } from "react";
import { Drawer as AntDrawer, message, Space } from "antd";
import { Button } from "@/component/common";
import { DRAWER_CONFIG } from "@/component/config";

export function Drawer({
  drawerOk = undefined,
  drawerOkError = undefined,
  drawerOkSuccess = undefined,
  drawerCancel = undefined,
  drawerCancelError = undefined,
  drawerCancelSuccess = undefined,
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
    if (!drawerOk) {
      messageApi.error("OK handler not provided");
      return false;
    }

    try {
      const result = await drawerOk();
      closeDrawer();
      if (showOkMessage && result?.message) {
        messageApi.success(result.message);
      }
      drawerOkSuccess?.(result);
      return result || true;
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
      drawerOkError?.(error);
      return false;
    }
  }, [
    drawerOk,
    drawerOkSuccess,
    drawerOkError,
    showOkMessage,
    messageApi,
    closeDrawer,
  ]);

  const handleCancel = useCallback(async () => {
    if (!drawerCancel) {
      closeDrawer();
      return false;
    }

    try {
      const result = await drawerCancel();
      closeDrawer();
      if (showCancelMessage && result?.message) {
        messageApi.warning(result.message);
      }
      drawerCancelSuccess?.(result);
      return result || false;
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
      drawerCancelError?.(error);
      return false;
    }
  }, [
    drawerCancel,
    drawerCancelSuccess,
    drawerCancelError,
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
