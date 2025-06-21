// path: @/component/common/page-container.js

import Link from "next/link";
import { PageContainer as AntPageContainer } from "@ant-design/pro-components";

export function PageContainer({ items = [], title = undefined, ...props }) {
  return (
    <AntPageContainer
      {...props}
      header={{
        breadcrumb: {
          items: items,
          itemRender: (item) =>
            item.path ? <Link href={item.path}>{item.title}</Link> : item.title,
        },
        title,
      }}
    />
  );
}
