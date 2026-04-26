"use client";
import React, { useState, useEffect } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { Calendar } from "primereact/calendar";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { Slider, SliderChangeEvent } from "primereact/slider";
import { Tag } from "primereact/tag";
import { CustomerService } from "../service/CustomerService";
import { Customer } from "../types/Customer";
import { Representative } from "../types/Representative";
import { DataTableFilterMetaData } from "primereact/datatable";
import { Operation } from "../types/Operation";
import { useRouter } from "next/navigation";

export default function WaterReportFrom() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedOperations, setSelectedOperations] = useState<Operation[]>([]);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    "country.name": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    date: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    balance: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [representatives] = useState<Representative[]>([
    { name: "Amy Elsner", image: "amyelsner.png" },
    { name: "Anna Fali", image: "annafali.png" },
    { name: "Asiya Javayant", image: "asiyajavayant.png" },
    { name: "Bernardo Dominic", image: "bernardodominic.png" },
    { name: "Elwin Sharvill", image: "elwinsharvill.png" },
    { name: "Ioni Bowcher", image: "ionibowcher.png" },
    { name: "Ivan Magalhaes", image: "ivanmagalhaes.png" },
    { name: "Onyama Limba", image: "onyamalimba.png" },
    { name: "Stephen Shaw", image: "stephenshaw.png" },
    { name: "XuXue Feng", image: "xuxuefeng.png" },
  ]);

  const router = useRouter();

  const [statuses] = useState<string[]>([
    "unqualified",
    "qualified",
    "new",
    "negotiation",
    "renewal",
  ]);

  const getSeverity = (status: string) => {
    switch (status) {
      case "unqualified":
        return "danger";

      case "qualified":
        return "success";

      case "new":
        return "info";

      case "negotiation":
        return "warning";

      case "renewal":
        return null;
    }
  };

  const getCustomers = (data: Customer[]) => {
    return [...(data || [])].map((d) => ({
      ...d,
      date: new Date(d.date),
    }));
  };

  useEffect(() => {
    CustomerService.getCustomersLarge().then((data: Customer[]) =>
      setCustomers(getCustomers(data)),
    );
  }, []);

  const formatDate = (value: string | Date) => {
    return new Date(value).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };

    (_filters["global"] as DataTableFilterMetaData).value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
        <h4 className="m-0">Customers</h4>
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </IconField>
      </div>
    );
  };

  const countryBodyTemplate = (rowData: Customer) => {
    return (
      <div className="flex align-items-center gap-2">
        <img
          alt="flag"
          src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
          className={`flag flag-${rowData.country.code}`}
          style={{ width: "24px" }}
        />
        <span>{rowData.country.name}</span>
      </div>
    );
  };

  const representativeBodyTemplate = (rowData: Customer) => {
    const representative = rowData.representative;

    return (
      <div className="flex align-items-center gap-2">
        <img
          alt={representative.name}
          src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`}
          width="32"
        />
        <span>{representative.name}</span>
      </div>
    );
  };

  const representativeFilterTemplate = (
    options: ColumnFilterElementTemplateOptions,
  ) => {
    return (
      <React.Fragment>
        <div className="mb-3 font-bold">Agent Picker</div>
        <MultiSelect
          value={options.value}
          options={representatives}
          itemTemplate={representativesItemTemplate}
          onChange={(e: MultiSelectChangeEvent) =>
            options.filterCallback(e.value)
          }
          optionLabel="name"
          placeholder="Any"
          className="p-column-filter"
        />
      </React.Fragment>
    );
  };

  const representativesItemTemplate = (option: Representative) => {
    return (
      <div className="flex align-items-center gap-2">
        <img
          alt={option.name}
          src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`}
          width="32"
        />
        <span>{option.name}</span>
      </div>
    );
  };

  const dateBodyTemplate = (rowData: Customer) => {
    return formatDate(rowData.date);
  };

  const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        dateFormat="mm/dd/yy"
        placeholder="mm/dd/yyyy"
        mask="99/99/9999"
      />
    );
  };

  const balanceBodyTemplate = (rowData: Customer) => {
    return formatCurrency(rowData.balance);
  };

  const balanceFilterTemplate = (
    options: ColumnFilterElementTemplateOptions,
  ) => {
    return (
      <InputNumber
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        mode="currency"
        currency="USD"
        locale="en-US"
      />
    );
  };

  const statusBodyTemplate = (rowData: Customer) => {
    return (
      <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
    );
  };

  const statusFilterTemplate = (
    options: ColumnFilterElementTemplateOptions,
  ) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e: DropdownChangeEvent) =>
          options.filterCallback(e.value, options.index)
        }
        itemTemplate={statusItemTemplate}
        placeholder="Select One"
        className="p-column-filter"
        showClear
      />
    );
  };

  const statusItemTemplate = (option: string) => {
    return <Tag value={option} severity={getSeverity(option)} />;
  };

  const activityBodyTemplate = (rowData: Customer) => {
    return (
      <ProgressBar
        value={rowData.activity}
        showValue={false}
        style={{ height: "6px" }}
      ></ProgressBar>
    );
  };

  const activityFilterTemplate = (
    options: ColumnFilterElementTemplateOptions,
  ) => {
    return (
      <>
        <Slider
          value={options.value}
          onChange={(e: SliderChangeEvent) => options.filterCallback(e.value)}
          range
          className="m-3"
        ></Slider>
        <div className="flex align-items-center justify-content-between px-2">
          <span>{options.value ? options.value[0] : 0}</span>
          <span>{options.value ? options.value[1] : 100}</span>
        </div>
      </>
    );
  };

  const actionBodyTemplate = () => {
    return <Button type="button" icon="pi pi-cog" rounded></Button>;
  };

  const header = renderHeader();

  const statusTemplate = (value: boolean) => {
    return value ? "ปกติ" : "ผิดปกติ";
  };

  useEffect(() => {
    console.log("Fetching operations... : " + process.env.NEXT_PUBLIC_API_URL);
    const getData = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/operations`,
      );
      const json = await res.json();
      console.log("Fetched operations:", json.data);
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
        <Button
          label="เพิ่มรายการ"
          icon="pi pi-plus"
          severity="success"
          onClick={() => router.push("/water-reports/create")}
        />
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
            style={{ minWidth: "8rem" }}
            body={(row) => formatThaiDate(row.work_date)}
          />
          <Column
            field="system_status"
            header="การทำงานของระบบ"
            filterPlaceholder="Search by name"
            style={{ minWidth: "3rem" }}
            body={(row) => statusTemplate(row.system_status)}
          />
          <Column
            field="pump_status"
            header="เครื่องสูบน้ำเสีย"
            filterPlaceholder="Search by name"
            style={{ minWidth: "5rem" }}
            body={(row) => statusTemplate(row.pump_status)}
          />
          <Column
            field="aerator_status"
            header="เครื่องเติมอากาศ"
            filterPlaceholder="Search by name"
            style={{ minWidth: "8rem" }}
            body={(row) => statusTemplate(row.aerator_status)}
          />
          <Column
            field="sludge_pump_status"
            header="เครื่องสูบตะกอน"
            filterPlaceholder="Search by name"
            style={{ minWidth: "8rem" }}
            body={(row) => statusTemplate(row.sludge_pump_status)}
          />
          <Column
            field="chlorine_status"
            header="เครื่องหยดคลอรีน"
            filterPlaceholder="Search by name"
            style={{ minWidth: "8rem" }}
            body={(row) => statusTemplate(row.chlorine_status)}
          />
          <Column
            field="do_value"
            header="DO"
            sortable
            filterPlaceholder="Search by name"
            style={{ minWidth: "3rem" }}
          />
          <Column
            field="sv30_value"
            header="SV30"
            sortable
            filterPlaceholder="Search by name"
            style={{ minWidth: "5rem" }}
          />
          <Column
            field="ph_value"
            header="pH"
            sortable
            filterPlaceholder="Search by name"
            style={{ minWidth: "5rem" }}
          />
          <Column
            field="createdAt"
            header="วันที่ลงข้อมูล"
            sortable
            filterPlaceholder="Search by name"
            style={{ minWidth: "8rem" }}
            body={(row) => formatThaiDate(row.createdAt)}
          />
          <Column
            header="Action"
            style={{ width: "100px" }}
            body={(rowData: Operation) => (
              <Button
                icon="pi pi-search"
                rounded
                text
                style={{ fontSize: "5rem" }} // 🔥 ขยายไอคอน
                onClick={() => router.push(`/water-reports/${rowData._id}`)}
              />
            )}
          />
        </DataTable>
      </div>
    </div>
  );
}
