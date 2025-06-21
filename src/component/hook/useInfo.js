// path: @/component/hook/useInfo.js

import { useRef, useState } from "react";

export function useInfo() {
  const infoRef = useRef();
  const [dataSource, setDataSource] = useState({});
  const [params, setParams] = useState({});
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");

  const open = () => {
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
    setDataSource({});
    setParams({});
    setTitle("");
  };

  const reload = () => {
    if (infoRef.current) {
      infoRef.current.reload();
    }
  };

  return {
    infoRef,
    reload,
    dataSource,
    setDataSource,
    params,
    setParams,
    visible,
    title,
    setTitle,
    open,
    close,
  };
}
