// path: @/component/custom/rooms/rooms-component.js

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

export function RoomsTable(props) {
  return (
    <ProTable
      {...props}
      onTableRequest={(params, sort, filter) =>
        fetchList("/api/rooms", params, sort, filter)
      }
    />
  );
}

export function RoomsDesc(props) {
  return (
    <ProDescriptions
      {...props}
      onDescRequest={(params) => fetchGet(`/api/rooms/${params?.id}`)}
    />
  );
}

export function RoomsInfo(props) {
  return <DrawerInfo {...props} />;
}

export function RoomsFormCreate(props) {
  return (
    <DrawerForm
      {...props}
      onFormSubmit={(values) => fetchPost("/api/rooms", values)}
    />
  );
}

export function RoomsFormEdit(props) {
  return (
    <DrawerForm
      {...props}
      onFormRequest={(params) => fetchGet(`/api/rooms/${params.id}`)}
      onFormSubmit={(values) => fetchPut(`/api/rooms/${values.id}`, values)}
      // onFormDelete={(params) => fetchDelete(`/api/rooms/${params.id}`)}
    />
  );
}
