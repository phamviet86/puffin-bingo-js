// path: @/component/custom/schedules/schedules-component.js

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

export function SchedulesTable(props) {
  return (
    <ProTable
      {...props}
      onTableRequest={(params, sort, filter) =>
        fetchList("/api/schedules", params, sort, filter)
      }
    />
  );
}

export function SchedulesInfo(props) {
  return <DrawerDescriptions {...props} />;
}

export function SchedulesDesc(props) {
  return (
    <ProDescriptions
      {...props}
      onDescRequest={(params) => fetchGet(`/api/schedules/${params?.id}`)}
    />
  );
}

export function SchedulesFormCreate(props) {
  return (
    <DrawerForm
      {...props}
      onFormSubmit={(values) => fetchPost("/api/schedules", values)}
    />
  );
}

export function SchedulesFormEdit(props) {
  return (
    <DrawerForm
      {...props}
      onFormRequest={(params) => fetchGet(`/api/schedules/${params.id}`)}
      onFormSubmit={(values) => fetchPut(`/api/schedules/${values.id}`, values)}
      // enable if needed
      // onFormDelete={(params) => fetchDelete(`/api/schedules/${params.id}`)}
    />
  );
}
