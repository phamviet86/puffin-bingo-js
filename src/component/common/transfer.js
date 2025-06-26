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
  onTargetAdd = undefined,
  onTargetRemove = undefined,
  listStyle = { width: "100%", height: "100%", minHeight: "200px" },
  rowKey = (record) => record.key,
  render = (record) => record.key,
  searchDelay = 500,
  showSearch = false,
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSourceLoading, setIsSourceLoading] = useState(false);
  const [isTargetLoading, setIsTargetLoading] = useState(false);
  const abortControllerRef = useRef(null);
  const sourceAbortControllerRef = useRef(null);
  const targetAbortControllerRef = useRef(null);

  const requestCacheRef = useRef(new Map());
  const lastRequestParamsRef = useRef({ source: null, target: null });

  // Helper function to generate cache key
  const generateCacheKey = useCallback((type, params) => {
    return `${type}_${JSON.stringify(params)}`;
  }, []);

  // Helper function to check if params have changed
  const hasParamsChanged = useCallback((type, newParams) => {
    const lastParams = lastRequestParamsRef.current[type];
    const newParamsStr = JSON.stringify(newParams);
    const lastParamsStr = JSON.stringify(lastParams);
    return newParamsStr !== lastParamsStr;
  }, []);

  // Helper function to safely merge data without duplicates
  const mergeDataSafely = useCallback((targetItems, sourceItems) => {
    const targetKeys = targetItems.map((item) => item.key);
    const uniqueSourceItems = sourceItems.filter(
      (item) => !targetKeys.includes(item.key)
    );
    return [...targetItems, ...uniqueSourceItems];
  }, []);

  // Separate reload functions for each side
  const reloadSourceData = useCallback(async () => {
    console.log("Transfer: Reloading source data");
    if (!onSourceRequest) return;

    const sourceParams = { ...onSourceParams, ...onSourceSearchParams };
    const cacheKey = generateCacheKey("source", sourceParams);

    // Check if same request is already in progress or params haven't changed
    if (isSourceLoading || !hasParamsChanged("source", sourceParams)) {
      return;
    }

    // Cancel previous source request if exists
    if (sourceAbortControllerRef.current) {
      sourceAbortControllerRef.current.abort();
    }

    sourceAbortControllerRef.current = new AbortController();
    setIsSourceLoading(true);
    lastRequestParamsRef.current.source = sourceParams;

    try {
      const sourceResult = await onSourceRequest(sourceParams);
      const sourceData = onSourceItem
        ? convertTransferItems(sourceResult.data || [], onSourceItem)
        : sourceResult.data || [];

      // Cache the result
      requestCacheRef.current.set(cacheKey, sourceData);

      // Update dataSource by replacing source items while keeping target items
      setDataSource((prevData) => {
        const targetItems = prevData.filter((item) =>
          targetKeys.includes(item.key)
        );
        return mergeDataSafely(targetItems, sourceData);
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Transfer: Source reload error", error);
        messageApi.error(
          error.message || "Đã xảy ra lỗi khi tải dữ liệu source"
        );
      }
    } finally {
      setIsSourceLoading(false);
      sourceAbortControllerRef.current = null;
    }
  }, [
    onSourceRequest,
    onSourceParams,
    onSourceSearchParams,
    onSourceItem,
    targetKeys,
    isSourceLoading,
    messageApi,
    generateCacheKey,
    hasParamsChanged,
    mergeDataSafely,
  ]);

  const reloadTargetData = useCallback(async () => {
    console.log("Transfer: Reloading target data");
    if (!onTargetRequest) return;

    const targetParams = { ...onTargetParams, ...onTargetSearchParams };
    const cacheKey = generateCacheKey("target", targetParams);

    // Check if same request is already in progress or params haven't changed
    if (isTargetLoading || !hasParamsChanged("target", targetParams)) {
      return;
    }

    // Cancel previous target request if exists
    if (targetAbortControllerRef.current) {
      targetAbortControllerRef.current.abort();
    }

    targetAbortControllerRef.current = new AbortController();
    setIsTargetLoading(true);
    lastRequestParamsRef.current.target = targetParams;

    try {
      const targetResult = await onTargetRequest(targetParams);
      const targetData = onTargetItem
        ? convertTransferItems(targetResult.data || [], onTargetItem)
        : targetResult.data || [];

      // Cache the result
      requestCacheRef.current.set(cacheKey, targetData);

      // Update target keys for display
      const displayTargetKeys = targetData.map((item) => item.key);
      setTargetKeys(displayTargetKeys);

      // Update dataSource by replacing target items while keeping source items
      setDataSource((prevData) => {
        const sourceItems = prevData.filter(
          (item) => !targetKeys.includes(item.key)
        );
        return mergeDataSafely(targetData, sourceItems);
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Transfer: Target reload error", error);
        messageApi.error(
          error.message || "Đã xảy ra lỗi khi tải dữ liệu target"
        );
      }
    } finally {
      setIsTargetLoading(false);
      targetAbortControllerRef.current = null;
    }
  }, [
    onTargetRequest,
    onTargetParams,
    onTargetSearchParams,
    onTargetItem,
    targetKeys,
    isTargetLoading,
    messageApi,
    generateCacheKey,
    hasParamsChanged,
    mergeDataSafely,
  ]);

  // Initial full reload (loads both sides) - optimized to prevent duplicates
  const reloadData = useCallback(async () => {
    console.log("Transfer: Reloading data");
    // Prevent multiple concurrent requests
    if (isLoading || isSourceLoading || isTargetLoading) {
      return;
    }

    // Cancel all previous requests if exist
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (sourceAbortControllerRef.current) {
      sourceAbortControllerRef.current.abort();
    }
    if (targetAbortControllerRef.current) {
      targetAbortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);

    try {
      const promises = [];
      const configs = [];

      // Prepare target request
      if (onTargetRequest) {
        const targetParams = { ...onTargetParams };
        promises.push(onTargetRequest(targetParams));
        configs.push("target");
        lastRequestParamsRef.current.target = targetParams;
      }

      // Prepare source request
      if (onSourceRequest) {
        const sourceParams = { ...onSourceParams };
        promises.push(onSourceRequest(sourceParams));
        configs.push("source");
        lastRequestParamsRef.current.source = sourceParams;
      }

      // Execute requests in parallel
      const results = await Promise.all(promises);

      let originalTargetData = [];
      let sourceData = [];

      // Process results
      results.forEach((result, index) => {
        const data = result.data || [];
        if (configs[index] === "target") {
          originalTargetData = onTargetItem
            ? convertTransferItems(data, onTargetItem)
            : data;
        } else if (configs[index] === "source") {
          sourceData = onSourceItem
            ? convertTransferItems(data, onSourceItem)
            : data;
        }
      });

      // Update original target keys
      if (originalTargetData.length > 0) {
        const newOriginalTargetKeys = originalTargetData.map(
          (item) => item.key
        );
        setTargetKeys(newOriginalTargetKeys);
      }

      // Filter source items not in target
      const sourceItemsNotInTarget = sourceData.filter(
        (item) =>
          !originalTargetData.some((targetItem) => targetItem.key === item.key)
      );

      // Merge data with target first
      const allItems = [...originalTargetData, ...sourceItemsNotInTarget];
      setDataSource(allItems);
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
    isSourceLoading,
    isTargetLoading,
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
      if (!onTargetAdd) {
        messageApi.error("Data add handler not provided");
        return;
      }
      try {
        const result = await onTargetAdd(keys);
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
    [onTargetAdd, messageApi]
  );

  const handleRemoveTarget = useCallback(
    async (keys) => {
      if (!onTargetRemove) {
        messageApi.error("Data remove handler not provided");
        return;
      }
      try {
        const result = await onTargetRemove(keys);
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
    [onTargetRemove, messageApi]
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
    if (isInitialLoadRef.current) return;

    const timeoutId = setTimeout(() => {
      if (onSourceSearch.length > 0 && sourceSearchValue.trim()) {
        const or = {};
        onSourceSearch.forEach((key) => {
          or[key] = sourceSearchValue.trim();
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
    if (isInitialLoadRef.current) return;

    const timeoutId = setTimeout(() => {
      if (onTargetSearch.length > 0 && targetSearchValue.trim()) {
        const or = {};
        onTargetSearch.forEach((key) => {
          or[key] = targetSearchValue.trim();
        });
        setOnTargetSearchParams({ or });
      } else {
        setOnTargetSearchParams({});
      }
    }, searchDelay);

    return () => clearTimeout(timeoutId);
  }, [targetSearchValue, onTargetSearch, searchDelay]);

  const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...targetSelectedKeys, ...sourceSelectedKeys]);
  };

  // Centralized data loading with better state management
  const reloadDataRef = useRef(reloadData);
  const reloadSourceDataRef = useRef(reloadSourceData);
  const reloadTargetDataRef = useRef(reloadTargetData);
  const isInitialLoadRef = useRef(true);
  const mountedRef = useRef(false);

  // Always update refs to latest functions
  reloadDataRef.current = reloadData;
  reloadSourceDataRef.current = reloadSourceData;
  reloadTargetDataRef.current = reloadTargetData;

  // Initial data load only once with proper mounting check
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      isInitialLoadRef.current = false;

      const timeoutId = setTimeout(() => {
        reloadDataRef.current();
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, []);

  // Optimized: Only reload the side that has search params changes
  useEffect(() => {
    if (mountedRef.current) {
      const timeoutId = setTimeout(() => {
        reloadSourceDataRef.current();
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [onSourceSearchParams]);

  useEffect(() => {
    if (mountedRef.current) {
      const timeoutId = setTimeout(() => {
        reloadTargetDataRef.current();
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [onTargetSearchParams]);

  // Cleanup on unmount
  useEffect(() => {
    const currentAbortController = abortControllerRef.current;
    const currentSourceAbortController = sourceAbortControllerRef.current;
    const currentTargetAbortController = targetAbortControllerRef.current;
    const currentRequestCache = requestCacheRef.current;

    return () => {
      if (currentAbortController) {
        currentAbortController.abort();
      }
      if (currentSourceAbortController) {
        currentSourceAbortController.abort();
      }
      if (currentTargetAbortController) {
        currentTargetAbortController.abort();
      }
      if (currentRequestCache) {
        currentRequestCache.clear();
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
          showSearch={showSearch}
          filterOption={() => true}
        />
      </div>
    </>
  );
}
