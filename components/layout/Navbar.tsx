"use client";
import React from "react";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { MenuItem } from "primereact/menuitem";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const itemRenderer = (item: MenuItem) => (
    <a className="flex align-items-center p-menuitem-link">
      <span className={item.icon} />
      <span className="mx-2">{item.label}</span>
      {item.badge && <Badge className="ml-auto" value={item.badge} />}
      {item.shortcut && (
        <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
          {item.shortcut}
        </span>
      )}
    </a>
  );
  const items: MenuItem[] = [
    {
      label: "รายงานระบบน้ำเสีย",
      icon: "pi pi-home",
      url: "/water-report",
    },
  ];

  const start = (
    <img
      alt="logo"
      src="/images/logo.png"
      height="70"
      width="70"
      className="mr-2"
      onClick={() => router.push("/")}
    />
  );
  const end = (
    <div className="flex align-items-center gap-2">
      <Avatar
        image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
        shape="circle"
      />
    </div>
  );

  return (
    <div className="card">
      <Menubar model={items} start={start} end={end} />
    </div>
  );
}
