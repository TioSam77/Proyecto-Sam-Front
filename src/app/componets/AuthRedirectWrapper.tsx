'use client';

import { ReactNode } from "react";
import useRoleRedirect from "../hooks/useRoleRedirect";

export default function AuthRedirectWrapper({ children }: { children: ReactNode }) {
  useRoleRedirect();
  return <>{children}</>;
}
