"use client";
import { useEffect } from "react";

export default function BootstrapClient() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.bundle.min.js");
    }
  }, []);

  return null;
}
