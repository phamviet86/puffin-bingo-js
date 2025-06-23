// path: @/component/custom/modules/modules-component.js

import {
  ProTable,
  DrawerForm,
  DrawerInfo,
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
  return <DrawerInfo {...props} />;
}

export function ModulesFormCreate(props) {
  return (
    <DrawerForm
      {...props}
      onFormSubmit={(values) => fetchPost("/api/modules", values)}
    />
  );
}

export function ModulesFormEdit({ id, ...props }) {
  return (
    <DrawerForm
      {...props}
      onFormRequest={() => fetchGet(`/api/modules/${id}`)}
      onFormSubmit={(values) => fetchPut(`/api/modules/${id}`, values)}
      onFormDelete={() => fetchDelete(`/api/modules/${id}`)}
    />
  );
}
