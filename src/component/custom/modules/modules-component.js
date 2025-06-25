// path: @/component/custom/modules/modules-component.js

import {
  ProTable,
  DrawerForm,
  DrawerDescriptions,
  ProDescriptions,
} from "@/component/common";
import {
  fetchList,
  fetchPost,
  fetchGet,
  fetchPut,
  fetchDelete,
} from "@/lib/util/fetch-util";

export function ModulesTable(props) {
  return (
    <ProTable
      {...props}
      onTableRequest={(params, sort, filter) =>
        fetchList("/api/modules", params, sort, filter)
      }
    />
  );
}

export function ModulesDesc(props) {
  return (
    <ProDescriptions
      {...props}
      onDescRequest={(params) => fetchGet(`/api/modules/${params?.id}`)}
    />
  );
}

export function ModulesInfo(props) {
  return <DrawerDescriptions {...props} />;
}

export function ModulesFormCreate(props) {
  return (
    <DrawerForm
      {...props}
      onFormSubmit={(values) => fetchPost("/api/modules", values)}
    />
  );
}

export function ModulesFormEdit(props) {
  return (
    <DrawerForm
      {...props}
      onFormRequest={(params) => fetchGet(`/api/modules/${params.id}`)}
      onFormSubmit={(values) => fetchPut(`/api/modules/${values.id}`, values)}
      // onFormDelete={(params) => fetchDelete(`/api/modules/${params.id}`)}
    />
  );
}
