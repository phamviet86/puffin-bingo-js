// path: @/component/common/drawer-descriptions.js

import { Drawer } from "antd";
import { ProDescriptions } from "./pro-descriptions";
import { DRAWER_CONFIG } from "@/component/config";

export function DrawerDescriptions({
  infoHook = {},
  drawerProps = {},
  column = 1,
  bordered = true,
  size = "small",
  ...descProps
}) {
  const { infoRef, visible, close } = infoHook;

  if (!visible) return null;

  return (
    <>
      <Drawer
        {...drawerProps}
        {...DRAWER_CONFIG}
        open={visible}
        onClose={close}
      >
        <ProDescriptions
          {...descProps}
          actionRef={infoRef}
          column={column}
          bordered={bordered}
          size={size}
        />
      </Drawer>
    </>
  );
}
