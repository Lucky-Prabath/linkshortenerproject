import { EditLinkDialog } from "./edit-link-dialog";
import { DeleteLinkDialog } from "./delete-link-dialog";

interface LinkActionsProps {
  id: number;
  url: string;
  shortCode: string;
}

export function LinkActions({ id, url, shortCode }: LinkActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <EditLinkDialog id={id} currentUrl={url} />
      <DeleteLinkDialog id={id} shortCode={shortCode} />
    </div>
  );
}
