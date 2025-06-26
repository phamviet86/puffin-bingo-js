// path: @/component/common/table-transfer.js

import React from "react";
import { Transfer } from "./transfer";
import { ProTable } from "./pro-table";

export function TableTransfer({
  leftColumns = [],
  rightColumns = [],
  onLeftTableRequest = undefined,
  onLeftTableRequestParams = undefined,
  onLeftTableRequestSuccess = undefined,
  onLeftTableRequestError = undefined,
  onRightTableRequest = undefined,
  onRightTableRequestParams = undefined,
  onRightTableRequestSuccess = undefined,
  onRightTableRequestError = undefined,
  ...props
}) {
  return (
    <Transfer {...props} render={undefined}>
      {({
        direction,
        filteredItems,
        onItemSelect,
        onItemSelectAll,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
        const isLeft = direction === "left";
        const columns = isLeft ? leftColumns : rightColumns;
        // Chọn các props request phù hợp với panel
        const onTableRequest = isLeft
          ? onLeftTableRequest
          : onRightTableRequest;
        const onTableRequestParams = isLeft
          ? onLeftTableRequestParams
          : onRightTableRequestParams;
        const onTableRequestSuccess = isLeft
          ? onLeftTableRequestSuccess
          : onRightTableRequestSuccess;
        const onTableRequestError = isLeft
          ? onLeftTableRequestError
          : onRightTableRequestError;
        const rowSelection = {
          getCheckboxProps: () => ({ disabled: listDisabled }),
          onChange(selectedRowKeys) {
            onItemSelectAll(selectedRowKeys, "replace");
          },
          selectedRowKeys: listSelectedKeys,
          selections: false,
        };
        return (
          <ProTable
            columns={columns}
            dataSource={filteredItems}
            rowSelection={rowSelection}
            size="small"
            pagination={false}
            onRow={({ key, disabled: itemDisabled }) => ({
              onClick: () => {
                if (itemDisabled || listDisabled) return;
                onItemSelect(key, !listSelectedKeys.includes(key));
              },
            })}
            bordered
            ghost
            // Thêm các props để enable search/filter
            onTableRequest={onTableRequest}
            onTableRequestParams={onTableRequestParams}
            onTableRequestSuccess={onTableRequestSuccess}
            onTableRequestError={onTableRequestError}
            // showSearch={false}
          />
        );
      }}
    </Transfer>
  );
}
