"use client";

import Link from "next/link";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import { List, Typography, Breadcrumb, Space, Avatar } from "antd";
import { FolderOutlined, CodeOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function DevDirectoryView({ subFolders, currentPath }) {
  const breadcrumbItems = [
    {
      title: (
        <Space>
          <CodeOutlined />
          <span>Development</span>
        </Space>
      ),
    },
  ];

  const folderListData = subFolders.map((folderName) => ({
    title: folderName,
    href: `/app${currentPath}/${folderName}`,
    avatar: (
      <Avatar
        icon={<FolderOutlined />}
        style={{ backgroundColor: "#1890ff" }}
      />
    ),
    description: `Navigate to ${folderName} directory`,
  }));

  return (
    <PageContainer
      header={{
        title: "Development Directory",
        breadcrumb: {
          items: breadcrumbItems,
        },
        extra: [
          <Text key="path" type="secondary">
            Current Path: <Text code>{currentPath}</Text>
          </Text>,
        ],
      }}
    >
      <ProCard>
        {subFolders.length > 0 ? (
          <>
            <Title level={4} style={{ marginBottom: 16 }}>
              Available Sub-folders ({subFolders.length})
            </Title>
            <List
              itemLayout="horizontal"
              dataSource={folderListData}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Link key="enter" href={item.href}>
                      <Text type="link">Enter →</Text>
                    </Link>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={item.avatar}
                    title={
                      <Link href={item.href}>
                        <Text strong style={{ fontSize: 16 }}>
                          {item.title}
                        </Text>
                      </Link>
                    }
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <FolderOutlined
              style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }}
            />
            <Title level={4} type="secondary">
              No sub-folders found
            </Title>
            <Text type="secondary">
              This directory doesn&apos;t contain any subdirectories.
            </Text>
          </div>
        )}
      </ProCard>
    </PageContainer>
  );
}
