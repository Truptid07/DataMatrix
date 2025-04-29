# Excel-Analytics-Platform
a team project given as part of our internship

## 1️⃣ Week 1 — Project Setup + Authentication

### Backend:

- Set up **Node.js + Express** project
- Connect to **MongoDB Atlas** (cloud MongoDB)
- Create **User Schema** (User model):
    - Name, Email, Psword (hashed), Role (user/admin)
- Setup **JWT authentication**:
    - `/register`, `/login`, `/get-user`
- Middleware:
    - `authMiddleware.js` → check if user is authenticated
    - `adminMiddleware.js` → check if user is admin

> Use bcryptjs for password hashing, jsonwebtoken for tokens.
> 

---

### Frontend:

- Create React app using **Vite**
- Install and setup **Redux Toolkit** for state management
- Tailwind CSS setup (easy config with Vite)
- **Pages**:
    - Login Page
    - Register Page
    - Dashboard Layout (Sidebar + Navbar)