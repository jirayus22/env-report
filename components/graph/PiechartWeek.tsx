"use client";

import { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { ChartData, ChartOptions } from "chart.js";
import { Operation } from "../../app/types/Operation";

export default function ComboChart() {
  const [chartData, setChartData] = useState<ChartData>();
  const [chartOptions, setChartOptions] = useState<ChartOptions>({});
  const [operations, setOperations] = useState<Operation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/operations`,
      );

      const json = await res.json();
      const data = json.data;
      setOperations(json.data);
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue("--text-color");
      const textColorSecondary = documentStyle.getPropertyValue(
        "--text-color-secondary",
      );
      const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

      const labels = data.map((d: Operation) =>
        new Date(d.work_date).toLocaleDateString("th-TH", {
          day: "2-digit",
          month: "2-digit",
        }),
      );

      setChartData({
        labels,
        datasets: [
          {
            type: "line",
            label: "SV30",
            data: data.map((d: Operation) => d.sv30_value),
            backgroundColor: "#22C55E",
          },
        ],
      });

      setChartOptions({
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      });
    };

    fetchData();
  }, []);

  return (
    <div className="card">
      <Chart type="bar" data={chartData} options={chartOptions} />
    </div>
  );
}
