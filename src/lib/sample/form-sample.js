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
      onFormRequest={(params) => fetchList("/api/options", params)}
      onFormSubmit={(values) => fetchPost("/api/options", values)}
    />
  );
}

export function OptionsFormId({ id, ...props }) {
  return (
    <DrawerForm
      {...props}
      onFormRequest={() => fetchGet(`/api/options/${id}`)}
      onFormSubmit={(values) => fetchPut(`/api/options/${id}`, values)}
      onFormDelete={() => fetchDelete(`/api/options/${id}`)}
    />
  );
}
