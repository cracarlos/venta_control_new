import api from "@/api/Api";

export const downloadBackup = async (): Promise<void> => {
  const response = await api.get("system/backup/", { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  const disposition = response.headers["content-disposition"];
  const filename = disposition
    ? disposition.split("filename=")[1]?.replace(/"/g, "") ?? "venta_control_backup.db"
    : "venta_control_backup.db";
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const restoreBackup = async (file: File): Promise<{ message: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post<{ message: string }>("system/restore/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
