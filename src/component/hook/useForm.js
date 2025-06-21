// path: @/component/hook/useForm.js

import { useRef, useState } from "react";

export function useForm() {
  const formRef = useRef();
  const [visible, setVisible] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [id, setId] = useState(null);
  const [params, setParams] = useState({});
  const [title, setTitle] = useState("");

  const open = () => {
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
    setInitialValues({});
    setParams({});
    setTitle("");
    setId(null);
  };

  const reset = () => {
    if (formRef.current) {
      formRef.current.resetFields();
    }
  };

  return {
    formRef,
    reset,
    visible,
    setVisible,
    initialValues,
    setInitialValues,
    id,
    setId,
    params,
    setParams,
    title,
    setTitle,
    open,
    close,
  };
}
