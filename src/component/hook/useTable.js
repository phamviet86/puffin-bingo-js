// path: @/component/hook/useTable.js

import { useRef, useState } from "react";

export function useTable() {
  const tableRef = useRef();
  const [dataSource, setDataSource] = useState({});
  const [params, setParams] = useState({});

  const reload = () => {
    if (tableRef.current) {
      tableRef.current.reload();
    }
  };

  return {
    tableRef,
    reload,
    dataSource,
    setDataSource,
    params,
    setParams,
  };
}
