# 🔍 DataMatrix Render Deployment Troubleshooting

If you're encountering deployment issues on Render, follow this troubleshooting guide.

## 🚨 Common Issue: "Application exited early"

### 1️⃣ Check Environment Variables

Make sure all required environment variables are set in the Render dashboard:

```
MONGO_URI=mongodb+srv://admin:YOUR_PASSWORD@data.4o0pbic.mongodb.net/?retryWrites=true&w=majority&appName=data
JWT_SECRET=your_jwt_secret
NODE_ENV=production
PORT=10000
CLIENT_URL=https://your-frontend-url.onrender.com
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
```

### 2️⃣ Verify MongoDB Connection

Make sure:
- Your MongoDB Atlas cluster is running
- IP access is set to "Allow Access from Anywhere" (0.0.0.0/0)
- The password in your connection string is correct
- Database user has correct permissions

### 3️⃣ Check Render Logs

In your Render dashboard:
1. Go to your web service
2. Click on "Logs" tab
3. Look for specific error messages

### 4️⃣ Update Start Command

Try these alternative start commands in Render dashboard:

```
# Option 1: Basic node command
node server/server.js

# Option 2: Use npm start from root
npm start

# Option 3: Navigate to server directory first
cd server && npm start
```

### 5️⃣ Check Node.js Version

Ensure your Node.js version is compatible:
- Render supports Node.js 14, 16, 18, and 20
- Set Node.js version in Render dashboard to 18.x

### 6️⃣ Test Local Build

Run these commands locally to test your build process:

```bash
# Option 1: Test from root directory
npm install
cd server 
npm install
node server.js

# Option 2: Test with the exact Render command
cd server && npm install && node server.js
```

### 7️⃣ Verify Package.json

Check these in your server/package.json:
- "type": "module" is present (for ES Modules)
- Main entry point is correct
- All dependencies are properly listed

### 8️⃣ Manual Deployment Steps

If the automatic deployment isn't working, try these manual steps:

1. In Render Dashboard → New → Web Service
2. Connect your GitHub repository
3. Use manual settings:
   - Name: datamatrix-api
   - Environment: Node
   - Build Command: `cd server && npm install`
   - Start Command: `node server/server.js`
   - Add all environment variables

### 9️⃣ File Structure Issues

Ensure your files are in the correct location:
- server.js should be in the server directory
- package.json should be in both root and server directories
- node_modules should not be committed to git

### 🔟 Error-specific Solutions

#### MongoDB Connection Errors:
- Check network access rules in MongoDB Atlas
- Verify username/password in connection string
- Ensure connection string format is correct

#### Port Conflicts:
- Use `process.env.PORT || 10000` in your code
- Avoid hardcoding ports

#### Memory Issues:
- Ensure your application doesn't exceed free tier limits
- Monitor memory usage in Render dashboard

## 📞 Still Having Issues?

If you're still having trouble:

1. Try deploying the backend first WITHOUT the frontend
2. Use a simplified server.js for initial deployment
3. Check Render status page for any ongoing service issues
4. Reach out to Render support with error logs

Remember to check the logs for specific error messages - they're your best clue for troubleshooting!