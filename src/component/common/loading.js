// path: @/component/common/loading.js

import { Flex, Spin } from "antd";

export function LoadingSpin() {
  return (
    <Flex justify="center" align="center" style={{ height: "100vh" }}>
      <Spin size="large" />
    </Flex>
  );
}
