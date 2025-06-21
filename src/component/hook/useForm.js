// path: @/component/hook/useForm.js

import { useRef, useState } from "react";

export function useForm() {
  const formRef = useRef();
  const [visible, setVisible] = useState(false);
  const [initialValues, setInitialValues] = useState({});
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
    params,
    setParams,
    title,
    setTitle,
    open,
    close,
  };
}
