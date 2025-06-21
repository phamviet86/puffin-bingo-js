// path: @/component/hook/useDesc.js

import { useRef, useState } from "react";

export function useDesc() {
  const descRef = useRef();
  const [dataSource, setDataSource] = useState({});

  const reload = () => {
    if (descRef.current) {
      descRef.current.reload();
    }
  };

  return {
    descRef,
    reload,
    dataSource,
    setDataSource,
  };
}
