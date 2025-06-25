// path: @/component/custom/courses/courses-component.js

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

export function CoursesTable(props) {
  return (
    <ProTable
      {...props}
      onTableRequest={(params, sort, filter) =>
        fetchList("/api/courses", params, sort, filter)
      }
    />
  );
}

export function CoursesInfo(props) {
  return <DrawerDescriptions {...props} />;
}

export function CoursesDesc(props) {
  return (
    <ProDescriptions
      {...props}
      onDescRequest={(params) => fetchGet(`/api/courses/${params?.id}`)}
    />
  );
}

export function CoursesFormCreate(props) {
  return (
    <DrawerForm
      {...props}
      onFormSubmit={(values) => fetchPost("/api/courses", values)}
    />
  );
}

export function CoursesFormEdit(props) {
  return (
    <DrawerForm
      {...props}
      onFormRequest={(params) => fetchGet(`/api/courses/${params.id}`)}
      onFormSubmit={(values) => fetchPut(`/api/courses/${values.id}`, values)}
      // enable if needed
      // onFormDelete={(params) => fetchDelete(`/api/courses/${params.id}`)}
    />
  );
}
