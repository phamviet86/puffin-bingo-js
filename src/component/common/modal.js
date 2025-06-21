// path: @/component/common/modal.js

import { useCallback, useState, cloneElement } from "react";
import { Modal as AntModal, message } from "antd";
import { MODAL_CONFIG } from "@/component/config";

export function Modal({
  modalOk = undefined,
  modalOkError = undefined,
  modalOkSuccess = undefined,
  modalCancel = undefined,
  modalCancelError = undefined,
  modalCancelSuccess = undefined,
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
    if (!modalOk) {
      messageApi.error("OK handler not provided");
      return false;
    }

    try {
      const result = await modalOk();
      closeModal();
      if (showOkMessage && result?.message) {
        messageApi.success(result.message);
      }
      modalOkSuccess?.(result);
      return result || true;
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
      modalOkError?.(error);
      return false;
    }
  }, [
    modalOk,
    modalOkSuccess,
    modalOkError,
    showOkMessage,
    messageApi,
    closeModal,
  ]);

  const handleCancel = useCallback(async () => {
    if (!modalCancel) {
      closeModal();
      return false;
    }

    try {
      const result = await modalCancel();
      closeModal();
      if (showCancelMessage && result?.message) {
        messageApi.warning(result.message);
      }
      modalCancelSuccess?.(result);
      return result || false;
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
      modalCancelError?.(error);
      return false;
    }
  }, [
    modalCancel,
    modalCancelSuccess,
    modalCancelError,
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
