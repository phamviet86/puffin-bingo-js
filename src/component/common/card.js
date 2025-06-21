// path: @/component/common/card.js

import { Grid } from "antd";
import { ProCard } from "@ant-design/pro-components";

const { useBreakpoint } = Grid;

export function ResponsiveCard({ splitAt = "lg", ...props }) {
  const screens = useBreakpoint();
  const splitDirection = screens[splitAt] ? "vertical" : "horizontal";
  return <ProCard {...props} split={splitDirection} />;
}
