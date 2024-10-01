import { ConfirmDialog } from "primereact/confirmdialog";
import "primereact/resources/themes/saga-blue/theme.css"; // Theme
import "primereact/resources/primereact.min.css"; // Core CSS
import "primeicons/primeicons.css"; // Icons

export default function DeleteConfirmDialog({
  visible,
  onHide,
  accept,
  reject,
}) {
  return (
    <ConfirmDialog
      visible={visible}
      onHide={onHide}
      message="Do you want to delete this place?"
      header="Delete Confirmation"
      icon="pi pi-info-circle"
      acceptClassName="p-button-danger"
      accept={accept} 
      reject={reject} 
    />
  );
}
