"use client";

import { ProCard } from "@ant-design/pro-components";
import { PageContainer } from "@/component/common";
import { useAppContext } from "./provider";

export default function Page() {
  const { optionData } = useAppContext();
  return (
    <PageContainer items={[{ title: "Home", path: "/app" }]} title="Home Page">
      <ProCard split="vertical" boxShadow>
        <ProCard title="Left Card" colSpan="50%">
          This is the left card.
        </ProCard>
        <ProCard title="Right Card" colSpan="50%">
          This is the right card.
        </ProCard>
      </ProCard>

      <ProCard title="Option Data" boxShadow style={{ marginTop: 16 }}>
        {optionData && optionData.length > 0 ? (
          <div>
            {optionData.map((item, index) => (
              <div
                key={index}
                style={{
                  marginBottom: 8,
                  padding: 8,
                  border: "1px solid #f0f0f0",
                  borderRadius: 4,
                }}
              >
                {typeof item === "object"
                  ? JSON.stringify(item, null, 2)
                  : item}
              </div>
            ))}
          </div>
        ) : (
          <div>No option data available</div>
        )}
      </ProCard>
    </PageContainer>
  );
}
