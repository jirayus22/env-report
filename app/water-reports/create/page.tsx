"use client";
import { use } from "react";
import React, { useState, useEffect, useRef } from "react";
import { Operation } from "../../types/Operation";
import { useRouter } from "next/navigation";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import {
  FileUpload,
  FileUploadHeaderTemplateOptions,
  FileUploadSelectEvent,
  FileUploadFile,
  FileUploadUploadEvent,
  ItemTemplateOptions,
} from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { Tag } from "primereact/tag";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { InputText } from "primereact/inputtext";
import Swal from "sweetalert2";
import {
  Dropdown,
  DropdownChangeEvent,
  DropdownProps,
} from "primereact/dropdown";

type ICallback = (event: React.SyntheticEvent<Element, Event>) => void;

type UserInspector = {
  _id: string;
  pre_name: number;
  first_name: string;
  last_name: string;
};

export default function Page() {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [totalSize, setTotalSize] = useState(0);
  const fileUploadRef = useRef<FileUpload>(null);
  const [date, setDate] = useState<Nullable<Date>>(null);

  const [userInspector, setUserInspector] = useState<UserInspector | null>(
    null,
  );
  const [userInspectorList, setUserInspectorList] = useState<
    UserInspector[] | null
  >(null);

  const [remark, setRemark] = useState<string | null>("");

  const fieldRadios = [
    { key: "system_status", label: "การทำงานของระบบ" },
    { key: "pump_status", label: "เครื่องสูบน้ำเสีย" },
    { key: "aerator_status", label: "เครื่องเติมอากาศ" },
    { key: "sludge_pump_status", label: "เครื่องสูบตะกอน" },
    { key: "chlorine_status", label: "เครื่องหยดคลอรีน" },
  ];

  const [form, setForm] = useState<Record<string, boolean | null>>({
    system_status: null,
    pump_status: null,
    aerator_status: null,
    sludge_pump_status: null,
    chlorine_status: null,
  });

  const convertPreName = (pre_name: number) => {
    switch (pre_name) {
      case 1:
        return "นาย";
      case 2:
        return "นางสาว";
      case 3:
        return "นาง";
      default:
        return "";
    }
  };

  const [metrics, setMetrics] = useState({
    do_value: "",
    sv30_value: "",
    ph_value: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user`);
      const json = await res.json();

      const uesrsResponse = json.data;
      console.log("Users Response:", uesrsResponse);
      setUserInspectorList(uesrsResponse as UserInspector[]);
    };

    getUser();
  }, []);

  useEffect(() => {
    console.log("User Inspector List:", userInspectorList);
  }, [userInspectorList]);

  const getFullName = (u: UserInspector) =>
    convertPreName(u.pre_name) + `${u.first_name} ${u.last_name}`;

  const onTemplateSelect = (e: FileUploadSelectEvent) => {
    let _totalSize = totalSize;
    const files = e.files;

    Object.keys(files).forEach((key: string) => {
      _totalSize += files[Number(key)].size || 0;
    });

    setTotalSize(_totalSize);
  };

  const onTemplateUpload = (e: FileUploadUploadEvent) => {
    let _totalSize = 0;

    e.files.forEach((file) => {
      _totalSize += file.size || 0;
    });

    setTotalSize(_totalSize);
    toast.current?.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  const onTemplateRemove = async (
    file: FileUploadFile,
    callback: ICallback,
    event: React.SyntheticEvent<Element, Event>,
  ) => {
    setTotalSize(totalSize - file.size);
    callback(event);
  };

  const onTemplateClear = () => {
    setTotalSize(0);
  };

  const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = totalSize / 10000;
    const formatedValue =
      fileUploadRef && fileUploadRef.current
        ? fileUploadRef.current.formatSize(totalSize)
        : "0 B";

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        {uploadButton}
        {cancelButton}
        <div className="flex align-items-center gap-3 ml-auto">
          <span>{formatedValue} / 1 MB</span>
          <ProgressBar
            value={value}
            showValue={false}
            style={{ width: "10rem", height: "12px" }}
          ></ProgressBar>
        </div>
      </div>
    );
  };

  const itemTemplate = (file: object, props: ItemTemplateOptions) => {
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: "40%" }}>
          <img
            alt={(file as FileUploadFile).name}
            role="presentation"
            src={(file as FileUploadFile).objectURL}
            width={100}
          />
          <span className="flex flex-column text-left ml-3">
            {(file as FileUploadFile).name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag
          value={props.formatSize}
          severity="warning"
          className="px-3 py-2"
        />
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={(event: React.SyntheticEvent<Element, Event>) =>
            onTemplateRemove(file as FileUploadFile, props.onRemove, event)
          }
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image mt-3 p-5"
          style={{
            fontSize: "5em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-5"
        >
          Drag and Drop Image Here
        </span>
      </div>
    );
  };

  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };
  const uploadOptions = {
    icon: "pi pi-fw pi-cloud-upload",
    iconOnly: true,
    className:
      "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
  };
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className:
      "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };

  const handleSubmit = async () => {
    console.log("UserInspector : " + JSON.stringify(userInspector));
    const payload = {
      ...form,
      project_id: "69e8f9d2335b5983d11f74f5",
      created_by: userInspector?._id ?? null,
      do_value: Number(metrics.do_value),
      sv30_value: Number(metrics.sv30_value),
      ph_value: Number(metrics.ph_value),
      work_date: date ? date.toISOString() : null,
      remark: remark,
    };

    console.log("Payload to submit:", payload);

    Swal.fire({
      title: "แจ้งเตือน!",
      text: "ต้องการบันทึกข้อมูลใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/operations`,
          {
            method: "POST", // 👈 create เท่านั้น
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );

        const data = await res.json();

        if (data.success) {
          Swal.fire("สำเร็จ!", "ข้อมูลของคุณถูกบันทึกแล้ว.", "success").then(
            () => {
              router.push("/water-reports");
            },
          );
        } else {
          Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถบันทึกข้อมูลได้.", "error");
        }
      }
    });
  };

  return (
    <div>
      <h1 className="text-4xl font-bold">บันทึกระบบน้ำเสีย</h1>

      <div className="pt-5">
        <Toast ref={toast}></Toast>

        <Tooltip
          target=".custom-choose-btn"
          content="Choose"
          position="bottom"
        />
        <Tooltip
          target=".custom-upload-btn"
          content="Upload"
          position="bottom"
        />
        <Tooltip
          target=".custom-cancel-btn"
          content="Clear"
          position="bottom"
        />

        <FileUpload
          ref={fileUploadRef}
          name="demo[]"
          url="/api/upload"
          multiple
          accept="image/*"
          maxFileSize={1000000}
          onUpload={onTemplateUpload}
          onSelect={onTemplateSelect}
          onError={onTemplateClear}
          onClear={onTemplateClear}
          headerTemplate={headerTemplate}
          itemTemplate={itemTemplate}
          emptyTemplate={emptyTemplate}
          chooseOptions={chooseOptions}
          uploadOptions={uploadOptions}
          cancelOptions={cancelOptions}
        />
      </div>

      <div className="pt-5 w-full">
        <div className="flex-auto">
          <label htmlFor="buttondisplay" className="font-bold block mb-2">
            วันที่บันทึก
          </label>
          <Calendar
            id="buttondisplay"
            value={date}
            onChange={(e) => setDate(e.value)}
            showIcon
          />
        </div>
      </div>

      {fieldRadios.map((field) => (
        <div key={field.key} className="col-12 md:col-6 lg:col-4">
          <div className="p-3 ">
            <label className="font-bold block mb-2">{field.label}</label>

            <div className="flex align-items-center gap-3">
              <RadioButton
                inputId={`${field.key}_true`}
                name={field.key}
                value={true}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    [field.key]: e.value,
                  }))
                }
                checked={form[field.key] === true}
              />
              <label htmlFor={`${field.key}_true`}>ปกติ</label>

              <RadioButton
                inputId={`${field.key}_false`}
                name={field.key}
                value={false}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    [field.key]: e.value,
                  }))
                }
                checked={form[field.key] === false}
              />
              <label htmlFor={`${field.key}_false`}>ผิดปกติ</label>
            </div>
          </div>
        </div>
      ))}

      <div className="flex flex-column align-items-center pt-5">
        <label className="font-bold block mb-2">การตรวจวัดคุณภาพน้ำ</label>
      </div>

      <div className="grid pt-3 gap-3">
        <div className="col-1 md:col-1">
          <label className="font-bold block mb-2">DO</label>
          <InputText
            className="w-full"
            placeholder="DO"
            value={metrics.do_value}
            onChange={(e) =>
              setMetrics((prev) => ({
                ...prev,
                do_value: e.target.value,
              }))
            }
          />
        </div>

        <div className="col-2 md:col-2">
          <label className="font-bold block mb-2">SV30</label>
          <InputText
            className="w-full"
            placeholder="SV30"
            value={metrics.sv30_value}
            onChange={(e) =>
              setMetrics((prev) => ({
                ...prev,
                sv30_value: e.target.value,
              }))
            }
          />
        </div>

        <div className="col-3 md:col-3">
          <label className="font-bold block mb-2">PH</label>
          <InputText
            className="w-full"
            placeholder="PH"
            value={metrics.ph_value}
            onChange={(e) =>
              setMetrics((prev) => ({
                ...prev,
                ph_value: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className="pt-3">
        <label className="font-bold block mb-2">หมายเหตุ</label>
        <InputTextarea
          rows={5}
          className="w-full"
          autoResize
          placeholder="กรอกหมายเหตุเพิ่มเติม..."
          value={remark ?? ""}
          onChange={(e) => setRemark(e.target.value)}
        />
      </div>

      <div className="pt-5 w-full">
        <div className="flex-auto">
          <label>ผู้รายงานผล</label>
          <div className="flex-1 pt-1">
            <Dropdown
              value={userInspector}
              onChange={(e: DropdownChangeEvent) => {
                console.log("Selected:", e.value);
                setUserInspector(e.value);
              }}
              options={userInspectorList || []}
              optionLabel="firstName" // ใช้อะไรก็ได้ (จำเป็นต้องมี)
              placeholder="เลือกผู้รายงานผล"
              itemTemplate={(option) => <div>{getFullName(option)}</div>}
              valueTemplate={(option, props) =>
                option ? (
                  <div>{getFullName(option)}</div>
                ) : (
                  <span>{props.placeholder}</span>
                )
              }
              className="w-full"
              showClear
            />
          </div>
        </div>
      </div>

      <div className="card flex flex-wrap justify-center gap-3 pt-5">
        <Button
          onClick={() => router.push("/water-reports")}
          label="ย้อนกลับ"
          severity="danger"
        />
        <Button
          label="บันทึก"
          icon="pi pi-check"
          severity="success"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}
