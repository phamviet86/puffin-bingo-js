import { ProTable, DrawerForm, DrawerInfo } from "@/component/common";
import { fetchList, fetchPost } from "@/lib/util/fetch-util";

export function OptionsTable(props) {
  return (
    <ProTable
      {...props}
      onTableRequest={(params, sort, filter) =>
        fetchList("/api/options", params, sort, filter)
      }
    />
  );
}

export function OptionsForm(props) {
  return (
    <DrawerForm
      {...props}
      onFormSubmit={(values) => fetchPost("/api/options", values)}
    />
  );
}

export function OptionsInfo(props) {
  return <DrawerInfo {...props} />;
}
