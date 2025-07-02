// path: @/component/hook/useForm.js

import { useRef, useState } from "react";

export function useForm() {
  const formRef = useRef();
  const [params, setParams] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [title, setTitle] = useState("");
  const [visible, setVisible] = useState(false);

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
    params,
    setParams,
    initialValues,
    setInitialValues,
    title,
    setTitle,
    visible,
    setVisible,
    open,
    close,
  };
}
