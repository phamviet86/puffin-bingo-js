// path: @/component/custom/syllabuses/syllabuses-component.js

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

export function SyllabusesTable(props) {
  return (
    <ProTable
      {...props}
      onTableRequest={(params, sort, filter) =>
        fetchList("/api/syllabuses", params, sort, filter)
      }
    />
  );
}

export function SyllabusesDesc(props) {
  return (
    <ProDescriptions
      {...props}
      onDescRequest={(params) => fetchGet(`/api/syllabuses/${params?.id}`)}
    />
  );
}

export function SyllabusesInfo(props) {
  return <DrawerInfo {...props} />;
}

export function SyllabusesFormCreate(props) {
  return (
    <DrawerForm
      {...props}
      onFormSubmit={(values) => fetchPost("/api/syllabuses", values)}
    />
  );
}

export function SyllabusesFormEdit(props) {
  return (
    <DrawerForm
      {...props}
      onFormRequest={(params) => fetchGet(`/api/syllabuses/${params.id}`)}
      onFormSubmit={(values) =>
        fetchPut(`/api/syllabuses/${values.id}`, values)
      }
      onFormDelete={(params) => fetchDelete(`/api/syllabuses/${params.id}`)}
    />
  );
}
