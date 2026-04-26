// lib/mappers/operation.ts
import { Operation } from "../../types/Operation";

export const mapOperation = (item: Operation): Operation => ({
  _id: item._id,
  project_id: item.project_id,

  // convert date ให้ใช้ได้ทั้ง client/server
  work_date: item.work_date ? new Date(item.work_date) : "",

  system_status: item.system_status ?? false,
  pump_status: item.pump_status ?? false,
  aerator_status: item.aerator_status ?? false,
  sludge_pump_status: item.sludge_pump_status ?? false,
  chlorine_status: item.chlorine_status ?? false,

  do_value: item.do_value ?? undefined,
  sv30_value: item.sv30_value ?? undefined,
  ph_value: item.ph_value ?? undefined,

  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});