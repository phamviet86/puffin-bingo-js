// path: @/component/common/transfer.js

import { useState, useEffect, useCallback } from "react";
import { Transfer as AntTransfer, message } from "antd";
import { convertTransferItems } from "@/lib/util/convert-util";
import styles from "./transfer.module.css";

export function Transfer({
  onSourceRequest = undefined,
  onSourceParams = undefined,
  onSourceItem = undefined,
  onTargetRequest = undefined,
  onTargetParams = undefined,
  onTargetItem = undefined,
  onAddTarget = undefined,
  onRemoveTarget = undefined,
  listStyle = undefined,
  rowKey = (item) => item.key,
  render = (item) => item.title,
  ...props
}) {
  const [dataSource, setDataSource] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  // Handlers
  const handleSourceRequest = useCallback(
    async (onSourceParams) => {
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
    },
    [onSourceRequest, onSourceItem, messageApi]
  );

  const handleTargetRequest = useCallback(
    async (onTargetParams) => {
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
    },
    [onTargetRequest, onTargetItem, messageApi]
  );

  // Reload data function
  const reloadData = useCallback(async () => {
    try {
      const [source, target] = await Promise.all([
        handleSourceRequest(onSourceParams),
        handleTargetRequest(onTargetParams),
      ]);

      // Merge source and target data to ensure all items are available
      const allItems = [...source, ...target];
      // Remove duplicates based on key
      const uniqueItems = allItems.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.key === item.key)
      );

      setDataSource(uniqueItems);
      setTargetKeys(target.map((item) => item.key));
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi khi tải dữ liệu");
    }
  }, [
    onSourceParams,
    onTargetParams,
    messageApi,
    handleSourceRequest,
    handleTargetRequest,
  ]);

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

  // Fetch data khi mount
  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <>
      {contextHolder}
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
    </>
  );
}
