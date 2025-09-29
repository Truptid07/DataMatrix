
# 📊 DataMatrix Excel Analytics Platform

A full-stack Excel analytics web application built as part of an internship project. This platform allows users to upload Excel files, perform data analysis, and visualize results through an intuitive dashboard. It features secure authentication, role-based access control, and a modern UI.

---

## 🚀 Live Demo

👉 [Visit the deployed app](https://excel-analytics-platform-lilac.vercel.app)

---

## 🛠️ Tech Stack

### Frontend

- React (Vite)
- Redux Toolkit
- Tailwind CSS

### Backend

- Node.js + Express
- MongoDB Atlas
- JWT for authentication
- bcryptjs for password hashing

---

## 📁 Project Structure

```
excel-analytics-platform/
├── client/        # React frontend
│   ├── src/
│   ├── public/
│   └── ...
├── server/        # Node.js backend
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── ...
├── README.md
└── ...
```

---

## 🔐 Authentication & Authorization

- **User Registration & Login**: Implemented using JWT tokens.
- **Role-based Access**: Middleware to restrict access to admin-only routes.

---

## 📊 Core Features

- **Excel File Upload**: Users can upload `.xlsx` files for analysis.
- **Data Parsing**: Backend processes Excel files and extracts relevant data.
- **Dashboard**: Visual representation of data using charts and tables.
- **User Roles**: Admins have additional privileges like managing users.

---

## 🧪 Getting Started

### Prerequisites

- Node.js (v14 or above)
- MongoDB Atlas account

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Jeet-115/Excel-Analytics-Platform.git
   cd Excel-Analytics-Platform
   ```

2. **Setup Backend**:

   ```bash
   cd server
   npm install
   ```

   - Create a `.env` file in the `server` directory with the following:

     ```env
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

   - Start the backend server:

     ```bash
     npm run dev
     ```

3. **Setup Frontend**:

   ```bash
   cd ../client
   npm install
   ```

   - Start the frontend development server:

     ```bash
     npm run dev
     ```

4. **Access the Application**:

   - Open your browser and navigate to `http://localhost:3000`

---

