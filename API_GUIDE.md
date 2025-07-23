# Dũng: Đã hoàn thành các backend cơ bản mình đã yêu như đăng ký sự kiện, quản lý sự kiện, dashboard

# VSM Backend API Guide

## Tổng quan

Backend này được xây dựng bằng NestJS với MySQL và Prisma ORM, hỗ trợ 3 loại người dùng:
- **USER**: Người dùng thường, có thể đăng ký sự kiện
- **EDITOR**: Quản lý sự kiện và xem dashboard
- **ADMIN**: Quản lý toàn bộ hệ thống

## Authentication

### Đăng nhập
```
POST /auth/login
{
  "email": "user@vsm.org.vn",
  "password": "password123"
}
```

### Đăng ký tự động (User)
```
POST /auth/register/self
{
  "name": "Nguyễn Văn A",
  "email": "user@vsm.org.vn",
  "password": "password123"
}
```

### Tạo tài khoản (Admin only)
```
POST /auth/admin/create-account
Headers: Authorization: Bearer <admin_token>
{
  "name": "Editor Name",
  "email": "editor@vsm.org.vn",
  "password": "password123",
  "role": "EDITOR"
}
```

## Event Management (EDITOR/ADMIN)

### Tạo sự kiện
```
POST /events
Headers: Authorization: Bearer <token>
{
  "name": "Marathon Hà Nội 2024",
  "description": "Giải chạy marathon lớn nhất năm",
  "content": "Nội dung chi tiết...",
  "date": "2024-06-15T06:00:00Z",
  "location": "Hà Nội",
  "maxParticipants": 1000,
  "category": "MARATHON",
  "registrationDeadline": "2024-06-01T23:59:59Z"
}
```

### Lấy danh sách sự kiện (Public)
```
GET /events?category=MARATHON&search=hà nội&page=1&limit=10
```

### Lấy danh sách sự kiện (Admin)
```
GET /events/admin?status=UPCOMING&published=true
Headers: Authorization: Bearer <admin_token>
```

### Cập nhật sự kiện
```
PUT /events/{id}
Headers: Authorization: Bearer <token>
{
  "name": "Updated name",
  "published": true
}
```

### Xem thống kê sự kiện
```
GET /events/stats/overview?startDate=2024-01-01&endDate=2024-12-31
Headers: Authorization: Bearer <editor_token>
```

## Event Registration (USER)

### Đăng ký tham gia sự kiện
```
POST /event-registrations/events/{eventId}/register
Headers: Authorization: Bearer <user_token>
{
  "fullName": "Nguyễn Văn A",
  "email": "user@vsm.org.vn",
  "phone": "0123456789",
  "emergencyContact": "Nguyễn Thị B",
  "emergencyPhone": "0987654321",
  "experience": "BEGINNER"
}
```

### Xem đăng ký của mình
```
GET /event-registrations/my-registrations
Headers: Authorization: Bearer <user_token>
```

### Hủy đăng ký
```
PATCH /event-registrations/{registrationId}/cancel
Headers: Authorization: Bearer <user_token>
```

### Xem danh sách đăng ký sự kiện (EDITOR/ADMIN)
```
GET /event-registrations/events/{eventId}
Headers: Authorization: Bearer <editor_token>
```

### Cập nhật trạng thái đăng ký (EDITOR/ADMIN)
```
PATCH /event-registrations/{registrationId}/status
Headers: Authorization: Bearer <editor_token>
{
  "status": "CONFIRMED"
}
```

## User Management (ADMIN)

### Xem tất cả người dùng
```
GET /users/admin/all?role=USER&isActive=true&keyword=nguyễn
Headers: Authorization: Bearer <admin_token>
```

### Thay đổi quyền người dùng
```
PATCH /users/{userId}/role
Headers: Authorization: Bearer <admin_token>
{
  "role": "EDITOR"
}
```

### Kích hoạt/vô hiệu hóa tài khoản
```
PATCH /users/{userId}/toggle-status
Headers: Authorization: Bearer <admin_token>
```

### Xem thống kê người dùng
```
GET /users/admin/stats
Headers: Authorization: Bearer <admin_token>
```

### Xóa tài khoản
```
DELETE /users/admin/{userId}
Headers: Authorization: Bearer <admin_token>
```

## Dashboard (EDITOR/ADMIN)

### Xem thống kê tổng quan
```
GET /dashboard/stats?year=2024&month=6
Headers: Authorization: Bearer <editor_token>
```

### Xem thống kê chi tiết sự kiện
```
GET /dashboard/events/stats?eventId={eventId}
Headers: Authorization: Bearer <editor_token>
```

## Enums và Constants

### Role
- `USER`: Người dùng thường
- `EDITOR`: Biên tập viên
- `ADMIN`: Quản trị viên

### EventCategory
- `MARATHON`: Marathon
- `HALF_MARATHON`: Bán marathon
- `FIVE_K`: 5K
- `TEN_K`: 10K
- `FUN_RUN`: Chạy vui
- `TRAIL_RUN`: Chạy địa hình
- `NIGHT_RUN`: Chạy đêm

### EventStatus
- `UPCOMING`: Sắp diễn ra
- `ONGOING`: Đang diễn ra
- `COMPLETED`: Đã hoàn thành
- `CANCELLED`: Đã hủy

### RegistrationStatus
- `PENDING`: Chờ xác nhận
- `CONFIRMED`: Đã xác nhận
- `WAITLIST`: Danh sách chờ
- `CANCELLED`: Đã hủy

### ExperienceLevel
- `BEGINNER`: Người mới bắt đầu
- `INTERMEDIATE`: Trung bình
- `ADVANCED`: Nâng cao

## Setup và Deployment

### Cài đặt dependencies
```bash
cd backend-nestjs
npm install
```

### Setup database
```bash
npx prisma migrate dev
npx prisma db seed
```

### Chạy server
```bash
npm run start:dev
```

### Tài khoản mặc định
Sau khi chạy seed:
- **Admin**: admin@vsm.org.vn / admin123456
- **Editor**: editor@vsm.org.vn / editor123456  
- **User**: user@vsm.org.vn / user123456

## Error Handling

API trả về các mã lỗi HTTP chuẩn:
- `200`: Thành công
- `201`: Tạo thành công
- `400`: Dữ liệu không hợp lệ
- `401`: Chưa xác thực
- `403`: Không có quyền
- `404`: Không tìm thấy
- `409`: Xung đột dữ liệu

## Security

- Tất cả endpoint (trừ login/register) đều yêu cầu JWT token
- Email phải có đuôi @vsm.org.vn
- Phân quyền nghiêm ngặt theo role
- Password được hash bằng bcrypt
