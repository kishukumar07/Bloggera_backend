
# 📝 Blog Application

A full-featured **Blogging Platform** backend built with **Node.js** and **Express.js**, supporting blog post creation, editing, deletion, and user authentication with JWT.

---

## 🌐 API Base URL

```
http://localhost:4500
```

---

## 📚 Features

* **User Authentication**

  * Register a new user
  * Login user and receive JWT tokens
  * Refresh access tokens
  * Logout and invalidate tokens

* **Blog Management**

  * Create a blog post
  * Fetch all blog posts
  * Update your own blog posts
  * Delete your own blog posts

---

## 🔑 Authentication

* JWT Access Token required for:

  * Creating blogs
  * Updating blogs
  * Deleting blogs
* Refresh tokens are used to generate new access tokens.

---

## 📦 API Endpoints

### User Routes

| Method | Endpoint         | Description                         |
| :----: | :--------------- | :---------------------------------- |
|  POST  | `/user/register` | Register a new user                 |
|  POST  | `/user/login`    | Login and get access/refresh tokens |
|  POST  | `/user/logout`   | Logout user (blacklist token)       |
|  POST  | `/user/refresh`  | Refresh access token using reftoken |

---

### Blog Routes

| Method | Endpoint               | Description                      |
| :----: | :--------------------- | :------------------------------- |
|  POST  | `/blog/create`         | Create a new blog post           |
|   GET  | `/blog`                | Fetch all blog posts             |
|  PATCH | `/blog/update/:blogID` | Update a blog post (Author only) |
| DELETE | `/blog/delete/:blogID` | Delete a blog post (Author only) |

---

## 🛠️ Request/Response Example

### 1. Register a User

**POST** `/user/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 25,
  "city": "New York"
}
```

### 2. Login User

**POST** `/user/login`

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "msg": "Login Successful",
  "token": "ACCESS_TOKEN",
  "reftoken": "REFRESH_TOKEN"
}
```

---

### 3. Create Blog

**POST** `/blog/create`

```json
{
  "title": "The Future of Web Development",
  "content": "Web development trends like AI, Web3, serverless are emerging rapidly...",
  "category": "Technology"
}
```

---

### 4. Update Blog

**PATCH** `/blog/update/:blogID`

```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "category": "Updated Category"
}
```

---

### 5. Delete Blog

**DELETE** `/blog/delete/:blogID`

---

## ⚠️ Error Responses

* `400` Bad Request (Missing fields)
* `401` Unauthorized (Invalid or missing token)
* `403` Forbidden (Not authorized to update/delete)
* `404` Blog Not Found
* `409` Conflict (User already exists)
* `500` Internal Server Error

---

## 📄 Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB** (assumed, since typical in such apps)
* **JWT Authentication**
* **REST API standards**

---

## 🚀 How to Run

```bash
git clone <your-repository-url>
cd your-project
npm install
npm start
```

---

## 🙌 Contribution

Feel free to fork this project, raise issues, and submit PRs!
Let's build better apps together.

---

## 🧑‍💻 Author

* \[Your Name Here]

---

Would you also like me to create a short version too, in case you want a **lightweight** `README.md`? 🚀
(You could keep one long and one short version depending on where you use it!)
