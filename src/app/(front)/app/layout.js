"use client";

import dynamic from "next/dynamic";
import { LoadingSpin } from "@/component/common";
import { AppProvider } from "./provider";
import { MENU_CONFIG } from "@/component/config";

const ProLayout = dynamic(
  () => import("@/component/common/pro-layout").then((mod) => mod.ProLayout),
  {
    loading: () => <LoadingSpin />,
    ssr: false,
  }
);

export default function Layout({ children }) {
  return (
    <AppProvider>
      <ProLayout menu={MENU_CONFIG}>{children}</ProLayout>
    </AppProvider>
  );
}
