// path: @/component/config/layout-config.js

export const LAYOUT_CONFIG = {
  title: "Bingo English",
  logo: "/globe.svg",
  token: {
    layout: {},
    sider: {
      colorTextMenuSelected: "#1890ff", // 1 - blue 6
      // colorTextMenuActive: "#096dd9", // 0.85 - blue 7 // when clicking
      // colorTextMenuItemHover: "#40a9ff", // 0.75 - blue 5
      colorBgMenuItemSelected: "#e6f4ff", // 0.04 - blue 1
      // colorBgMenuItemActive: "#bae7ff", // 0.15 - blue 2 // when clicking
      // colorBgMenuItemHover: "#e6f7ff", // 0.03 - blue 1
    },
    header: {},
    pageContainer: {
      paddingBlockPageContainerContent: 24, //  top; default: 24
      paddingInlinePageContainerContent: 24, // left and right; default: 40
    },
  },
  breakpoint: false,
  defaultCollapsed: true,
};
