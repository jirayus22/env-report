/* eslint-disable @next/next/no-img-element */
"use client";

import { Card } from "primereact/card";
import React, { useRef, useState } from "react";
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
import { useRouter } from "next/navigation";

type ICallback = (event: React.SyntheticEvent<Element, Event>) => void;

export default function WaterReport() {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [totalSize, setTotalSize] = useState(0);
  const fileUploadRef = useRef<FileUpload>(null);
  const [date, setDate] = useState<Nullable<Date>>(null);
  const [ingredient, setIngredient] = useState<string>("");

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
  return (
    <div className="p-4">
      <Card
        subTitle="บันทึกระบบน้ำเสีย"
        pt={{
          subTitle: {
            style: { fontSize: "1.5rem", fontWeight: "bold" },
          },
        }}
      >
        <div>
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

        <div className="flex-column"></div>

        <div className="flex flex-wrap gap-3 pt-3">
          <div className="flex flex-column align-items-center">
            <label>การทำงานของระบบ</label>
          </div>
        </div>
        <RadioButton
          inputId="ingredient1"
          name="pizza"
          value="Cheese"
          onChange={(e) => setIngredient(e.value)}
          checked={ingredient === "Cheese"}
        />
        <label htmlFor="ingredient1" className="ml-2">
          ปกติ
        </label>
        <RadioButton
          className="ml-2"
          inputId="ingredient2"
          name="pizza"
          value="Mushroom"
          onChange={(e) => setIngredient(e.value)}
          checked={ingredient === "Mushroom"}
        />
        <label htmlFor="ingredient2" className="ml-2">
          ผิดปกติ
        </label>

        <div className="flex flex-wrap gap-3 pt-3">
          <div className="flex flex-column align-items-center">
            <label>เครื่องสูบน้ำเสีย</label>
          </div>
        </div>
        <RadioButton
          inputId="ingredient1"
          name="pizza"
          value="Cheese"
          onChange={(e) => setIngredient(e.value)}
          checked={ingredient === "Cheese"}
        />
        <label htmlFor="ingredient1" className="ml-2">
          ปกติ
        </label>
        <RadioButton
          className="ml-2"
          inputId="ingredient2"
          name="pizza"
          value="Mushroom"
          onChange={(e) => setIngredient(e.value)}
          checked={ingredient === "Mushroom"}
        />
        <label htmlFor="ingredient2" className="ml-2">
          ผิดปกติ
        </label>

        <div className="flex flex-wrap gap-3 pt-3">
          <div className="flex flex-column align-items-center">
            <label>เครื่องเติมอากาศ</label>
          </div>
        </div>
        <RadioButton
          inputId="ingredient1"
          name="pizza"
          value="Cheese"
          onChange={(e) => setIngredient(e.value)}
          checked={ingredient === "Cheese"}
        />
        <label htmlFor="ingredient1" className="ml-2">
          ปกติ
        </label>
        <RadioButton
          className="ml-2"
          inputId="ingredient2"
          name="pizza"
          value="Mushroom"
          onChange={(e) => setIngredient(e.value)}
          checked={ingredient === "Mushroom"}
        />
        <label htmlFor="ingredient2" className="ml-2">
          ผิดปกติ
        </label>

        <div className="flex flex-wrap gap-3 pt-3">
          <div className="flex flex-column align-items-center">
            <label>เครื่องสูบตะกอน</label>
          </div>
        </div>
        <RadioButton
          inputId="ingredient1"
          name="pizza"
          value="Cheese"
          onChange={(e) => setIngredient(e.value)}
          checked={ingredient === "Cheese"}
        />
        <label htmlFor="ingredient1" className="ml-2">
          ปกติ
        </label>
        <RadioButton
          className="ml-2"
          inputId="ingredient2"
          name="pizza"
          value="Mushroom"
          onChange={(e) => setIngredient(e.value)}
          checked={ingredient === "Mushroom"}
        />
        <label htmlFor="ingredient2" className="ml-2">
          ผิดปกติ
        </label>

        <div className="flex flex-wrap gap-3 pt-3">
          <div className="flex flex-column align-items-center">
            <label>เครื่องหยดคลอรีน</label>
          </div>
        </div>
        <RadioButton
          inputId="ingredient1"
          name="pizza"
          value="Cheese"
          onChange={(e) => setIngredient(e.value)}
          checked={ingredient === "Cheese"}
        />
        <label htmlFor="ingredient1" className="ml-2">
          ปกติ
        </label>
        <RadioButton
          className="ml-2"
          inputId="ingredient2"
          name="pizza"
          value="Mushroom"
          onChange={(e) => setIngredient(e.value)}
          checked={ingredient === "Mushroom"}
        />
        <label htmlFor="ingredient2" className="ml-2">
          ผิดปกติ
        </label>

        <div className="flex flex-column align-items-center pt-5">
          <label className="font-bold block mb-2">การตรวจวัดคุณภาพน้ำ</label>
        </div>

        <div className="card flex flex-column md:flex-row gap-3 pt-3">
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">DO</span>
            <InputText placeholder="DO" />
          </div>

          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">SV30</span>
            <InputText placeholder="SV30" />
          </div>

          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">PH</span>
            <InputText placeholder="PH" />
          </div>
        </div>

        <div className="pt-3">
          <label className="font-bold block mb-2">หมายเหตุ</label>
          <InputTextarea
            rows={5}
            className="w-full"
            autoResize
            placeholder="กรอกหมายเหตุเพิ่มเติม..."
          />
        </div>

        <div className="card flex flex-wrap justify-center gap-3 pt-5">
          <Button
            onClick={() => router.push("/")}
            label="ย้อนกลับ"
            severity="danger"
          />
          <Button label="บันทึก" icon="pi pi-check" severity="success" />
        </div>
      </Card>
    </div>
  );
}
