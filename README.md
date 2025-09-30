🚀 Live Demo: [DataMatrix Frontend](https://datamatrix-ui.onrender.com/)


# 📊 DataMatrix Excel Analytics Platform

A powerful full-stack Excel analytics web application that allows users to upload Excel files, perform advanced data analysis, and visualize results through an intuitive modern dashboard. Features secure authentication, role-based access control, AI-powered insights, and a beautiful glassmorphism UI design.

---

## 🚀 Features

✨ **Modern UI/UX** - Purple glassmorphism design with smooth animations  
📊 **Excel Analytics** - Advanced data parsing and visualization  
🤖 **AI Insights** - Powered by OpenAI and Google Gemini APIs  
🔐 **Secure Authentication** - JWT-based with role management  
👨‍💼 **Admin Panel** - Complete user and file management system  
🌍 **Multi-language** - Support for 5+ languages  
📱 **Responsive Design** - Works seamlessly on all devices  

---

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite
- **Redux Toolkit** for state management
- **Tailwind CSS v4.1.4** for styling
- **Framer Motion** for animations
- **Chart.js & Recharts** for data visualization

### Backend
- **Node.js + Express** server
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **OpenAI & Gemini APIs** for AI insights
- **Multer** for file uploads

---

## 📁 Project Structure

```
DataMatrix/
├── client/        # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   └── services/
│   └── public/
├── server/        # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── utils/
└── README.md
```

---

## 🔐 Authentication & Authorization

- **User Registration & Login** with JWT tokens
- **Role-based Access Control** (User/Admin)
- **Protected Routes** with middleware validation
- **Admin Panel** with user management capabilities

---

## 📊 Core Features

### 🔍 **Data Analysis**
- Excel file upload and parsing
- Interactive charts and visualizations
- Statistical insights and trends
- Export capabilities (PDF, PNG)

### 🤖 **AI-Powered Insights**
- Automated data pattern recognition
- Natural language explanations
- Predictive analytics
- Smart recommendations

### 👨‍💼 **Admin Features**
- User management dashboard
- File oversight and control
- System analytics and statistics
- Role assignment capabilities

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or above)
- **MongoDB** (local or Atlas)
- **Git** for version control

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Truptid07/DataMatrix.git
   cd DataMatrix
   ```

2. **Setup Backend**:

   ```bash
   cd server
   npm install
   ```

   - Create a `.env` file in the `server` directory:

     ```env
     # AI Services
     GEMINI_API_KEY=your_gemini_api_key
     OPENAI_API_KEY=your_openai_api_key

     # Database
     MONGO_URI=mongodb://localhost:27017/excel-analytics-platform

     # Authentication
     JWT_SECRET=your_jwt_secret_key

     # Server Configuration
     PORT=5000
     CLIENT_URL=http://localhost:5174
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

4. **Create Admin User**:

   ```bash
   cd server
   node utils/createAdmin.js
   ```

5. **Access the Application**:

   - **Frontend:** `http://localhost:5174`
   - **Backend API:** `http://localhost:5000`

---

## 🔑 Default Credentials

### Admin Login:
- **Email:** admin@datamatrix.com
- **Password:** datamatrix2025

---

## 🌟 Screenshots

*Coming soon - Upload screenshots of your beautiful DataMatrix interface!*

---

## 🚀 Deployment

The application is ready for deployment on platforms like:
- **Vercel** (Frontend)
- **Railway/Render** (Backend)
- **MongoDB Atlas** (Database)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues).

---

## ⭐ Show Your Support

Give a ⭐ if you like this project and found it helpful!

---

