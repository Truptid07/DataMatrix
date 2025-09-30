# DataMatrix Deployment Troubleshooting Guide

This guide helps troubleshoot common deployment issues with the DataMatrix Excel Analytics Platform on Render.

## Common Issues and Solutions

### 1. Application Exits Early

If you see "Application exited early while running your code" in the Render logs, try these solutions:

#### Solution 1: Check MongoDB Connection

1. SSH into your Render service:
   ```
   # From the Render dashboard, open Shell
   cd server
   npm run debug:render
   ```

2. This will run a comprehensive diagnostic script and show:
   - If MongoDB URI is correctly configured
   - If DNS resolution to MongoDB Atlas works
   - If network connectivity to MongoDB Atlas is possible
   - If the MongoDB connection can be established
   - What collections exist in the database

3. Common MongoDB issues:
   - IP Allowlist restrictions in MongoDB Atlas
   - Incorrect connection string
   - Database user doesn't have the right permissions

#### Solution 2: Check Environment Variables

1. Verify all required environment variables are set in Render dashboard:
   - `MONGO_URI` (or the separate credentials)
   - `JWT_SECRET`
   - `NODE_ENV`
   - `PORT`

2. For MongoDB connection, you can use either:
   - Single connection string: `MONGO_URI=mongodb+srv://...`
   - Or separate credentials: `MONGO_USERNAME`, `MONGO_PASSWORD`, and `MONGO_CLUSTER`

#### Solution 3: Fix Startup Directory Issues

If the server can't find critical files, try this fix:

1. Update your render.yaml file:
   ```yaml
   services:
     - type: web
       name: datamatrix-api
       env: node
       plan: free
       buildCommand: npm install
       startCommand: node server.js
       rootDir: server
   ```

2. The `rootDir: server` setting ensures Render runs the server from the correct directory

### 2. MongoDB Connection Issues

If MongoDB connection is failing:

1. Check MongoDB Atlas Network Access settings:
   - Add `0.0.0.0/0` to IP allowlist to allow connections from anywhere
   - Or add specific Render IP ranges (find these in Render documentation)

2. Verify MongoDB user credentials:
   - Make sure the user exists in MongoDB Atlas
   - Check that the user has the correct permissions (at least readWrite)

3. Test the connection string locally:
   ```
   cd server
   node utils/verifyAtlasConnection.js
   ```

### 3. Frontend Can't Connect to Backend

If the frontend can't connect to your backend API:

1. Check CORS settings in server.js
2. Verify the `CLIENT_URL` environment variable is set correctly
3. Make sure the frontend's API URL points to your Render backend URL

## Using the Debug Scripts

### Basic Startup Debug

```
cd server
npm run debug
```

This shows:
- Environment variable detection
- File existence checks
- Current working directory

### Comprehensive Render Debug

```
cd server
npm run debug:render
```

This detailed script shows:
- System information
- Directory structure
- Environment variable configuration
- MongoDB connection details
- Network connectivity tests
- Actual connection test with collection listing

## Getting More Help

If issues persist after trying these solutions, check:
1. Render logs for specific error messages
2. MongoDB Atlas logs for connection failures
3. The application code for any hardcoded configuration that might conflict with environment variables

## Common Error Messages and Solutions

### MongoNetworkError: connection timed out

**Solution:** Network connectivity issue - check MongoDB Atlas Network Access settings

### MongoServerSelectionError: getaddrinfo ENOTFOUND

**Solution:** DNS resolution issue - verify the MongoDB host is correct

### MongoServerError: Authentication failed

**Solution:** Incorrect username/password - check credentials in environment variables

### Error: Cannot find module 'server.js'

**Solution:** Working directory issue - verify your Render configuration and make sure `rootDir` is set correctly

### SyntaxError: Unexpected token...

**Solution:** Code syntax issue - could be caused by Node.js version mismatch, check the Node.js version in Render settings