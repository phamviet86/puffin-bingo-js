// path: @/component/hook/useTransfer.js

import { useState } from "react";

export function useTransfer() {
  const [sourceParams, setSourceParams] = useState({});
  const [targetParams, setTargetParams] = useState({});
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");

  const open = () => {
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
    setSourceParams({});
    setTargetParams({});
    setTitle("");
  };

  return {
    sourceParams,
    setSourceParams,
    targetParams,
    setTargetParams,
    title,
    setTitle,
    visible,
    open,
    close,
  };
}
