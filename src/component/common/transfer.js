// path: @/component/common/transfer.js

import { useState, useEffect, useCallback, useRef, use } from "react";
import { Transfer as AntTransfer, message, Spin } from "antd";
import { convertTransferItems } from "@/lib/util/convert-util";
import styles from "./transfer.module.css";

const buildSearchParams = (columns, value) => {
  if (!columns.length || !value?.trim()) {
    return {};
  }

  if (columns.length === 1) {
    return { [columns[0]]: value.trim() };
  } else {
    const or = {};
    columns.forEach((key) => {
      or[key] = value.trim();
    });
    return { or };
  }
};

export function Transfer({
  onSourceRequest = undefined,
  onSourceParams = undefined,
  onSourceItem = undefined,
  onTargetRequest = undefined,
  onTargetParams = undefined,
  onTargetItem = undefined,
  onTargetAdd = undefined,
  onTargetRemove = undefined,
  showSearch = false,
  searchSourceColumns = [],
  searchTargetColumns = [],
  listStyle = { width: "100%", height: "100%", minHeight: "300px" },
  rowKey = (record) => record.key,
  render = (record) => record.key,
  responsiveBreakpoint = "md",
  ...props
}) {
  const [messageApi, contextHolder] = message.useMessage();
  const [dataSource, setDataSource] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  // Dữ liệu request từ server
  const [sourceRequestData, setSourceRequestData] = useState([]);
  const [targetRequestData, setTargetRequestData] = useState([]);
  const [sourceSearchKeys, setSourceSearchKeys] = useState([]);
  const [targetSearchKeys, setTargetSearchKeys] = useState([]);
  // Loading state
  const [loading, setLoading] = useState(true);

  const handleData = useCallback(() => {
    // Lấy key theo thứ tự
    const sourceKeys = sourceRequestData.map((item) => item.key);
    const targetKeys = targetRequestData.map((item) => item.key);

    setTargetKeys(targetKeys);

    // Tạo lookup map
    const targetMap = new Map(
      targetRequestData.map((item) => [item.key, item])
    );
    const sourceMap = new Map(
      sourceRequestData.map((item) => [item.key, item])
    );

    // Duyệt theo thứ tự source, ưu tiên dữ liệu ở target
    const mergedData = sourceKeys.map((key) =>
      targetMap.has(key) ? targetMap.get(key) : sourceMap.get(key)
    );

    setDataSource(mergedData);
  }, [sourceRequestData, targetRequestData]);

  useEffect(() => {
    handleData();
  }, [handleData]);

  const handleSourceRequest = useCallback(async () => {
    setLoading(true);
    if (!onSourceRequest) {
      messageApi.error("Source data request handler not provided");
      setLoading(false);
      return;
    }

    try {
      const sourceResult = await onSourceRequest(onSourceParams);
      const sourceData = onSourceItem
        ? convertTransferItems(sourceResult.data || [], onSourceItem)
        : sourceResult.data || [];

      setSourceRequestData(sourceData);
      setLoading(false);
      return;
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi khi tải dữ liệu source");
      setLoading(false);
      return;
    }
  }, [onSourceRequest, onSourceParams, onSourceItem, messageApi]);

  const handleTargetRequest = useCallback(async () => {
    setLoading(true);
    if (!onTargetRequest) {
      messageApi.error("Target data request handler not provided");
      setLoading(false);
      return;
    }

    try {
      const targetResult = await onTargetRequest(onTargetParams);
      const targetData = onTargetItem
        ? convertTransferItems(targetResult.data || [], onTargetItem)
        : targetResult.data || [];

      setTargetRequestData(targetData);
      setLoading(false);
      return;
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi khi tải dữ liệu source");
      setLoading(false);
      return;
    }
  }, [onTargetRequest, onTargetParams, onTargetItem, messageApi]);

  const reloadDataRef = useRef();

  const reloadData = useCallback(async () => {
    // Tải lại target trước
    await handleTargetRequest();
    // Sau khi target đã xong, tải lại source
    await handleSourceRequest();
  }, [handleTargetRequest, handleSourceRequest]);

  // Đảm bảo luôn cập nhật ref tới hàm reloadData mới nhất
  reloadDataRef.current = reloadData;

  // Khi mount: tải lại dữ liệu
  useEffect(() => {
    setLoading(true);
    reloadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Khi add/remove item: reload lại data (gọi reloadDataRef)
  const handleTargetAdd = useCallback(
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
        }
      } catch (error) {
        messageApi.error(error.message || "Đã xảy ra lỗi");
        return;
      }
    },
    [onTargetAdd, messageApi]
  );

  const handleTargetRemove = useCallback(
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
        }
      } catch (error) {
        messageApi.error(error.message || "Đã xảy ra lỗi");
        return;
      }
    },
    [onTargetRemove, messageApi]
  );

  // Khi chuyển record (sang phải/trái)
  const handleChange = useCallback(
    async (_, direction, moveKeys) => {
      if (direction === "right") {
        await handleTargetAdd(moveKeys);
      } else {
        await handleTargetRemove(moveKeys);
      }
    },
    [handleTargetAdd, handleTargetRemove]
  );

  const handleSourceSearch = useCallback(
    async (searchValue) => {
      if (!searchValue?.trim()) {
        setSourceSearchKeys([]);
        return;
      }
      if (!onSourceRequest) {
        messageApi.error("Source data request handler not provided");
        return;
      }

      setLoading(true);
      const searchParams = buildSearchParams(searchSourceColumns, searchValue);

      try {
        const searchResult = await onSourceRequest({
          ...onSourceParams,
          ...searchParams,
        });
        const sourceData = onSourceItem
          ? convertTransferItems(searchResult.data || [], onSourceItem)
          : searchResult.data || [];

        setSourceSearchKeys(sourceData.map((item) => item.key));
        setLoading(false);
        return;
      } catch (error) {
        messageApi.error(
          error.message || "Đã xảy ra lỗi khi tải dữ liệu source"
        );
        setLoading(false);
        return;
      }
    },
    [
      onSourceRequest,
      onSourceParams,
      onSourceItem,
      messageApi,
      searchSourceColumns,
    ]
  );

  const handleTargetSearch = useCallback(
    async (searchValue) => {
      if (!searchValue?.trim()) {
        setTargetSearchKeys([]);
        return;
      }

      if (!onTargetRequest) {
        messageApi.error("Target data request handler not provided");
        return;
      }

      setLoading(true);
      const searchParams = buildSearchParams(searchTargetColumns, searchValue);

      try {
        const searchResult = await onTargetRequest({
          ...onTargetParams,
          ...searchParams,
        });
        const targetData = onTargetItem
          ? convertTransferItems(searchResult.data || [], onTargetItem)
          : searchResult.data || [];

        setTargetSearchKeys(targetData.map((item) => item.key));
        setLoading(false);
        return;
      } catch (error) {
        messageApi.error(
          error.message || "Đã xảy ra lỗi khi tải dữ liệu target"
        );
        setLoading(false);
        return;
      }
    },
    [
      onTargetRequest,
      onTargetParams,
      onTargetItem,
      messageApi,
      searchTargetColumns,
    ]
  );

  // Search timeout ref for debouncing
  const searchTimeoutRef = useRef();

  const handleSearch = useCallback(
    (direction, value) => {
      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      // Set new timeout with 300ms delay
      searchTimeoutRef.current = setTimeout(() => {
        if (direction === "left") {
          handleSourceSearch(value);
        } else {
          handleTargetSearch(value);
        }
      }, 300);
    },
    [handleSourceSearch, handleTargetSearch]
  );

  const handleFilter = useCallback(
    (_, option, direction) => {
      if (direction === "left") {
        return sourceSearchKeys.includes(option.key);
      }
      if (direction === "right") {
        return targetSearchKeys.includes(option.key);
      }
      return false;
    },
    [sourceSearchKeys, targetSearchKeys]
  );
  return (
    <>
      {contextHolder}
      <Spin spinning={loading} tip="Đang tải dữ liệu..." delay={500}>
        <div
          className={`${styles.remoteTransfer} ${
            styles[`responsive-${responsiveBreakpoint}`]
          }`}
        >
          <AntTransfer
            {...props}
            direction="vertical"
            dataSource={dataSource}
            targetKeys={targetKeys}
            onChange={handleChange}
            onSearch={handleSearch}
            rowKey={rowKey}
            render={render}
            listStyle={listStyle}
            showSearch={showSearch}
            filterOption={handleFilter}
          />
        </div>
      </Spin>
    </>
  );
}
