// path: @/component/common/config-provider.js

"use client";

import "@ant-design/v5-patch-for-react-19";
import { ConfigProvider as AntdConfigProvider } from "antd";
import { PROVIDER_CONFIG } from "@/component/config";

export function ConfigProvider({ children, ...props }) {
  return (
    <AntdConfigProvider {...props} {...PROVIDER_CONFIG}>
      {children}
    </AntdConfigProvider>
  );
}
