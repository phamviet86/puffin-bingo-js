// path: @/component/common/button.js

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button as AntButton } from "antd";
import { useNav } from "@/component/hook";

export function Button({
  label,
  color = "primary",
  variant = "solid",
  ...props
}) {
  return (
    <AntButton {...props} color={color} variant={variant}>
      {label}
    </AntButton>
  );
}

export function DetailButton({ id, ...props }) {
  const pathname = usePathname();

  return (
    <Link href={`${pathname}/${id}`}>
      <Button {...props} />
    </Link>
  );
}

export function BackButton({
  label = "Quay lại",
  color = "default",
  variant = "filled",
  ...props
}) {
  const { navBack } = useNav();

  return (
    <Button
      {...props}
      label={label}
      color={color}
      variant={variant}
      onClick={() => navBack()}
    />
  );
}
