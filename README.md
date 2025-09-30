# DevConnect Lite

DevConnect Lite is a backend system built with **Node.js, Express, and MongoDB**.
It provides authentication for **Users** and **Developers**, project creation and management, and a bidding system where developers can place bids on projects.

This README will guide you through setting up the project locally, writing environment variables, using the available API endpoints, and testing everything in **Postman**.

---

##  Features

* User & Developer authentication (Signup/Login) with JWT tokens
* Role-based access control (User / Developer)
* Create and view projects (Users only)
* Place and fetch bids on projects (Developers only)
* Get all bids on project(Users only)
* Export all projects into a `.json` file
* Secure authentication with access/refresh tokens

---

##  Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: MongoDB (Atlas recommended)
* **Authentication**: JWT (Access & Refresh Tokens)
* **Others**: Mongoose, bcrypt, cookie-parser, dotenv

---

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone  https://github.com/FizaShakil/DevConnect-Lite.git
cd devconnect-lite
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

Since environment variables are not shared, you must create your own `.env` file in the root directory:

```env
PORT= 8000
CORS_ORIGIN= your-frontend-uri
MONGODB_URI=your-mongodb-atlas-uri
ACCESS_TOKEN_SECRET= your-access-secret-string
ACCESS_TOKEN_EXPIRY= 1d
REFRESH_TOKEN_SECRET= your-refresh-secret-string
REFRESH_TOKEN_EXPIRY= 5d
```

**Notes:**

* `MONGODB_URI`: Get your MongoDB Atlas connection string and paste it here. Example:

  ```
  mongodb+srv://username:password@clustername.mongodb.net
  ```
* `ACCESS_TOKEN_SECRET` & `REFRESH_TOKEN_SECRET`: Generate random secure strings (e.g., using Node crypto or any random string generator).

### 4. Run the project

```bash
npm run dev
```

Server should run at:

```
http://localhost:5000
```

---

## 📡 API Endpoints

### 🔑 Authentication

#### User Signup

`POST /auth/signup/user`

```json
{
  "username": "Aman",
  "email": "aman@example.com",
  "password": "password123"
}
```

#### Developer Signup

`POST /auth/signup/developer`

```json
{
  "username": "armaan",
  "email": "armaan@example.com",
  "password": "securepassword"
}
```

#### Login (for both User & Developer)

`POST /auth/login`

```json
{
  "email": "aman@example.com",
  "password": "password123"
}
```

➡️ **Response will include an `accessToken` and `refreshToken`**.
This `accessToken` is what you use in Postman **Authorization headers**.

---

###  Projects

#### Create Project (User only)

`POST /projects/create`

```json
{
  "title": "MERN Stack App",
  "description": "A fullstack project",
  "techStack": ["Node.js", "React", "MongoDB"],
  "estimatedBudget": 1500,
  "status": "open"
}
```

#### View Open Projects

`GET /projects/open`

#### Export All Projects to JSON

`GET /projects/export`

Creates `exports/projects.json` file on the server.

---

###  Bids

#### Place a Bid (Developer only)

`POST /bids/:projectId/place`

```json
{
  "bidAmount": 1200,
  "message": "I can deliver this project in 2 weeks."
}
```

#### Get Bids for a Project

`GET /projects/:projectId/bids`

---

##  Authentication & Roles

* All protected routes use **JWT (`verifyJWT`)**.
* Role-based access is enforced with `checkRole(role)`:

  * **Users** → Can create/view/export projects and view all bids on specific project
  * **Developers** → Can place bids and open all projects

---

##  Testing with Postman

1. **Signup or Login** using the relevant endpoint (`/auth/signup/user` or `/auth/signup/developer`).
   You will get an `accessToken` in the response.

   Example:

   ```json
   {
     "accessToken": "your.jwt.token",
     "refreshToken": "your.refresh.token",
     "user": {
       "_id": "abc123",
       "role": "user"
     }
   }
   ```

2. **Add Authorization Header** in Postman for all protected routes:

   * Go to **Headers** or **Authorization** tab in Postman.
   * Select **Bearer Token** type.
   * Paste the `accessToken` from login response.

   Example:

   ```
   Authorization: Bearer your.jwt.token
   ```

3. **Different roles**:

   * **User** login → Use token to access project routes (create, export, view) and bid routes(get all bids)
   * **Developer** login → Use token to place bids and open all projects

---

##  Folder Structure

```
│── public
│── src
  │── controllers/      # Route controllers (auth, project, bid)
  │── models/           # Mongoose models (User, Developer, Project, Bid)
  │── middlewares/      # Custom middlewares (auth, checkRole)
  │── routes/           # API routes
  │── utils/            # Helper functions (ApiError, ApiResponse, asyncHandler)
  │── exports/          # JSON export folder (auto-created when /projects/export API endpoint hits)
  │── server.js
  |── index.js
  |── app.js
│── package.json
│── .env (not included)
│── .prettierrc
```
##### Developed by Fiza Shakil- Full Stack Web Developer
###### Checkout my Portfolio: [Fiza Shakil](https://fiza-shakil.vercel.app)
