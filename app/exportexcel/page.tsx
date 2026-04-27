"use client";
import { useState } from "react";
import { Button } from "primereact/button";
import { Operation } from "../types/Operation";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ExportExcel() {
  const [operations, setOperations] = useState<Operation[]>([]);

  const getData = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/operations`,
    );

    const json = await res.json();

    setOperations(json.data);

    exportToExcel(json.data); // 👈 export ทันที
  };

  const exportToExcel = (data: Operation[]) => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        วันที่: new Date(item.work_date).toLocaleDateString("th-TH"),
        การทำงานของระบบ: item.system_status ? "ปกติ" : "ผิดปกติ",
        เครื่องสูบน้ำเสีย: item.pump_status ? "ปกติ" : "ผิดปกติ",
        เครื่องเติมอากาศ: item.aerator_status ? "ปกติ" : "ผิดปกติ",
        เครื่องสูบตะกอน: item.sludge_pump_status ? "ปกติ" : "ผิดปกติ",
        เครื่องหยดคลอรีน: item.chlorine_status ? "ปกติ" : "ผิดปกติ",
        DO: item.do_value,
        SV30: item.sv30_value,
        pH: item.ph_value,
      })),
    );

    // 👇 เพิ่มตรงนี้
    worksheet["!cols"] = [
      { wch: 15 }, // วันที่
      { wch: 20 }, // ระบบ
      { wch: 20 }, // pump
      { wch: 20 }, // aerator
      { wch: 20 }, // sludge
      { wch: 20 }, // chlorine
      { wch: 10 }, // DO
      { wch: 10 }, // SV30
      { wch: 10 }, // pH
    ];
    worksheet["!rows"] = Array(data.length + 1).fill({
      hpt: 22,
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, `water-report.xlsx`);
  };

  return (
    <Button
      label="ดาวน์โหลด Excel"
      icon="pi pi-file-excel"
      severity="help"
      tooltip="ดาวน์โหลด Excel"
      tooltipOptions={{ position: "top" }}
      onClick={getData}
    />
  );
}
