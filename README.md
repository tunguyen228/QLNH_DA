# HỆ THỐNG QUẢN LÝ NHÀ HÀNG

Ứng dụng web **Hệ thống quản lý nhà hàng** hỗ trợ các vai trò nhân viên trong nhà hàng (phục vụ, nhà bếp, thu ngân và quản lý) và cung cấp giao gọi món qua mã QR cho khách hàng.

## 📌 Công nghệ sử dụng

* **Frontend:** ReactJS 19, Vite, React Bootstrap, Bootstrap, Axios
* **Backend:** C# .NET 8, ASP.NET Core Web API, Entity Framework Core
* **Database:** PostgreSQL
* **Real-time:** SignalR
* **Authentication:** JWT

## ⚙️ Yêu cầu hệ thống

Để cài đặt và chạy hệ thống, máy tính cần có:

* **Node.js:** sử dụng để cài đặt package và chạy ứng dụng Frontend.
* **.NET 8 SDK:** sử dụng để build và chạy Backend.
* **PostgreSQL:** sử dụng làm hệ quản trị cơ sở dữ liệu.
* **Git:** sử dụng để clone source code từ repository.

### Phiên bản đề nghị

* Node.js 18 trở lên
* .NET 8 SDK
* PostgreSQL
* Git

## 🚀 Hướng dẫn cài đặt

### 1. Clone repository

```bash
git clone https://github.com/tunguyen228/QLNH_DA.git
```

### 2. Cài đặt thư viện Frontend

```bash
cd QLNH_Frontend
npm install
```

### 3. Cài đặt thư viện Backend

```bash
cd QLNH_Backend
dotnet restore
```

## 🗄️ Cấu hình Database & Môi trường

### 1. Tạo Database

Mở PostgreSQL và tạo một database có tên:

```text
QLNH
```

### 2. Cấu hình Backend

Mở file:

```text
QLNH_Backend/appsettings.json
```

Cấu hình theo mẫu:

```json
{
  "Kestrel": {
    "Endpoints": {
      "Http": {
        "Url": "http://0.0.0.0:5000"
      }
    }
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=QLNH;Username=admin;Password=admin"
  },
  "Jwt": {
    "Key": "chuoi-ki-tu",
    "Issuer": "QLNH_Backend",
    "Audience": "QLNH_Frontend",
    "ExpireMinutes": 60
  }
}
```

> **Lưu ý:** Thay `Username` và `Password` bằng thông tin tài khoản PostgreSQL trên máy của bạn.

### 3. Chạy Migration

Từ thư mục `QLNH_Backend`, chạy:

```bash
cd QLNH_Backend
dotnet ef database update
```

Lệnh này sẽ tạo các bảng cần thiết trong database `QLNH`.

## 🏃‍♂️ Cách chạy ứng dụng

Ứng dụng gồm **Backend** và **Frontend**, cần chạy đồng thời trên hai terminal riêng biệt.

### Terminal 1 — Khởi động Backend

```bash
cd QLNH_Backend
dotnet run
```

Backend sẽ chạy tại:

```text
http://localhost:5000
```

### Terminal 2 — Khởi động Frontend

```bash
cd QLNH_Frontend
npm run dev
```

Frontend sẽ chạy tại:

```text
http://localhost:5173
```

Mở địa chỉ trên bằng trình duyệt để truy cập hệ thống.

## 👥 Tài khoản kiểm thử

Sử dụng các tài khoản sau để đăng nhập và kiểm tra chức năng phân quyền:

| Vai trò      | Tên đăng nhập   | Mật khẩu |
| -------------| --------------- | -------- |
| **Quản lý**  | `pl1`           | `123`    |
| **Thu ngân** | `tn1`           | `123`    |

## 🔐 Chức năng chính

Hệ thống cung cấp các chức năng chính:

* **Quản lý bàn:** Theo dõi trạng thái và lựa chọn bàn phục vụ.
* **Quản lý món ăn:** Quản lý thông tin và trạng thái kinh doanh của món.
* **Đặt món:** Nhân viên phục vụ tạo order tại bàn.
* **Đặt món bằng QR:** Khách hàng có thể quét mã QR của bàn để đặt món.
* **Quản lý bếp:** Bếp tiếp nhận order và cập nhật trạng thái chế biến.
* **Thanh toán:** Thu ngân thực hiện thanh toán theo bàn và hóa đơn.
* **Theo dõi thời gian thực:** Sử dụng SignalR để cập nhật giữa các giao diện mà không cần tải lại trang.
* **Thống kê:** Theo dõi doanh thu và các món ăn được gọi nhiều.

## 📁 Cấu trúc thư mục

```text
QLNH_DA/
├── QLNH_Frontend/       # ReactJS + Vite
├── QLNH_Backend/        # ASP.NET Core Web API
└── README.md
```

## 📝 Lưu ý

* Đảm bảo PostgreSQL đang chạy trước khi khởi động Backend.
* Kiểm tra thông tin kết nối database trong `QLNH_Backend/appsettings.json` nếu Backend không thể kết nối PostgreSQL.
* Đảm bảo port `5000` và `5173` không bị ứng dụng khác sử dụng.
* Nếu sử dụng chức năng đặt món bằng QR, thiết bị quét mã QR cần kết nối cùng mạng Wi-Fi/LAN với máy đang chạy hệ thống.
