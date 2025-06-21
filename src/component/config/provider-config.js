// path: @/component/common/config-provider.js

import viVN from "antd/locale/vi_VN";

export const PROVIDER_CONFIG = {
  locale: viVN,
  theme: {
    components: {
      Button: { fontWeight: 500 },
      Form: {
        labelColor: "rgba(0, 0, 0, 0.56)",
      },
      Drawer: {},
      Badge: { statusSize: 8 },
      Segmented: {
        itemSelectedBg: "#1677ff",
        itemSelectedColor: "#ffffff",
      },
      List: {},
      Card: { bodyPaddingSM: 4 },
    },
    token: {},
  },
  form: {
    validateMessages: {
      required: "Thông tin bắt buộc",
    },
  },
};
