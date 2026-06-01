import { useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <section className="container-page py-12">
      <EmptyState
        title="404 - Không tìm thấy trang"
        description="Đường dẫn này không tồn tại hoặc đã được thay đổi."
        actionLabel="Về trang chủ"
        onAction={() => navigate("/")}
      />
    </section>
  );
}
