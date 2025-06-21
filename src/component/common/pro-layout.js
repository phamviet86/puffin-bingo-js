// path: @/component/common/pro-layout.js

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProLayout as AntProLayout } from "@ant-design/pro-components";
import { LAYOUT_CONFIG } from "@/component/config";

export function ProLayout({ menu = [], ...props }) {
  const pathname = usePathname();

  return (
    <AntProLayout
      {...props}
      {...LAYOUT_CONFIG}
      route={{ path: "/", routes: menu }}
      menuItemRender={(item, dom) => <Link href={item.path}>{dom}</Link>}
      location={{ pathname }}
      selectedKeys={[pathname]}
    />
  );
}
