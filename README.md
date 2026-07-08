# KidStore - Website bán quần áo trẻ em

KidStore là website thương mại điện tử bán quần áo trẻ em, gồm giao diện khách hàng và trang quản trị dành cho Admin. Dự án được xây dựng theo mô hình full-stack với ReactJS ở frontend, ASP.NET Core Web API ở backend và SQL Server làm cơ sở dữ liệu.

## Công nghệ sử dụng

### Frontend

- ReactJS
- React Router DOM
- Vite
- Tailwind CSS
- Lucide React Icons

### Backend

- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT Authentication
- Repository Pattern

## Chức năng chính

### Khách hàng

- Xem danh sách sản phẩm.
- Xem chi tiết sản phẩm.
- Tìm kiếm và lọc sản phẩm.
- Thêm sản phẩm vào giỏ hàng.
- Có thể thêm sản phẩm vào giỏ hàng khi chưa đăng nhập.
- Đăng nhập khi tiến hành thanh toán.
- Đặt hàng.
- Xem lịch sử đơn hàng.
- Xem và cập nhật thông tin cá nhân như số điện thoại, địa chỉ.
- Xem tin tức, bài viết và video giới thiệu từ cửa hàng.

### Admin

- Đăng nhập bằng tài khoản Admin để truy cập trang quản trị.
- Quản lý sản phẩm: thêm, sửa, xóa sản phẩm.
- Quản lý biến thể sản phẩm theo size, màu sắc và số lượng tồn kho.
- Quản lý danh mục sản phẩm.
- Quản lý đơn hàng.
- Quản lý khách hàng.
- Quản lý tin tức: thêm, sửa, xóa bài viết và nhúng video YouTube.

## Cấu trúc thư mục

```text
KidStore/
├── frontend/                 # Giao diện ReactJS
├── KidStore.API/             # ASP.NET Core Web API
├── KidStore.Aplication/      # DTO, Interface, Service
├── KidStore.Domain/          # Entity, Enum, Exception
├── KidStore.Infrastructure/  # DbContext, Repository, Migration
└── KidStore.sln              # Solution backend
```

## Yêu cầu cài đặt

- .NET SDK 8
- Node.js
- SQL Server hoặc SQL Server Express
- Visual Studio / VS Code

## Cấu hình database

Mở file:

```text
KidStore.API/appsettings.json
```

Chỉnh lại connection string theo SQL Server trên máy:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=YOUR_SERVER;Initial Catalog=KidStore;Integrated Security=True;TrustServerCertificate=True"
  }
}
```

Ví dụ nếu dùng SQL Server Express:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=.\\SQLEXPRESS;Initial Catalog=KidStore;Integrated Security=True;TrustServerCertificate=True"
  }
}
```

## Cập nhật cơ sở dữ liệu

Nếu chưa cài Entity Framework CLI:

```powershell
dotnet tool install --global dotnet-ef --version 8.0.0
```

Chạy migration:

```powershell
cd D:\KidStore2
dotnet ef database update --project KidStore\KidStore.Infrastructure --startup-project KidStore\KidStore.API
```

## Chạy backend

Từ thư mục gốc dự án:

```powershell
cd D:\KidStore2\KidStore
dotnet run --project KidStore.API --launch-profile https
```

Backend sẽ chạy tại:

```text
https://localhost:7070
http://localhost:5049
```

Swagger:

```text
https://localhost:7070/swagger
```

## Chạy frontend

Mở terminal khác:

```powershell
cd D:\KidStore2\KidStore\frontend
npm install
npm run dev
```

Frontend sẽ chạy tại:

```text
http://localhost:5173
```

File môi trường frontend:

```text
frontend/.env
```

Nội dung:

```env
VITE_API_URL=https://localhost:7070/api
```

## Tài khoản và phân quyền

Dự án có phân quyền theo vai trò:

- Admin: truy cập trang quản trị.
- Customer: mua hàng, đặt hàng và xem thông tin cá nhân.

Trang Admin:

```text
http://localhost:5173/admin
```

Người dùng không có quyền Admin sẽ được chuyển về trang đăng nhập.

## Một số API chính

### Auth

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/me
```

### Catalog

```text
GET /api/catalog/products
GET /api/catalog/products/{id}
GET /api/catalog/categories
```

### Cart

```text
GET    /api/cart
POST   /api/cart/items
PUT    /api/cart/items/{cartItemId}
DELETE /api/cart/items/{cartItemId}
```

### Orders

```text
POST /api/orders
GET  /api/orders
GET  /api/orders/{id}
```

### News

```text
GET /api/news
GET /api/news/{slug}
```

### Admin

```text
GET    /api/admin/products
POST   /api/admin/products
PUT    /api/admin/products/{id}
DELETE /api/admin/products/{id}

GET    /api/admin/categories
POST   /api/admin/categories
PUT    /api/admin/categories/{id}
DELETE /api/admin/categories/{id}

GET    /api/admin/news
POST   /api/admin/news
PUT    /api/admin/news/{id}
DELETE /api/admin/news/{id}
```

## Build kiểm tra

Build backend:

```powershell
dotnet build KidStore.API\KidStore.API.csproj
```

Build frontend:

```powershell
cd frontend
npm run build
```

## Điểm nổi bật của dự án

- Xây dựng website thương mại điện tử full-stack.
- Tích hợp JWT Authentication và phân quyền Admin / Customer.
- Quản lý sản phẩm có biến thể size, màu sắc và tồn kho.
- Hỗ trợ giỏ hàng cho cả khách chưa đăng nhập.
- Có quy trình đặt hàng và lưu lịch sử đơn hàng.
- Có trang tài khoản khách hàng.
- Có module tin tức cho Admin, hỗ trợ nhúng video YouTube.
- Giao diện responsive, thân thiện với người dùng.

## Tác giả

Dự án được xây dựng phục vụ học tập và thực hành phát triển website thương mại điện tử với ASP.NET Core Web API, ReactJS và SQL Server.
