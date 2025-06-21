// path: @/components/common/modal-steps.js

import React, { useState, useCallback, cloneElement } from "react";
import { Modal as AntModal, message, Steps, Button, Space } from "antd";
import { MODAL_CONFIG } from "@/component/config";

export function ModalSteps({
  onModalOk = undefined,
  onModalOkError = undefined,
  onModalOkSuccess = undefined,
  onModalCancel = undefined,
  onModalCancelError = undefined,
  onModalCancelSuccess = undefined,
  showOkMessage = false,
  showCancelMessage = false,
  trigger = undefined,
  steps = [],
  stepsProps = {},
  extraButtons = [],
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [current, setCurrent] = useState(0);

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

  const goToNextStep = useCallback(() => {
    setCurrent((c) => c + 1);
  }, []);

  const goToPrevStep = useCallback(() => {
    setCurrent((c) => c - 1);
  }, []);

  const defaultButtons = [
    current > 0 && (
      <Button key="back" onClick={goToPrevStep}>
        Quay lại
      </Button>
    ),
    current < steps.length - 1 && (
      <Button key="next" type="primary" onClick={goToNextStep}>
        Tiếp theo
      </Button>
    ),
    current === steps.length - 1 && (
      <Button key="submit" type="primary" onClick={handleOk}>
        Hoàn tất
      </Button>
    ),
  ].filter(Boolean);

  // Render the component
  return (
    <>
      {contextHolder}
      {trigger ? cloneElement(trigger, { onClick: openModal }) : null}
      <AntModal
        {...props}
        {...MODAL_CONFIG}
        open={visible}
        onCancel={handleCancel}
        afterOpenChange={(isVisible) => {
          if (isVisible) setCurrent(0);
        }}
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <Space>
              {extraButtons.map((btn, i) =>
                React.isValidElement(btn)
                  ? cloneElement(btn, { key: `extra-${i}` })
                  : btn
              )}
            </Space>

            <Space>{defaultButtons}</Space>
          </div>
        }
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Steps current={current} items={steps} {...stepsProps} />
          {steps[current]?.content}
        </Space>
      </AntModal>
    </>
  );
}
