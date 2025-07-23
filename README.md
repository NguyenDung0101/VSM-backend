
# 📘 VSM Backend API Documentation

**Version:** `1.0.0`  
**Tech Stack:** NestJS · Prisma · MySQL · JWT Auth · Multer (upload file)  
**Environment:** Development (`start:dev`) or Production (`start:prod`)

---

## 🔐 1. Auth Module

Manage user registration, login, and JWT-based authentication.

### Endpoints

| Method | Endpoint        | Description                    |
|--------|------------------|--------------------------------|
| POST   | `/auth/register` | Register a new user            |
| POST   | `/auth/login`    | Login and receive access token |
| GET    | `/auth/profile`  | Get authenticated user profile |

---

## 👤 2. Users Module

### Endpoints

| Method | Endpoint     | Description               |
|--------|--------------|---------------------------|
| GET    | `/users`     | Get all users             |
| GET    | `/users/:id` | Get a specific user       |
| PATCH  | `/users/:id` | Update a user             |
| DELETE | `/users/:id` | Delete a user             |

---

## 📝 3. Posts Module

### Endpoints

| Method | Endpoint     | Description                   |
|--------|--------------|-------------------------------|
| GET    | `/posts`     | Get all posts                 |
| GET    | `/posts/:id` | Get a specific post           |
| POST   | `/posts`     | Create a new post             |
| PATCH  | `/posts/:id` | Update an existing post       |
| DELETE | `/posts/:id` | Delete a post                 |

---

## 📅 4. Events Module

### Endpoints

| Method | Endpoint      | Description                     |
|--------|---------------|----------------------------------|
| GET    | `/events`     | Get all events                   |
| GET    | `/events/:id` | Get a specific event             |
| POST   | `/events`     | Create a new event               |
| PATCH  | `/events/:id` | Update an event                  |
| DELETE | `/events/:id` | Delete an event                  |

---

## 🧾 5. Event Registrations Module

### Endpoints

| Method | Endpoint                 | Description                     |
|--------|--------------------------|----------------------------------|
| POST   | `/event-registrations`   | Register for an event            |
| GET    | `/event-registrations`   | View registrations (admin only)  |
| DELETE | `/event-registrations/:id`| Cancel a registration            |

---

## 📊 6. Dashboard Module

### Endpoints

| Method | Endpoint           | Description             |
|--------|--------------------|--------------------------|
| GET    | `/dashboard/stats` | Get statistics dashboard |

---

## 📦 7. Uploads Module

Used for file uploads (avatars, post images, event banners).

**Upload folders:**

- `uploads/avatars`
- `uploads/posts`
- `uploads/events`

**Example:**

```ts
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
uploadFile(@UploadedFile() file: Express.Multer.File) {
  return { filename: file.filename };
}
```

---

## 🛠️ 8. Prisma Module

ORM configuration using Prisma.

### Commands

```bash
npm run db:migrate      # Run migrations
npm run db:studio       # Open Prisma Studio
npm run db:generate     # Generate Prisma client
```

---

## 🧪 9. Testing & Swagger

- Run all tests: `npm run test`
- Swagger UI (if enabled): [http://localhost:3000/api](http://localhost:3000/api)

**Swagger Configuration Example:**

```ts
const config = new DocumentBuilder()
  .setTitle('VSM Backend API')
  .setDescription('API mô tả hệ thống sự kiện và bài viết')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config));
```

---

## 📁 Folder Structure

```
src/
├── auth/
├── dashboard/
├── event-registrations/
├── events/
├── posts/
├── uploads/
├── users/
├── prisma/
├── app.module.ts
└── main.ts
```

---

## 🛡️ Security Notes

- Use `.env` to store sensitive values:
  - `JWT_SECRET`
  - `DATABASE_URL`
- Update `.gitignore`:

```
node_modules/
.env
dist/
```

---
