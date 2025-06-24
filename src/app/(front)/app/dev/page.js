import fs from "fs";
import path from "path";
import DevDirectoryView from "./dev-directory-view";

async function getSubFolders() {
  try {
    const basePath = path.join(
      process.cwd(),
      "src",
      "app",
      "(front)",
      "app",
      "dev"
    );

    if (!fs.existsSync(basePath)) {
      return [];
    }

    const items = fs.readdirSync(basePath, { withFileTypes: true });

    const folders = items
      .filter(
        (item) =>
          item.isDirectory() &&
          !item.name.startsWith(".") &&
          !item.name.startsWith("_")
      )
      .map((item) => item.name)
      .sort();

    return folders;
  } catch (error) {
    console.error("Error reading directories:", error);
    return [];
  }
}

export default async function DevPage() {
  const subFolders = await getSubFolders();
  const currentPath = "/dev";

  return <DevDirectoryView subFolders={subFolders} currentPath={currentPath} />;
}
