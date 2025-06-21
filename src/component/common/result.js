// path: @/component/common/results.js

import { Result as AntResult } from "antd";

export function Result({
  status = "500",
  title = "500",
  subTitle = "Sorry, something went wrong.",
  ...props
}) {
  return (
    <AntResult {...props} status={status} title={title} subTitle={subTitle} />
  );
}
