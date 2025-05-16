"use client"
import React, { useEffect } from 'react'
  
export default function BootstrapClient() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }
  }, []);
  return null;
}
