// path: @/component/common/pro-table.js

import { useCallback } from "react";
import { message } from "antd";
import { ProTable as AntProTable } from "@ant-design/pro-components";
import { TABLE_CONFIG } from "@/component/config";

export function ProTable({
  onTableRequest = undefined,
  onTableRequestError = undefined,
  onTableRequestSuccess = undefined,
  onTableRequestParams = undefined,
  columns = [],
  firstColumns = [],
  lastColumns = [],
  showSearch = true,
  showOptions = false,
  showPagination = true,
  tableHook = {},
  ...props
}) {
  const { tableRef } = tableHook;
  const [messageApi, contextHolder] = message.useMessage();

  // Handlers
  const handleDataRequest = useCallback(
    async (params, sort, filter) => {
      if (!onTableRequest) {
        messageApi.error("Data request handler not provided");
        return false;
      }

      try {
        const result = await onTableRequest(params, sort, filter); // result: { success, message , data: array, total }
        onTableRequestSuccess?.(result);
        return result;
      } catch (error) {
        messageApi.error(error?.message || "Đã xảy ra lỗi");
        onTableRequestError?.(error);
        return false;
      }
    },
    [onTableRequest, onTableRequestSuccess, onTableRequestError, messageApi]
  );

  // Render component
  return (
    <>
      {contextHolder}
      <AntProTable
        {...props}
        actionRef={tableRef}
        columns={[...firstColumns, ...columns, ...lastColumns]}
        request={onTableRequest ? handleDataRequest : undefined}
        params={onTableRequestParams}
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
