// path: @/component/common/modal-transfer.js

import { useState, useEffect, useCallback } from "react";
import { message, Modal, Transfer as AntTransfer } from "antd";
import { convertTransferItems } from "@/lib/util/convert-util";
import styles from "./transfer.module.css";
import { MODAL_CONFIG } from "@/component/config";

export function ModalTransfer({
  onSourceRequest = undefined,
  onSourceParams = undefined,
  onSourceItem = undefined,
  onTargetRequest = undefined,
  onTargetParams = undefined,
  onTargetItem = undefined,
  onAddTarget = undefined,
  onRemoveTarget = undefined,
  onTransferClose = undefined,
  listStyle = undefined,
  rowKey = (record) => record.key,
  render = (record) => record.title,
  modalProps = {},
  transferHook = {},
  ...props
}) {
  const { visible, close } = transferHook;
  const [dataSource, setDataSource] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  // Handlers
  const handleClose = useCallback(() => {
    close();
    onTransferClose?.();
  }, [close, onTransferClose]);

  const handleSourceRequest = useCallback(async () => {
    if (!onSourceRequest) {
      messageApi.error("Data request handler not provided");
      return [];
    }
    try {
      const result = await onSourceRequest(onSourceParams);
      if (onSourceItem) {
        return convertTransferItems(result.data || [], onSourceItem);
      }
      return result.data || [];
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
      return [];
    }
  }, [onSourceRequest, onSourceItem, onSourceParams, messageApi]);

  const handleTargetRequest = useCallback(async () => {
    if (!onTargetRequest) {
      messageApi.error("Data request handler not provided");
      return [];
    }
    try {
      const result = await onTargetRequest(onTargetParams);
      if (onTargetItem) {
        return convertTransferItems(result.data || [], onTargetItem);
      }
      return result.data || [];
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
      return [];
    }
  }, [onTargetRequest, onTargetItem, onTargetParams, messageApi]);

  // Reload data function
  const reloadData = useCallback(async () => {
    try {
      const [source, target] = await Promise.all([
        handleSourceRequest(),
        handleTargetRequest(),
      ]);

      // Ưu tiên dữ liệu từ target trước, sau đó mới lấy source để fill những item còn thiếu
      const targetKeys = target.map((item) => item.key);
      const sourceItemsNotInTarget = source.filter(
        (item) => !targetKeys.includes(item.key)
      );

      // Merge với target data được ưu tiên trước
      const allItems = [...target, ...sourceItemsNotInTarget];

      setDataSource(allItems);
      setTargetKeys(targetKeys);
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi khi tải dữ liệu");
    }
  }, [messageApi, handleSourceRequest, handleTargetRequest]);

  const handleAddTarget = useCallback(
    async (keys) => {
      if (!onAddTarget) {
        messageApi.error("Data add handler not provided");
        return;
      }
      try {
        const result = await onAddTarget(keys);
        if (result?.success) {
          messageApi.success(result?.message || "Thêm thành công");
          await reloadData();
        } else {
          messageApi.error(result?.message || "Đã xảy ra lỗi");
        }
      } catch (error) {
        messageApi.error(error.message || "Đã xảy ra lỗi");
      }
    },
    [onAddTarget, messageApi, reloadData]
  );

  const handleRemoveTarget = useCallback(
    async (keys) => {
      if (!onRemoveTarget) {
        messageApi.error("Data remove handler not provided");
        return;
      }
      try {
        const result = await onRemoveTarget(keys);
        if (result?.success) {
          messageApi.success(result?.message || "Xóa thành công");
          await reloadData();
        } else {
          messageApi.error(result?.message || "Đã xảy ra lỗi");
        }
      } catch (error) {
        messageApi.error(error.message || "Đã xảy ra lỗi");
      }
    },
    [onRemoveTarget, messageApi, reloadData]
  );

  // Khi chuyển record (sang phải/trái)
  const handleChange = useCallback(
    async (_, direction, moveKeys) => {
      if (direction === "right") {
        await handleAddTarget(moveKeys);
      } else {
        await handleRemoveTarget(moveKeys);
      }
    },
    [handleAddTarget, handleRemoveTarget]
  );

  const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  // Fetch data khi modal được mở
  useEffect(() => {
    if (visible) {
      reloadData();
    }
  }, [visible, reloadData]);

  // Render the component
  return (
    <>
      {contextHolder}
      <Modal
        {...modalProps}
        {...MODAL_CONFIG}
        open={visible}
        onOk={handleClose}
        onCancel={handleClose}
        footer={false}
      >
        <div className={styles.remoteTransfer}>
          <AntTransfer
            {...props}
            direction="vertical"
            dataSource={dataSource}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            onChange={handleChange}
            onSelectChange={handleSelectChange}
            rowKey={rowKey}
            render={render}
            listStyle={listStyle}
          />
        </div>
      </Modal>
    </>
  );
}
