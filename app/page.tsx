"use client";

import { Card } from "primereact/card";
import PiechartDay from "../components/graph/PiechartDay";
import PiechartWeek from "../components/graph/PiechartWeek";
import PiechartMonth from "../components/graph/PiechartMonth";
export default function Home() {
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
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ✅ Card 1 (ใส่ Chart) */}
        <Card
          title="รายงานระบบน้ำเสียรายวัน"
          subTitle={`ประจำวันที่ ${getDayThai()}`}
          style={{ backgroundColor: "#ededed3f", border: "none" }}
        >
          <PiechartDay />
        </Card>

        {/* Card 2 */}
        <Card
          title="รายงานระบบน้ำเสียรายสัปดาห์"
          subTitle="รายสัปดาห์"
          style={{ backgroundColor: "#ededed3f", border: "none" }}
        >
          <PiechartWeek />
        </Card>

        {/* Card 3 */}
        <Card
          title="รายงานระบบน้ำเสียรายเดือน"
          subTitle={`ประจำเดือน ${getDayThai("month")}`}
          style={{ backgroundColor: "#ededed3f", border: "none" }}
        >
          <PiechartMonth />
        </Card>
      </div>

      {/* Bottom Card */}
      {/* <div className="pt-10">
        <Card
          title="Extra Card"
          subTitle="Summary"
          style={{ backgroundColor: "#eaeaea", border: "none" }}
        >
          <p className="m-0">This is another card below the grid.</p>
        </Card>
      </div> */}
    </div>
  );
}
