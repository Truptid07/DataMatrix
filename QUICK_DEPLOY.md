# Deploy to Render Quickstart Guide

## 1. Environment Variables Setup

### MongoDB Connection (Choose ONE method)

#### Option A: Direct MongoDB URI
```
MONGO_URI=mongodb+srv://admin:Vxf3OkO4vVh9abMT@data.4o0pbic.mongodb.net/?retryWrites=true&w=majority&appName=data
```

#### Option B: Separate MongoDB Credentials (Recommended for Render)
```
MONGO_USERNAME=admin
MONGO_PASSWORD=Vxf3OkO4vVh9abMT
MONGO_CLUSTER=data.4o0pbic.mongodb.net
```

### Required Environment Variables
```
JWT_SECRET=5a22f470a58797fcce51f69a8fed748237ec9e90084e987234f725f8972b69d0a6dbf102f7c3299049399b96cda2ca3abbf328204455ba538cfd8af600431624
NODE_ENV=production
PORT=10000
CLIENT_URL=https://your-frontend-url.onrender.com
```

## 2. Backend Setup

1. Create a new Web Service on Render
2. Link to your GitHub repository
3. Use the following settings:
   - Name: `datamatrix-api`
   - Environment: `Node`
   - Build Command: `npm install` 
   - Start Command: `node server/server.js`
   - Add the environment variables from Step 1

## 3. Frontend Setup

1. Create a new Static Site on Render
2. Link to the same GitHub repository
3. Use the following settings:
   - Name: `datamatrix-frontend`
   - Build Command: `cd client && npm install && npm run build`
   - Publish Directory: `client/dist`
   - Add environment variable: `VITE_API_BASE_URL=https://datamatrix-api.onrender.com`
   
## 4. Verify Deployment

1. Check if backend health endpoint works: https://datamatrix-api.onrender.com/health
2. Visit frontend: https://datamatrix-frontend.onrender.com
3. Test login with admin credentials

## 5. Troubleshooting

### MongoDB Connection Issues

If you see MongoDB authentication errors in the logs:

1. **Test MongoDB Connection Directly**:
   - In Render's Web Service shell, run:
   ```bash
   node server/utils/testMongoDB.js
   ```

2. **Check MongoDB Atlas Settings**:
   - **Network Access**: Make sure MongoDB Atlas has `0.0.0.0/0` (allow access from anywhere) in the Network Access settings
   - **Database User**: Verify the credentials for user "admin" are correct
   - **Database**: Ensure the cluster name `data.4o0pbic.mongodb.net` is correct

3. **Verify Environment Variables**:
   - Double check either MONGO_URI is set correctly
   - Or all three parts (MONGO_USERNAME, MONGO_PASSWORD, MONGO_CLUSTER) are set correctly

### Other Common Issues

- Check Render logs for both services
- Verify all environment variables are set correctly
- Check CORS settings if frontend can't connect to backend
- Make sure the MongoDB user has the necessary permissions