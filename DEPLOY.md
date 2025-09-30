# 🚀 DataMatrix Deployment Guide - Render

This guide will help you deploy the DataMatrix Excel Analytics Platform on Render.

## 📋 Prerequisites

- ✅ GitHub repository with your code
- ✅ MongoDB Atlas account and cluster setup
- ✅ OpenAI API key
- ✅ Google Gemini API key
- ✅ Render account (free tier available)

## 🎯 Deployment Steps

### **Step 1: Prepare Your Repository**

1. Ensure all files are committed and pushed to GitHub
2. Verify `.env` files are in `.gitignore` (security!)
3. Make sure `render.yaml` is in your root directory

### **Step 2: Deploy Backend (API)**

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service**:
   ```
   Name: datamatrix-api
   Environment: Node
   Build Command: cd server && npm install  
   Start Command: cd server && npm start
   ```

5. **Add Environment Variables**:
   ```
   NODE_ENV = production
   PORT = 10000
   MONGO_URI = mongodb+srv://admin:YOUR_PASSWORD@data.4o0pbic.mongodb.net/?retryWrites=true&w=majority&appName=data
   JWT_SECRET = your_jwt_secret_key_here
   GEMINI_API_KEY = [your_gemini_api_key]
   OPENAI_API_KEY = [your_openai_api_key]
   CLIENT_URL = https://your-frontend-url.onrender.com
   ```

6. **Click "Create Web Service"**

### **Step 3: Deploy Frontend**

1. **Click "New +"** → **"Static Site"**
2. **Connect the same GitHub repository**
3. **Configure the static site**:
   ```
   Name: datamatrix-frontend
   Build Command: cd client && npm install && npm run build
   Publish Directory: client/dist
   ```

4. **Create environment variable for frontend**:
   - Create `client/.env.production` with:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```

### **Step 4: Update URLs**

1. **Copy your backend URL** (e.g., `https://datamatrix-api.onrender.com`)
2. **Update CLIENT_URL** in backend environment variables
3. **Copy your frontend URL** (e.g., `https://datamatrix-frontend.onrender.com`)  
4. **Update VITE_API_BASE_URL** in frontend

### **Step 5: Create Admin User**

After successful deployment, create admin user:

1. Go to your backend URL: `https://your-api-url.onrender.com/health`
2. Use Render's shell or create a one-time script to run:
   ```bash
   node utils/createAdmin.js
   ```

## 🔧 Environment Variables Reference

### **Backend (.env)**
```env
NODE_ENV=production
PORT=10000
MONGO_URI=
JWT_SECRET=your_64_char_secret
GEMINI_API_KEY=[your_gemini_key]
OPENAI_API_KEY=[your_openai_key]
CLIENT_URL=https://datamatrix-frontend.onrender.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### **Frontend (.env.production)**
```env
VITE_API_BASE_URL=https://datamatrix-api.onrender.com
```

## ⚡ Quick Deploy Commands

If you prefer using Render CLI:

```bash
# Install Render CLI
npm install -g @render-com/cli

# Deploy backend
render deploy --service-type web --name datamatrix-api

# Deploy frontend  
render deploy --service-type static --name datamatrix-frontend
```

## 🔍 Testing Deployment

1. **Backend Health Check**: `https://your-api-url.onrender.com/health`
2. **Frontend Access**: `https://your-frontend-url.onrender.com`
3. **Admin Login**: Use `admin@datamatrix.com` / `datamatrix2025`

## 🛠️ Troubleshooting

### **Common Issues:**

1. **Build Failed**: Check build logs for missing dependencies
2. **CORS Errors**: Ensure CLIENT_URL is set correctly in backend
3. **Database Connection**: Verify MONGO_URI and network access
4. **API Not Found**: Check VITE_API_BASE_URL in frontend

### **Logs Access:**
- Backend logs: Render Dashboard → Your Service → Logs
- Build logs: Available during deployment process

## 📈 Post-Deployment

- ✅ Test all features (login, file upload, charts)
- ✅ Monitor performance in Render dashboard  
- ✅ Set up custom domains (optional)
- ✅ Configure SSL certificates (auto-enabled)

## 🎉 Success!

Your DataMatrix Excel Analytics Platform should now be live and accessible worldwide! 🌍

**Frontend**: https://your-frontend.onrender.com  
**API**: https://your-api.onrender.com  
**Admin Panel**: Login with admin credentials