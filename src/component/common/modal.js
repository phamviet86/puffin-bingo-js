// path: @/component/common/modal.js

import { useCallback, useState, cloneElement } from "react";
import { Modal as AntModal, message } from "antd";
import { MODAL_CONFIG } from "@/component/config";

export function Modal({
  onModalOk = undefined,
  onModalOkError = undefined,
  onModalOkSuccess = undefined,
  onModalCancel = undefined,
  onModalCancelError = undefined,
  onModalCancelSuccess = undefined,
  showOkMessage = false,
  showCancelMessage = false,
  trigger = undefined,
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // Handlers
  const openModal = useCallback(() => {
    setVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setVisible(false);
  }, []);

  const handleOk = useCallback(async () => {
    if (!onModalOk) {
      messageApi.error("OK handler not provided");
      return false;
    }

    try {
      const result = await onModalOk();
      closeModal();
      if (showOkMessage && result?.message) {
        messageApi.success(result.message);
      }
      onModalOkSuccess?.(result);
      return result || true;
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
      onModalOkError?.(error);
      return false;
    }
  }, [
    onModalOk,
    onModalOkSuccess,
    onModalOkError,
    showOkMessage,
    messageApi,
    closeModal,
  ]);

  const handleCancel = useCallback(async () => {
    if (!onModalCancel) {
      closeModal();
      return false;
    }

    try {
      const result = await onModalCancel();
      closeModal();
      if (showCancelMessage && result?.message) {
        messageApi.warning(result.message);
      }
      onModalCancelSuccess?.(result);
      return result || false;
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
      onModalCancelError?.(error);
      return false;
    }
  }, [
    onModalCancel,
    onModalCancelSuccess,
    onModalCancelError,
    showCancelMessage,
    messageApi,
    closeModal,
  ]);

  // Render the component
  return (
    <>
      {contextHolder}
      {trigger ? cloneElement(trigger, { onClick: openModal }) : null}
      <AntModal
        {...props}
        {...MODAL_CONFIG}
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </>
  );
}
