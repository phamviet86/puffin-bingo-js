// path: @/component/custom/lectures/lectures-component.js

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

export function LecturesTable(props) {
  return (
    <ProTable
      {...props}
      onTableRequest={(params, sort, filter) =>
        fetchList("/api/lectures", params, sort, filter)
      }
    />
  );
}

export function LecturesDesc(props) {
  return (
    <ProDescriptions
      {...props}
      onDescRequest={(params) => fetchGet(`/api/lectures/${params?.id}`)}
    />
  );
}

export function LecturesInfo(props) {
  return <DrawerInfo {...props} />;
}

export function LecturesFormCreate(props) {
  return (
    <DrawerForm
      {...props}
      onFormSubmit={(values) => fetchPost("/api/lectures", values)}
    />
  );
}

export function LecturesFormEdit(props) {
  return (
    <DrawerForm
      {...props}
      onFormRequest={(params) => fetchGet(`/api/lectures/${params.id}`)}
      onFormSubmit={(values) => fetchPut(`/api/lectures/${values.id}`, values)}
      onFormDelete={(params) => fetchDelete(`/api/lectures/${params.id}`)}
    />
  );
}
