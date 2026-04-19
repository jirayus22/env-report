"use client";

import { PrimeReactProvider, type APIOptions } from "primereact/api";
import React from "react";

// PrimeReact styles
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function Providers({ children }: { children: React.ReactNode }) {
  const value: Partial<APIOptions> = {
    ripple: true,
    inputStyle: "outlined", // ✅ ถูกต้องตาม type
  };

  return <PrimeReactProvider value={value}>{children}</PrimeReactProvider>;
}
