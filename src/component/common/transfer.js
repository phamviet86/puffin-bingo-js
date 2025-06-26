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

  // Reload data function
  const reloadData = useCallback(async () => {
    // Prevent multiple concurrent requests
    if (isLoading) {
      console.log('Transfer: Skipping reload - already loading');
      return;
    }

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);

    try {
      console.log('Transfer: Starting data reload', {
        sourceParams: { onSourceParams, ...onSourceSearchParams },
        targetParams: { onTargetParams, ...onTargetSearchParams }
      });

      // Check if we're searching
      const isSourceSearching = Object.keys(onSourceSearchParams).length > 0;
      const isTargetSearching = Object.keys(onTargetSearchParams).length > 0;

      // Nếu không có target search, lấy dữ liệu target gốc để lưu originalTargetKeys
      let originalTargetData = [];
      if (!isTargetSearching && onTargetRequest) {
        // Lấy dữ liệu target gốc (không filter)
        const targetResult = await onTargetRequest({ onTargetParams });
        originalTargetData = onTargetItem
          ? convertTransferItems(targetResult.data || [], onTargetItem)
          : targetResult.data || [];

        // Cập nhật originalTargetKeys chỉ khi không search
        const newOriginalTargetKeys = originalTargetData.map(item => item.key);
        setOriginalTargetKeys(newOriginalTargetKeys);
      }

      // Prepare and execute display requests (có thể đã được filter)
      const promises = [];
      const requestConfigs = [];

      // Prepare source request
      if (onSourceRequest) {
        const sourceParams = { onSourceParams, ...onSourceSearchParams };
        promises.push(onSourceRequest(sourceParams));
        requestConfigs.push('source');
      }

      // Prepare target request (for display)
      if (onTargetRequest) {
        const targetParams = { onTargetParams, ...onTargetSearchParams };
        promises.push(onTargetRequest(targetParams));
        requestConfigs.push('target');
      }

      // Execute all requests in parallel
      const results = await Promise.all(promises);

      let sourceData = [];
      let targetData = [];

      // Process results based on configuration
      results.forEach((result, index) => {
        const data = result.data || [];
        if (requestConfigs[index] === 'source') {
          sourceData = onSourceItem ? convertTransferItems(data, onSourceItem) : data;
        } else if (requestConfigs[index] === 'target') {
          targetData = onTargetItem ? convertTransferItems(data, onTargetItem) : data;
        }
      });

      // Update target keys for display
      const displayTargetKeys = targetData.map(item => item.key);
      setTargetKeys(displayTargetKeys);

      // Sử dụng originalTargetKeys để loại bỏ items khỏi source
      // Nếu đang search target, dùng originalTargetKeys; nếu không thì dùng displayTargetKeys
      const keysToExclude = isTargetSearching ? originalTargetKeys : displayTargetKeys;
      const sourceItemsNotInTarget = sourceData.filter(
        item => !keysToExclude.includes(item.key)
      );

      // Merge data with target first
      const allItems = [...targetData, ...sourceItemsNotInTarget];
      setDataSource(allItems);

      console.log('Transfer: Data reload completed', {
        sourceCount: sourceData.length,
        targetCount: targetData.length,
        originalTargetCount: originalTargetKeys.length,
        isTargetSearching,
        keysExcludedCount: keysToExclude.length,
        totalCount: allItems.length
      });

    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Transfer: Data reload error', error);
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
    onSourceSearchParams,
    onSourceItem,
    onTargetRequest,
    onTargetParams,
    onTargetSearchParams,
    onTargetItem,
    originalTargetKeys,
    messageApi
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
  const prevReloadFlagRef = useRef(reloadFlag);
  const isInitialLoadRef = useRef(true);
  
  // Always update ref to latest function
  reloadDataRef.current = reloadData;

  // Initial data load only once
  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      reloadDataRef.current();
    }
  }, []);

  // Only reload when reloadFlag actually changes (for manual refresh)
  useEffect(() => {
    if (!isInitialLoadRef.current && reloadFlag !== undefined && reloadFlag !== prevReloadFlagRef.current) {
      prevReloadFlagRef.current = reloadFlag;
      reloadDataRef.current();
    }
  }, [reloadFlag]);

  // Only reload when search params change (after initial load)
  useEffect(() => {
    if (!isInitialLoadRef.current) {
      const timeoutId = setTimeout(() => {
        reloadDataRef.current();
      }, 300); // Longer debounce for search

      return () => clearTimeout(timeoutId);
    }
  }, [onSourceSearchParams, onTargetSearchParams]);

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
