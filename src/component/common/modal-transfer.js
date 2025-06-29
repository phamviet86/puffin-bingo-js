// path: @/component/common/modal-transfer.js

import { useState, useEffect, useCallback } from "react";
import { Modal } from "antd";
import { Transfer } from "./transfer";
import styles from "./transfer.module.css";
import { MODAL_CONFIG } from "@/component/config";

export function ModalTransfer({
  modalProps = {},
  transferHook = {},
  onTransferClose = undefined,
  ...props
}) {
  const { visible, close } = transferHook;
  const [reloadFlag, setReloadFlag] = useState(0);

  // Handlers
  const handleClose = useCallback(() => {
    close();
    onTransferClose?.();
  }, [close, onTransferClose]);

  // Trigger reloadFlag when modal opens
  useEffect(() => {
    if (visible) {
      setReloadFlag((f) => f + 1);
    }
  }, [visible]);

  // Render the component
  return (
    <Modal
      {...modalProps}
      {...MODAL_CONFIG}
      open={visible}
      onOk={handleClose}
      onCancel={handleClose}
      footer={false}
      width="auto"
    >
      <div className={styles.remoteTransfer}>
        <Transfer {...props} reloadFlag={reloadFlag} />
      </div>
    </Modal>
  );
}
