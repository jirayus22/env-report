"use client";
import React, { useState } from "react";
import { Card } from "primereact/card";
import PiechartDay from "../components/graph/PiechartDay";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
export default function Home() {
  const [period, setPeriod] = useState<string | null>(null);
  const periodOptions = [
    { label: "รายวัน", value: "day" },
    { label: "รายเดือน", value: "month" },
    { label: "รายปี", value: "year" },
  ];
  const getDayThai = (type: "full" | "month" = "full") => {
    const d = new Date();

    const months = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];

    if (type === "month") {
      return months[d.getMonth()];
    }

    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
  };

  return (
    <div className="p-4 pt-0">
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card
          title="รายงานระบบน้ำเสียรายวัน"
          subTitle={`ประจำวันที่ ${getDayThai()}`}
          style={{ backgroundColor: "#ededed3f", border: "none" }}
        >
          <PiechartDay />
        </Card>

        <Card
          title="รายงานระบบน้ำเสียรายสัปดาห์"
          subTitle="รายสัปดาห์"
          style={{ backgroundColor: "#ededed3f", border: "none" }}
        >
          <PiechartWeek />
        </Card>

        <Card
          title="รายงานระบบน้ำเสียรายเดือน"
          subTitle={`ประจำเดือน ${getDayThai("month")}`}
          style={{ backgroundColor: "#ededed3f", border: "none" }}
        >
          <PiechartMonth />
        </Card>
      </div> */}

      <h1 className="text-4xl font-bold text-center">
        Dashboard : รายงานระบบน้ำเสีย
      </h1>
      <div className="flex-1 pt-3 text-center">
        <Dropdown
          value={period}
          onChange={(e: DropdownChangeEvent) => {
            console.log("Selected period:", e.value);
            setPeriod(e.value);
          }}
          options={periodOptions}
          placeholder="เลือกช่วงเวลา"
          showClear
        />
      </div>
      <div className="pt-3">
        <Card style={{ backgroundColor: "#ededed3f", border: "none" }}>
          <PiechartDay />
        </Card>
      </div>
    </div>
  );
}
