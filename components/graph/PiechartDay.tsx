"use client";

import { useState, useEffect, useMemo } from "react";
import { Chart } from "primereact/chart";
import { Operation } from "../../app/types/Operation";

export default function PieChartDemo() {
  const [operations, setOperations] = useState<Operation[]>([]);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const getData = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/operations`,
      );
      const json = await res.json();
      setOperations(json.data);
    };

    getData();
  }, []);

  const getDateOnly = (date: string | Date | null) => {
    if (!date) return null;

    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const summary = useMemo(() => {
    const todayData = operations.filter((op) => {
      return getDateOnly(op.work_date) === today;
    });

    return {
      totalDO: todayData.reduce((s, i) => s + (i.do_value || 0), 0),
      totalSV30: todayData.reduce((s, i) => s + (i.sv30_value || 0), 0),
      totalPH: todayData.reduce((s, i) => s + (i.ph_value || 0), 0),
    };
  }, [operations]);

  const chartData = useMemo(() => {
    return {
      labels: ["DO", "SV30", "pH"],
      datasets: [
        {
          data: [summary.totalDO, summary.totalSV30, summary.totalPH],
          backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
        },
      ],
    };
  }, [summary]);

  const chartOptions = useMemo(() => {
    return {
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    };
  }, []);

  return (
    <div className="w-full flex justify-center">
      <Chart
        type="pie"
        data={chartData}
        options={chartOptions}
        className="w-full md:w-30rem"
      />
    </div>
  );
}
