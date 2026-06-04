export const orders = [
  {
    id: "KS-1001",
    customer: "Nguyễn Minh An",
    phone: "0909 123 456",
    total: 543000,
    status: "Đang giao",
    date: "15/05/2026"
  },
  {
    id: "KS-1002",
    customer: "Trần Bảo Nhi",
    phone: "0912 888 777",
    total: 279000,
    status: "Chờ xác nhận",
    date: "14/05/2026"
  },
  {
    id: "KS-1003",
    customer: "Lê Hoàng Nam",
    phone: "0987 654 321",
    total: 687000,
    status: "Hoàn thành",
    date: "13/05/2026"
  },
  {
    id: "KS-1004",
    customer: "Phạm Gia Hân",
    phone: "0933 221 100",
    total: 428000,
    status: "Đã hủy",
    date: "12/05/2026"
  }
];

export const customers = [
  {
    id: 1,
    name: "Nguyễn Minh An",
    email: "an@example.com",
    phone: "0909 123 456",
    orders: 4,
    spent: 1450000
  },
  {
    id: 2,
    name: "Trần Bảo Nhi",
    email: "nhi@example.com",
    phone: "0912 888 777",
    orders: 2,
    spent: 679000
  },
  {
    id: 3,
    name: "Lê Hoàng Nam",
    email: "nam@example.com",
    phone: "0987 654 321",
    orders: 6,
    spent: 2319000
  }
];

export const staffTasks = [
  "Xác nhận 3 đơn hàng mới",
  "Cập nhật tồn kho sản phẩm khuyến mãi",
  "Kiểm tra phản hồi khách hàng",
  "Chuẩn bị banner khuyến mãi cuối tuần"
];
