"use client";

import "antd/dist/reset.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "@/component/common";
import Head from "next/head";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>Bingo English</title>
        <meta name="description" content="Bingo learning management system" />
      </Head>
      <body>
        <AntdRegistry>
          <ConfigProvider>{children}</ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
