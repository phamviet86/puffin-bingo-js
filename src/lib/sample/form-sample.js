// path: @/component/custom/options/options-component.js

import { DrawerForm } from "@/component/common";
import {
  fetchList,
  fetchGet,
  fetchPost,
  fetchPut,
  fetchDelete,
} from "@/lib/util/fetch-util";

export function OptionsForm(props) {
  return (
    <DrawerForm
      {...props}
      formRequest={(params) => fetchList("/api/options", params)}
      formSubmit={(values) => fetchPost("/api/options", values)}
    />
  );
}

export function OptionsFormId({ id, ...props }) {
  return (
    <DrawerForm
      {...props}
      formRequest={() => fetchGet(`/api/options/${id}`)}
      formSubmit={(values) => fetchPut(`/api/options/${id}`, values)}
      formDelete={() => fetchDelete(`/api/options/${id}`)}
    />
  );
}
