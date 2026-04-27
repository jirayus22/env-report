"use client";
import React from "react";
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import { MenuItemOptions } from "primereact/menuitem";
import { Avatar } from "primereact/avatar";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const itemRenderer = (item: MenuItem, options: MenuItemOptions) => {
    return (
      <a
        onClick={() => item.url && router.push(item.url)}
        className={[
          "flex items-center gap-2 text-lg font-medium px-2 py-1 rounded cursor-pointer",
          options.className,
        ].join(" ")}
      >
        <i className={item.icon}></i>
        <span>{item.label}</span>
      </a>
    );
  };

  const items: MenuItem[] = [
    {
      label: "หน้าเเรก",
      icon: "pi pi-home",
      url: "/",
      template: itemRenderer,
    },
    {
      label: "รายงานระบบน้ำเสีย",
      icon: "pi pi-list",
      url: "/water-reports",
      template: itemRenderer,
    },
    {
      label: "คู่มือการใช้งาน",
      icon: "pi pi-book",
      url: "/user-manual",
      template: itemRenderer,
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
      <Menubar
        model={items}
        start={start}
        end={end}
        style={{ backgroundColor: "#55d685", border: "none" }}
      />
    </div>
  );
}
