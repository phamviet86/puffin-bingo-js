// path: @/component/common/modal-steps.js

import React, { useState, useCallback, cloneElement } from "react";
import { Steps, Button, Space } from "antd";
import { Modal } from "./modal";

export function ModalSteps({
  steps = [],
  stepsProps = {},
  extraButtons = [],
  // modal-related props
  ...modalProps
}) {
  const [current, setCurrent] = useState(0);

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
      <Button key="submit" type="primary" onClick={modalProps.onModalOk}>
        Hoàn tất
      </Button>
    ),
  ].filter(Boolean);

  return (
    <Modal
      {...modalProps}
      afterOpenChange={(isVisible) => {
        if (isVisible) setCurrent(0);
        modalProps.afterOpenChange?.(isVisible);
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
    </Modal>
  );
}
