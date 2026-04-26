"use client";

import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { useMemo } from "react";

export default function Home() {
  const chartData = useMemo(() => {
    return {
      labels: ["A", "B", "C"],
      datasets: [
        {
          data: [540, 325, 702],
          backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
          hoverBackgroundColor: ["#64B5F6", "#81C784", "#FFB74D"],
        },
      ],
    };
  }, []);

  const chartOptions = useMemo(() => {
    return {
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
          },
        },
      },
    };
  }, []);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ✅ Card 1 (ใส่ Chart) */}
        <Card
          title="รายงานระบบน้ำเสียรายวัน"
          subTitle="Statistics"
          style={{ backgroundColor: "#eaeaea", border: "none" }}
        >
          <Chart
            type="pie"
            data={chartData}
            options={chartOptions}
            className="w-full"
          />
        </Card>

        {/* Card 2 */}
        <Card
          title="Card 2"
          subTitle="Details"
          style={{ backgroundColor: "#eaeaea", border: "none" }}
        >
          <p className="m-0">Repellat libero asperiores earum nam nobis...</p>
        </Card>

        {/* Card 3 */}
        <Card
          title="Card 3"
          subTitle="Summary"
          style={{ backgroundColor: "#eaeaea", border: "none" }}
        >
          <p className="m-0">
            Consequuntur error repudiandae numquam deserunt...
          </p>
        </Card>
      </div>

      {/* Bottom Card */}
      <div className="pt-10">
        <Card
          title="Extra Card"
          subTitle="Summary"
          style={{ backgroundColor: "#eaeaea", border: "none" }}
        >
          <p className="m-0">This is another card below the grid.</p>
        </Card>
      </div>
    </div>
  );
}
