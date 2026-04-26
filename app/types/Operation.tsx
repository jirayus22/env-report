export type Operation = {
  _id?: string; // Mongo จะมี
  project_id: string;

  work_date: string | Date;

  system_status?: boolean;
  pump_status?: boolean;
  aerator_status?: boolean;
  sludge_pump_status?: boolean;
  chlorine_status?: boolean;

  do_value?: number;
  sv30_value?: number;
  ph_value?: number;

  createdAt?: string;
  updatedAt?: string;
  remark?: string;
};
