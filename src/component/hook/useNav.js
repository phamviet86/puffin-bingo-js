// path: @/component/hook/useNav.js

import { usePathname, useRouter } from "next/navigation";

/**
 * @description Custom hook for handling navigation within the application
 *
 * @returns {Object} Navigation methods
 * @returns {Function} returns.navDetail - Navigate to a detail page
 * @returns {Function} returns.navBack - Navigate back to the parent route
 */
export function useNav() {
  const router = useRouter();
  const currentPath = usePathname();

  const navBack = () => {
    const newPath = currentPath.slice(0, currentPath.lastIndexOf("/"));
    router.push(newPath);
  };

  const navDetail = (id) => {
    if (typeof id !== "string" && typeof id !== "number") {
      throw new Error("Invalid id type. Expected string or number.");
    }
    const newPath = `${currentPath}/${id.toString()}`;
    router.push(newPath);
  };

  return { navBack, navDetail };
}
