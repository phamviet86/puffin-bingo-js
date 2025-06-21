// path: @/component/config/table-config.js

export const TABLE_CONFIG = {
  pagination: {
    defaultPageSize: 12,
    showSizeChanger: true,
    pageSizeOptions: ["12", "24", "48", "96", "192"],
    hideOnSinglePage: false,
    responsive: true,
    showLessItems: true,
    showQuickJumper: false,
  },
  search: { labelWidth: "auto", filterType: "light" },
  options: {
    reload: true,
    fullScreen: false,
    density: false,
    setting: false,
  },
};
