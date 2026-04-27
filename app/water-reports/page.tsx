"use client";
import { useState, useEffect, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Operation } from "../types/Operation";
import { useRouter } from "next/navigation";
import ExportExcel from "../exportexcel/page";

export default function WaterReportFrom() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [selectedOperations, setSelectedOperations] = useState<Operation[]>([]);

  const router = useRouter();

  const statusTemplate = (value: boolean) => {
    return value ? "ปกติ" : "ผิดปกติ";
  };

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

  useEffect(() => {
    console.log("Operations:", operations);
  }, [operations]);

  const formatThaiDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getColor = (field: string, value: number) => {
    const v = Number(value);

    switch (field) {
      case "do":
        return v < 1 ? "#FF3B30" : "#333333";

      case "sv30":
        return v < 200 || v > 500 ? "#FF3B30" : "#333333";

      case "ph":
        return v < 5 || v > 8 ? "#FF3B30" : "#333333";

      default:
        return "#333333";
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 className="text-4xl font-bold">รายการระบบน้ำเสียรายวัน</h1>

        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            icon="pi pi-refresh"
            severity="info"
            tooltip="รีเฟรชข้อมูล"
            tooltipOptions={{ position: "top" }}
          />
          <ExportExcel />
          <Button
            label="เพิ่มรายการ"
            icon="pi pi-plus"
            severity="success"
            tooltip="เพิ่มรายการ"
            tooltipOptions={{ position: "top" }}
            onClick={() => router.push("/water-reports/create")}
          />
        </div>
      </div>

      <div className="pt-5">
        <DataTable
          className="text-center text-center-table bordered-table"
          value={operations}
          paginator
          rows={10}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          rowsPerPageOptions={[10, 25, 50]}
          dataKey="_id"
          selectionMode="checkbox"
          selection={selectedOperations}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            overflow: "hidden",
            background: "white",
          }}
          emptyMessage="ไม่พบข้อมูล."
          currentPageReportTemplate="กำลังแสดง {first} ถึง {last} จากทั้งหมด {totalRecords} รายการ"
        >
          <Column
            field="work_date"
            header="วันที่บันทึก"
            sortable
            filterPlaceholder="Search by name"
            style={{ width: "155px" }}
            body={(row) => formatThaiDate(row.work_date)}
          />
          <Column
            field="system_status"
            header="การทำงานของระบบ"
            filterPlaceholder="Search by name"
            style={{ width: "170px" }}
            body={(row) => statusTemplate(row.system_status)}
          />
          <Column
            field="pump_status"
            header="เครื่องสูบน้ำเสีย"
            filterPlaceholder="Search by name"
            style={{ width: "160px" }}
            body={(row) => statusTemplate(row.pump_status)}
          />
          <Column
            field="aerator_status"
            header="เครื่องเติมอากาศ"
            filterPlaceholder="Search by name"
            style={{ width: "160px" }}
            body={(row) => statusTemplate(row.aerator_status)}
          />
          <Column
            field="sludge_pump_status"
            header="เครื่องสูบตะกอน"
            filterPlaceholder="Search by name"
            style={{ width: "160px" }}
            body={(row) => statusTemplate(row.sludge_pump_status)}
          />
          <Column
            field="chlorine_status"
            header="เครื่องหยดคลอรีน"
            filterPlaceholder="Search by name"
            style={{ width: "160px" }}
            body={(row) => statusTemplate(row.chlorine_status)}
          />
          <Column
            field="do_value"
            header="DO"
            sortable
            filterPlaceholder="Search by name"
            style={{ width: "160px" }}
            body={(row) => (
              <span style={{ color: getColor("do", row.do_value) }}>
                {row.do_value}
              </span>
            )}
          />
          <Column
            field="sv30_value"
            header="SV30"
            sortable
            filterPlaceholder="Search by name"
            style={{ width: "160px" }}
            body={(row) => (
              <span style={{ color: getColor("sv30", row.sv30_value) }}>
                {row.sv30_value}
              </span>
            )}
          />
          <Column
            field="ph_value"
            header="pH"
            sortable
            filterPlaceholder="Search by name"
            style={{ width: "160px" }}
            body={(row) => (
              <span style={{ color: getColor("ph", row.ph_value) }}>
                {row.ph_value}
              </span>
            )}
          />
          <Column
            field="createdAt"
            header="วันที่ลงข้อมูล"
            sortable
            filterPlaceholder="Search by name"
            style={{ width: "155px" }}
            body={(row) => formatThaiDate(row.createdAt)}
          />
          <Column
            header="Action"
            style={{ width: "100px" }}
            body={(rowData: Operation) => (
              <Button
                icon="pi pi-search"
                tooltip="ดูลายละเอียด"
                tooltipOptions={{ position: "top" }}
                rounded
                text
                style={{ width: "80px" }} // 🔥 ขยายไอคอน
                onClick={() => router.push(`/water-reports/${rowData._id}`)}
              />
            )}
          />
        </DataTable>
      </div>
    </div>
  );
}
