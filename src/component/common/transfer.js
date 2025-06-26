// path: @/component/common/transfer.js

import { useState, useEffect, useCallback, useRef } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef(null);

  // Separate reload functions for each side
  const reloadSourceData = useCallback(async () => {
    if (!onSourceRequest || isLoading) return;

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);

    try {
      console.log("Transfer: Reloading source data", {
        sourceParams: { onSourceParams, ...onSourceSearchParams },
      });

      const sourceParams = { onSourceParams, ...onSourceSearchParams };
      const sourceResult = await onSourceRequest(sourceParams);
      const sourceData = onSourceItem
        ? convertTransferItems(sourceResult.data || [], onSourceItem)
        : sourceResult.data || [];

      // Use original target keys to filter out items already in target
      const sourceItemsNotInTarget = sourceData.filter(
        (item) => !originalTargetKeys.includes(item.key)
      );

      // Update dataSource by replacing source items while keeping target items
      setDataSource((prevData) => {
        const targetItems = prevData.filter((item) =>
          targetKeys.includes(item.key)
        );
        return [...targetItems, ...sourceItemsNotInTarget];
      });

      console.log("Transfer: Source data reloaded", {
        sourceCount: sourceData.length,
        filteredCount: sourceItemsNotInTarget.length,
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Transfer: Source reload error", error);
        messageApi.error(
          error.message || "Đã xảy ra lỗi khi tải dữ liệu source"
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [
    onSourceRequest,
    onSourceParams,
    onSourceSearchParams,
    onSourceItem,
    originalTargetKeys,
    targetKeys,
    isLoading,
    messageApi,
  ]);

  const reloadTargetData = useCallback(async () => {
    if (!onTargetRequest || isLoading) return;

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);

    try {
      console.log("Transfer: Reloading target data", {
        targetParams: { onTargetParams, ...onTargetSearchParams },
      });

      const targetParams = { onTargetParams, ...onTargetSearchParams };
      const targetResult = await onTargetRequest(targetParams);
      const targetData = onTargetItem
        ? convertTransferItems(targetResult.data || [], onTargetItem)
        : targetResult.data || [];

      // Update target keys for display
      const displayTargetKeys = targetData.map((item) => item.key);
      setTargetKeys(displayTargetKeys);

      // Update dataSource by replacing target items while keeping source items
      setDataSource((prevData) => {
        const sourceItems = prevData.filter(
          (item) => !targetKeys.includes(item.key)
        );
        return [...targetData, ...sourceItems];
      });

      console.log("Transfer: Target data reloaded", {
        targetCount: targetData.length,
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Transfer: Target reload error", error);
        messageApi.error(
          error.message || "Đã xảy ra lỗi khi tải dữ liệu target"
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [
    onTargetRequest,
    onTargetParams,
    onTargetSearchParams,
    onTargetItem,
    targetKeys,
    isLoading,
    messageApi,
  ]);

  // Initial full reload (loads both sides)
  const reloadData = useCallback(async () => {
    // Prevent multiple concurrent requests
    if (isLoading) {
      console.log("Transfer: Skipping reload - already loading");
      return;
    }

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);

    try {
      console.log("Transfer: Starting full data reload");

      // Load original target data first (without search filters)
      let originalTargetData = [];
      if (onTargetRequest) {
        const targetResult = await onTargetRequest({ onTargetParams });
        originalTargetData = onTargetItem
          ? convertTransferItems(targetResult.data || [], onTargetItem)
          : targetResult.data || [];

        const newOriginalTargetKeys = originalTargetData.map(
          (item) => item.key
        );
        setOriginalTargetKeys(newOriginalTargetKeys);
        setTargetKeys(newOriginalTargetKeys);
      }

      // Load source data
      let sourceData = [];
      if (onSourceRequest) {
        const sourceResult = await onSourceRequest({ onSourceParams });
        sourceData = onSourceItem
          ? convertTransferItems(sourceResult.data || [], onSourceItem)
          : sourceResult.data || [];
      }

      // Filter source items not in target
      const sourceItemsNotInTarget = sourceData.filter(
        (item) =>
          !originalTargetData.some((targetItem) => targetItem.key === item.key)
      );

      // Merge data with target first
      const allItems = [...originalTargetData, ...sourceItemsNotInTarget];
      setDataSource(allItems);

      console.log("Transfer: Full data reload completed", {
        sourceCount: sourceData.length,
        targetCount: originalTargetData.length,
        totalCount: allItems.length,
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Transfer: Full reload error", error);
        messageApi.error(error.message || "Đã xảy ra lỗi khi tải dữ liệu");
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [
    isLoading,
    onSourceRequest,
    onSourceParams,
    onSourceItem,
    onTargetRequest,
    onTargetParams,
    onTargetItem,
    messageApi,
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
          await reloadDataRef.current();
        } else {
          messageApi.error(result?.message || "Đã xảy ra lỗi");
        }
      } catch (error) {
        messageApi.error(error.message || "Đã xảy ra lỗi");
      }
    },
    [onAddTarget, messageApi]
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
          await reloadDataRef.current();
        } else {
          messageApi.error(result?.message || "Đã xảy ra lỗi");
        }
      } catch (error) {
        messageApi.error(error.message || "Đã xảy ra lỗi");
      }
    },
    [onRemoveTarget, messageApi]
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
    // Don't process search on initial mount
    if (isInitialLoadRef.current) return;

    const timeoutId = setTimeout(() => {
      if (onSourceSearch.length > 0 && sourceSearchValue.trim()) {
        // Only create search params if there's actual search value
        const or = {};
        onSourceSearch.forEach((key) => {
          or[key] = sourceSearchValue.trim();
        });
        setOnSourceSearchParams({ or });
      } else {
        // Clear search params when no search value
        setOnSourceSearchParams({});
      }
    }, searchDelay);

    return () => clearTimeout(timeoutId);
  }, [sourceSearchValue, onSourceSearch, searchDelay]);

  // Debounced effect for target search
  useEffect(() => {
    // Don't process search on initial mount
    if (isInitialLoadRef.current) return;

    const timeoutId = setTimeout(() => {
      if (onTargetSearch.length > 0 && targetSearchValue.trim()) {
        // Only create search params if there's actual search value
        const or = {};
        onTargetSearch.forEach((key) => {
          or[key] = targetSearchValue.trim();
        });
        setOnTargetSearchParams({ or });
      } else {
        // Clear search params when no search value
        setOnTargetSearchParams({});
      }
    }, searchDelay);

    return () => clearTimeout(timeoutId);
  }, [targetSearchValue, onTargetSearch, searchDelay]);

  const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  // Centralized data loading with better state management
  const reloadDataRef = useRef(reloadData);
  const reloadSourceDataRef = useRef(reloadSourceData);
  const reloadTargetDataRef = useRef(reloadTargetData);
  const prevReloadFlagRef = useRef(reloadFlag);
  const isInitialLoadRef = useRef(true);

  // Always update refs to latest functions
  reloadDataRef.current = reloadData;
  reloadSourceDataRef.current = reloadSourceData;
  reloadTargetDataRef.current = reloadTargetData;

  // Initial data load only once
  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      reloadDataRef.current();
    }
  }, []);

  // Only reload when reloadFlag actually changes (for manual refresh)
  useEffect(() => {
    if (
      !isInitialLoadRef.current &&
      reloadFlag !== undefined &&
      reloadFlag !== prevReloadFlagRef.current
    ) {
      prevReloadFlagRef.current = reloadFlag;
      reloadDataRef.current();
    }
  }, [reloadFlag]);

  // Optimized: Only reload the side that has search params changes
  useEffect(() => {
    if (!isInitialLoadRef.current) {
      const timeoutId = setTimeout(() => {
        reloadSourceDataRef.current();
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [onSourceSearchParams]);

  useEffect(() => {
    if (!isInitialLoadRef.current) {
      const timeoutId = setTimeout(() => {
        reloadTargetDataRef.current();
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [onTargetSearchParams]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
