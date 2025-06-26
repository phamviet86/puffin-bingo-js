// path: @/component/common/transfer.js

import { useState, useEffect, useCallback } from "react";
import { Transfer as AntTransfer, message } from "antd";
import { convertTransferItems } from "@/lib/util/convert-util";
import styles from "./transfer.module.css";

export function Transfer({
  onSourceRequest = undefined,
  onSourceParams = undefined,
  onSourceItem = undefined,
  onSourceSearch = [],
  onTargetRequest = undefined,
  onTargetParams = undefined,
  onTargetItem = undefined,
  onTargetSearch = [],
  onAddTarget = undefined,
  onRemoveTarget = undefined,
  listStyle = undefined,
  rowKey = (record) => record.key,
  render = (record) => record.key,
  reloadFlag = undefined, // NEW: flag to trigger reload
  searchDelay = 500, // NEW: configurable search delay in milliseconds
  ...props
}) {
  const [dataSource, setDataSource] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [onSourceSearchParams, setOnSourceSearchParams] = useState({});
  const [onTargetSearchParams, setOnTargetSearchParams] = useState({});
  const [sourceSearchValue, setSourceSearchValue] = useState("");
  const [targetSearchValue, setTargetSearchValue] = useState("");
  const [originalTargetKeys, setOriginalTargetKeys] = useState([]); // NEW: lưu targetKeys gốc

  // Handlers
  const handleSourceRequest = useCallback(async () => {
    if (!onSourceRequest) {
      messageApi.error("Data request handler not provided");
      return [];
    }
    try {
      const result = await onSourceRequest({
        onSourceParams,
        ...onSourceSearchParams,
      });
      if (onSourceItem) {
        return convertTransferItems(result.data || [], onSourceItem);
      }
      return result.data || [];
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
      return [];
    }
  }, [
    onSourceRequest,
    onSourceItem,
    onSourceParams,
    messageApi,
    onSourceSearchParams,
  ]);

  const handleTargetRequest = useCallback(async () => {
    if (!onTargetRequest) {
      messageApi.error("Data request handler not provided");
      return [];
    }
    try {
      const result = await onTargetRequest({
        onTargetParams,
        ...onTargetSearchParams,
      });
      if (onTargetItem) {
        return convertTransferItems(result.data || [], onTargetItem);
      }
      return result.data || [];
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
      return [];
    }
  }, [
    onTargetRequest,
    onTargetItem,
    onTargetParams,
    messageApi,
    onTargetSearchParams,
  ]);

  // Reload data function
  const reloadData = useCallback(async () => {
    try {
      // Nếu không có search params, gọi API không filter để lấy targetKeys gốc
      const isSourceSearching = Object.keys(onSourceSearchParams).length > 0;
      const isTargetSearching = Object.keys(onTargetSearchParams).length > 0;

      let originalTargetData = [];
      if (!isTargetSearching) {
        // Lấy dữ liệu target gốc (không filter)
        const targetResult = await onTargetRequest({ onTargetParams });
        originalTargetData = onTargetItem
          ? convertTransferItems(targetResult.data || [], onTargetItem)
          : targetResult.data || [];

        // Cập nhật originalTargetKeys chỉ khi không search
        const newOriginalTargetKeys = originalTargetData.map(
          (item) => item.key
        );
        setOriginalTargetKeys(newOriginalTargetKeys);
        setTargetKeys(newOriginalTargetKeys);
      }

      // Lấy dữ liệu hiển thị (có thể đã filter)
      const [sourceData, targetData] = await Promise.all([
        handleSourceRequest(),
        handleTargetRequest(),
      ]);

      // Sử dụng originalTargetKeys để loại bỏ items khỏi source
      const keysToExclude = isTargetSearching
        ? originalTargetKeys
        : targetData.map((item) => item.key);
      const sourceItemsNotInTarget = sourceData.filter(
        (item) => !keysToExclude.includes(item.key)
      );

      // Merge với target data được ưu tiên trước
      const allItems = [...targetData, ...sourceItemsNotInTarget];

      setDataSource(allItems);
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi khi tải dữ liệu");
    }
  }, [
    messageApi,
    handleSourceRequest,
    handleTargetRequest,
    onSourceSearchParams,
    onTargetSearchParams,
    onTargetRequest,
    onTargetParams,
    onTargetItem,
    originalTargetKeys,
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

  const handleSearch = useCallback((direction, value) => {
    if (direction === "left") {
      setSourceSearchValue(value);
    } else {
      setTargetSearchValue(value);
    }
  }, []);

  // Debounced effect for source search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onSourceSearch.length > 0) {
        const or = {};
        onSourceSearch.forEach((key) => {
          or[key] = sourceSearchValue;
        });
        setOnSourceSearchParams({ or });
      } else {
        setOnSourceSearchParams({});
      }
    }, searchDelay);

    return () => clearTimeout(timeoutId);
  }, [sourceSearchValue, onSourceSearch, searchDelay]);

  // Debounced effect for target search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onTargetSearch.length > 0) {
        const or = {};
        onTargetSearch.forEach((key) => {
          or[key] = targetSearchValue;
        });
        setOnTargetSearchParams({ or });
      } else {
        setOnTargetSearchParams({});
      }
    }, searchDelay);

    return () => clearTimeout(timeoutId);
  }, [targetSearchValue, onTargetSearch, searchDelay]);

  const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  // Fetch data khi mount hoặc khi reloadFlag thay đổi
  useEffect(() => {
    reloadData();
  }, [reloadData, reloadFlag]);

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
          onSearch={handleSearch}
          rowKey={rowKey}
          render={render}
          listStyle={listStyle}
          showSearch={true}
          filterOption={() => true} // Bỏ qua logic filter mặc định, luôn trả về true để không lọc dữ liệu phía client
        />
      </div>
    </>
  );
}
