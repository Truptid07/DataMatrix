# DataMatrix Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the DataMatrix application, with:
- Backend API on Render
- Frontend on Netlify

## Prerequisites
- GitHub account with your repository pushed
- Netlify account
- Render account
- MongoDB Atlas account (already set up)

## Step 1: Deploy Backend on Render

1. **Log in to Render**:
   - Go to [render.com](https://render.com/) and log in

2. **Create a new Web Service**:
   - Click on "New +" and select "Web Service"
   - Connect your GitHub repository
   - Select the "DataMatrix" repository

3. **Configure the Service**:
   - Name: `datamatrix-api`
   - Environment: `Node`
   - Region: Choose one close to your target users
   - Branch: `render-deploy` (or your deployment branch)
   - Root Directory: `server`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Plan: Free

4. **Set Environment Variables**:
   - Click on "Advanced" and add all the environment variables from your `render.yaml` file:
     - NODE_ENV: `production`
     - PORT: `10000`
     - JWT_SECRET: `your-secure-jwt-secret-here`
     - MONGO_URI: `your-mongodb-connection-string`
     - CLIENT_URL: `https://datamatrix-frontend.netlify.app` (your Netlify URL)
     - GEMINI_API_KEY: `your-gemini-api-key`
     - OPENAI_API_KEY: `your-openai-api-key`

5. **Create Web Service**:
   - Click "Create Web Service"
   - Wait for the deployment to complete (this may take a few minutes)

6. **Verify API Deployment**:
   - Once deployed, visit `https://datamatrix-api.onrender.com`
   - You should see a JSON response: `{ "message": "DataMatrix API Server", "version": "1.0.0", "status": "running" }`
   - Also check `https://datamatrix-api.onrender.com/health` to verify MongoDB connection

## Step 2: Deploy Frontend on Netlify

1. **Log in to Netlify**:
   - Go to [netlify.com](https://www.netlify.com/) and log in

2. **Create a new Site**:
   - Click "Add new site" → "Import an existing project"
   - Connect to your GitHub repository
   - Select the "DataMatrix" repository

3. **Configure Build Settings**:
   - Base directory: `client`
   - Build command: `npm install && npm run build`
   - Publish directory: `client/dist`

4. **Set Environment Variables**:
   - Go to Site settings → Build & deploy → Environment
   - Add the following environment variables:
     - VITE_API_BASE_URL: `https://datamatrix-api.onrender.com`

5. **Deploy Site**:
   - Click "Deploy site"
   - Wait for the build and deployment to complete

6. **Set Custom Domain (Optional)**:
   - In Netlify dashboard, go to "Domain settings"
   - Click "Add custom domain" and follow the instructions

7. **Verify Frontend Deployment**:
   - Once deployed, visit your Netlify URL (`https://datamatrix-frontend.netlify.app` or similar)
   - Try logging in and using the application features

## Troubleshooting

### Backend (Render) Issues:
1. **404 Error on Root Endpoint**:
   - Verify that server.js includes the root route handler
   - Check Render logs for any startup errors

2. **MongoDB Connection Issues**:
   - Ensure MongoDB Atlas IP whitelist includes 0.0.0.0/0 (allow from anywhere)
   - Verify the MONGO_URI is correct and includes the database name

3. **API Keys Not Working**:
   - Double-check that AI API keys are correctly set in environment variables
   - Ensure no extra spaces or special characters in the keys

### Frontend (Netlify) Issues:
1. **Build Failures**:
   - Check Netlify build logs for specific error messages
   - Ensure all dependencies are properly listed in package.json
   - Move any required devDependencies to dependencies if needed

2. **API Connection Issues**:
   - Verify VITE_API_BASE_URL points to the correct Render URL
   - Check browser console for CORS errors
   - Ensure the CLIENT_URL on the backend matches the Netlify URL

3. **SPA Routing Issues**:
   - Verify that _redirects file exists in the client/public directory
   - Ensure netlify.toml is properly configured for SPA routing

## Maintaining Your Deployment

### Updates and Changes:
1. Push changes to your GitHub repository
2. Netlify and Render will automatically detect changes and redeploy

### Monitoring:
1. Use Render dashboard to monitor backend performance and logs
2. Use Netlify dashboard to monitor frontend performance and build status

## Security Notes
1. Consider changing the JWT_SECRET to a new secure value
2. Rotate API keys periodically
3. Monitor for unusual API usage or potential security issues