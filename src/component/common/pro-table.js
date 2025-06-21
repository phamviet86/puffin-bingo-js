// path: @/component/common/pro-table.js

import { useCallback } from "react";
import { message } from "antd";
import { ProTable as AntProTable } from "@ant-design/pro-components";
import { TABLE_CONFIG } from "@/component/config";

export function ProTable({
  tableRequest = undefined,
  tableRequestError = undefined,
  tableRequestSuccess = undefined,
  onRowsSelect = undefined,
  onRowsSelectError = undefined,
  onRowClick = undefined,
  onRowClickError = undefined,
  columns = [],
  leftColumns = [],
  rightColumns = [],
  showSearch = true,
  showOptions = false,
  showPagination = true,
  selectType = "checkbox",
  tableHook = {},
  ...props
}) {
  const { tableRef, setParams } = tableHook;
  const [messageApi, contextHolder] = message.useMessage();

  // Handlers
  const handleDataRequest = useCallback(
    async (params, sort, filter) => {
      if (!tableRequest) {
        messageApi.error("Data request handler not provided");
        return false;
      }

      try {
        const result = await tableRequest(params, sort, filter);
        // result: { success, message , data: array, total }
        setParams(params);
        tableRequestSuccess?.(result);
        return result;
      } catch (error) {
        messageApi.error(error?.message || "Đã xảy ra lỗi");
        tableRequestError?.(error);
        return false;
      }
    },
    [
      tableRequest,
      tableRequestSuccess,
      tableRequestError,
      messageApi,
      setParams,
    ]
  );

  const handleRowsSelect = useCallback(
    (_, selectedRowsData) => {
      if (!onRowsSelect) return true;

      try {
        onRowsSelect(selectedRowsData);
        return true;
      } catch (error) {
        messageApi.error(error?.message || "Đã xảy ra lỗi");
        onRowsSelectError?.(error);
        return false;
      }
    },
    [onRowsSelect, onRowsSelectError, messageApi]
  );

  const handleRowClick = useCallback(
    (rowRecord) => {
      if (!onRowClick) return true;

      try {
        onRowClick(rowRecord);
        return true;
      } catch (error) {
        messageApi.error(error?.message || "Đã xảy ra lỗi");
        onRowClickError?.(error);
        return false;
      }
    },
    [onRowClick, onRowClickError, messageApi]
  );

  // Render component
  return (
    <>
      {contextHolder}
      <AntProTable
        {...props}
        actionRef={tableRef}
        columns={[...leftColumns, ...columns, ...rightColumns]}
        request={tableRequest ? handleDataRequest : undefined}
        rowSelection={
          onRowsSelect
            ? { type: selectType, onChange: handleRowsSelect }
            : undefined
        }
        onRow={
          onRowClick
            ? (record) => ({ onClick: () => handleRowClick(record) })
            : undefined
        }
        search={showSearch ? TABLE_CONFIG.search : false}
        pagination={showPagination ? TABLE_CONFIG.pagination : false}
        options={showOptions ? TABLE_CONFIG.options : false}
        tableAlertRender={false}
        rowKey="id"
        bordered
        ghost
      />
    </>
  );
}
