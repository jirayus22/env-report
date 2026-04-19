import "primereact/menuitem";

declare module "primereact/menuitem" {
  interface MenuItem {
    badge?: number | string;
    shortcut?: string;
  }
}