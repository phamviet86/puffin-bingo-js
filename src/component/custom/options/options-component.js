// path: @/component/custom/options/options-component.js

import {
  ProTable,
  DrawerForm,
  DrawerDescriptions,
  ProDescriptions,
} from "@/component/common";
import {
  fetchList,
  fetchGet,
  fetchPost,
  fetchPut,
  fetchDelete,
} from "@/lib/util/fetch-util";

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

export function OptionsInfo(props) {
  return <DrawerDescriptions {...props} />;
}

export function OptionsDesc(props) {
  return (
    <ProDescriptions
      {...props}
      onDescRequest={(params) => fetchGet(`/api/options/${params?.id}`)}
    />
  );
}

export function OptionsFormCreate(props) {
  return (
    <DrawerForm
      {...props}
      onFormSubmit={(values) => fetchPost("/api/options", values)}
    />
  );
}

export function OptionsFormEdit(props) {
  return (
    <DrawerForm
      {...props}
      onFormRequest={(params) => fetchGet(`/api/options/${params.id}`)}
      onFormSubmit={(values) => fetchPut(`/api/options/${values.id}`, values)}
      // onFormDelete={(params) => fetchDelete(`/api/options/${params.id}`)}
    />
  );
}
