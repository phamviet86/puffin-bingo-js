// path: @/component/common/drawer-descriptions.js

import { Drawer } from "antd";
import { ProDescriptions } from "./pro-descriptions";
import { DRAWER_CONFIG } from "@/component/config";

export function DrawerDescriptions({
  infoHook = {},
  drawerProps = {},
  column = 1,
  ...descProps
}) {
  const { infoRef, visible, close } = infoHook;

  return (
    <>
      <Drawer
        {...drawerProps}
        {...DRAWER_CONFIG}
        open={visible}
        onClose={close}
      >
        <ProDescriptions {...descProps} actionRef={infoRef} column={column} />
      </Drawer>
    </>
  );
}
