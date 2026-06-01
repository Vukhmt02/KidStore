import { ShoppingBag } from "lucide-react";
import Button from "./Button";

export default function EmptyState({
  title = "Chưa có dữ liệu",
  description = "Hãy quay lại sau hoặc thử lựa chọn khác.",
  actionLabel,
  onAction
}) {
  return (
    <div className="rounded-[2rem] border border-dashed border-cocoa/15 bg-white/70 px-6 py-12 text-center shadow-soft">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-peach/70 text-cocoa">
        <ShoppingBag size={28} />
      </div>
      <h2 className="mt-5 text-xl font-bold text-cocoa">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-cocoa/70">{description}</p>
      {actionLabel && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
