import { ProTable, DrawerForm, DrawerInfo } from "@/component/common";
import { fetchList, fetchPost } from "@/lib/util/fetch-util";

export function OptionsTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/options", params, sort, filter)
      }
    />
  );
}

export function OptionsForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/options", values)}
    />
  );
}

export function OptionsInfo(props) {
  return <DrawerInfo {...props} />;
}
