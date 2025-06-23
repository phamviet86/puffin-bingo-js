// path: @/component/common/drawer-form.js

import { useCallback } from "react";
import { message, Popconfirm } from "antd";
import { DrawerForm as AntDrawerForm } from "@ant-design/pro-components";
import { Button } from "@/component/common";
import { FORM_CONFIG, DRAWER_CONFIG } from "@/component/config";
import { DeleteOutlined } from "@ant-design/icons";

export function DrawerForm({
  fields = null,
  onFormRequest = undefined,
  onFormRequestError = undefined,
  onFormRequestSuccess = undefined,
  onFormSubmit = undefined,
  onFormSubmitError = undefined,
  onFormSubmitSuccess = undefined,
  onFormDelete = undefined,
  onFormDeleteError = undefined,
  onFormDeleteSuccess = undefined,
  formHook = {},
  ...props
}) {
  const { formRef, visible, setVisible } = formHook;
  const [messageApi, contextHolder] = message.useMessage();

  // Handlers
  const handleDataRequest = useCallback(
    async (params) => {
      if (!onFormRequest) {
        messageApi.error("Data request handler not provided");
        return false;
      }

      try {
        const result = await onFormRequest(params);
        // result: { success, message, data: array }
        onFormRequestSuccess?.(result);
        return result.data[0] || {};
      } catch (error) {
        messageApi.error(error.message || "Đã xảy ra lỗi");
        onFormRequestError?.(error);
        return false;
      }
    },
    [onFormRequest, onFormRequestSuccess, onFormRequestError, messageApi]
  );

  const handleDataSubmit = useCallback(
    async (values) => {
      if (!onFormSubmit) {
        messageApi.error("Data submit handler not provided");
        return false;
      }
      if (!values) return false;

      try {
        const result = await onFormSubmit(values);
        // result: { success, message, data: array }
        messageApi.success(result.message);
        onFormSubmitSuccess?.(result);
        return true;
      } catch (error) {
        messageApi.error(error.message || "Đã xảy ra lỗi");
        onFormSubmitError?.(error);
        return false;
      }
    },
    [onFormSubmit, onFormSubmitSuccess, onFormSubmitError, messageApi]
  );

  const handleDataDelete = useCallback(async () => {
    if (!onFormDelete) {
      messageApi.error("Data delete handler not provided");
      return false;
    }

    try {
      const result = await onFormDelete();
      // result: { success, message, data: array }
      messageApi.success(result.message);
      onFormDeleteSuccess?.(result);
      return true;
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
      onFormDeleteError?.(error);
      return false;
    }
  }, [onFormDelete, onFormDeleteSuccess, onFormDeleteError, messageApi]);

  // Render component
  return (
    <>
      {contextHolder}
      <AntDrawerForm
        {...props}
        {...FORM_CONFIG}
        formRef={formRef}
        request={onFormRequest ? handleDataRequest : undefined}
        onFinish={onFormSubmit ? handleDataSubmit : undefined}
        open={visible}
        onOpenChange={setVisible}
        drawerProps={DRAWER_CONFIG}
        submitter={{
          render: (_, defaultDoms) => {
            return [
              onFormDelete ? (
                <Popconfirm
                  key="delete-button"
                  title="Xác nhận xóa?"
                  description="Bạn có chắc chắn muốn xóa?"
                  onConfirm={handleDataDelete}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button
                    color="danger"
                    variant="solid"
                    label="Xoá"
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              ) : (
                []
              ),
              ...defaultDoms,
            ];
          },
        }}
      >
        {fields}
      </AntDrawerForm>
    </>
  );
}
