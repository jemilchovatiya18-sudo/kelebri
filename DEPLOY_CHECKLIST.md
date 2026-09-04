# 🚀 MongoDB Production Deployment Checklist

## ✅ What I Fixed

### 1. **MongoDB Connection Code** (Root Cause #4)
- ✅ Increased timeouts for Vercel cold starts
- ✅ Added proper connection pooling
- ✅ Improved error handling and promise management
- ✅ Better health check reporting

### 2. **Files Modified**
- ✅ `backend/src/lib/db.ts` - Updated `connectDB()` function
- ✅ `backend/src/index.ts` - Improved health check and pre-warming

---

## 📋 Before Deploying - Verify These Settings

### Step 1: Check MongoDB Atlas Network Access
1. Go to: https://cloud.mongodb.com
2. Select your project
3. Click "Network Access" (left sidebar)
4. Verify entry exists:
   ```
   IP Address: 0.0.0.0/0
   Comment: Allow from anywhere (Vercel)
   ```
5. If missing, click **"ADD IP ADDRESS"** → Select **"ALLOW ACCESS FROM ANYWHERE"** → Confirm

**Why:** Vercel uses dynamic IPs, so we need to allow all IPs (still secure with password auth)

---

### Step 2: Check MongoDB Atlas Database User
1. In MongoDB Atlas, click "Database Access" (left sidebar)
2. Verify your database user:
   - ✅ Username matches your connection string
   - ✅ Password is correct (no special characters like @, #, &)
   - ✅ Database User Privileges: **"Atlas Admin"** or **"Read and write to any database"**
   - ✅ User is not expired or temporary

3. If unsure, **reset the password**:
   - Click "EDIT" on your user
   - Click "Edit Password"
   - Set a simple password (e.g., `MySecurePass123`)
   - Click "Update User"
   - **Update your MONGODB_URI in Vercel with the new password**

---

### Step 3: Verify Vercel Environment Variables

1. Go to: https://vercel.com
2. Select your backend project
3. Go to **Settings** → **Environment Variables**
4. Verify `MONGODB_URI` exists and is correct:

**Correct Format:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/kelebri_db?retryWrites=true&w=majority
```

**Check:**
- ✅ Starts with `mongodb+srv://` (not `mongodb://`)
- ✅ Username is correct
- ✅ Password is correct (URL-encode if it has special chars)
- ✅ Cluster address is correct (`@cluster0.xxxxx.mongodb.net`)
- ✅ Database name is `/kelebri_db` (before the `?`)
- ✅ Environment is set to **Production**

**If password contains special characters, URL-encode them:**
```
@ → %40
# → %23
$ → %24
& → %26
= → %3D
+ → %2B
```

---

### Step 4: Deploy the Fixed Code

```bash
# Commit the changes
git add backend/src/lib/db.ts backend/src/index.ts
git commit -m "fix: improve MongoDB connection for Vercel serverless"
git push origin main

# Vercel will auto-deploy
# Or manually: vercel --prod
```

---

## 🧪 Testing After Deployment

### Test 1: Health Check
```bash
curl https://your-backend.vercel.app/api/health
```

**Expected (Success):**
```json
{
  "success": true,
  "message": "Kelebri API is running ✨",
  "timestamp": "2025-01-XX...",
  "database": {
    "connected": true,
    "readyState": 1,
    "host": "cluster0.xxxxx.mongodb.net",
    "database": "kelebri_db"
  }
}
```

**If still failing:**
```json
{
  "success": false,
  "message": "Kelebri API is running but database is unavailable",
  "database": {
    "connected": false,
    "readyState": 0,
    "error": "connection timeout" // ← Check this error
  }
}
```

---

### Test 2: Fetch Categories
```bash
curl https://your-backend.vercel.app/api/categories
```

**Expected:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Rings",
      "slug": "rings",
      "type": "JEWELRY",
      ...
    },
    ...
  ]
}
```

---

### Test 3: Create a Product (Use Postman or frontend)

1. Login to admin panel
2. Go to Products → Add Product
3. Fill in details and save

**Expected:**
✅ Product saves successfully
✅ No "buffering timed out" error
✅ Product appears in MongoDB Atlas (check Data → Browse Collections)

---

## 🐛 Troubleshooting

### Error: "Authentication failed"
**Cause:** Wrong username/password in MONGODB_URI

**Fix:**
1. Go to MongoDB Atlas → Database Access
2. Reset the user's password
3. Update `MONGODB_URI` in Vercel with new password
4. Redeploy

---

### Error: "Connection timeout" or "ETIMEDOUT"
**Cause:** Network Access blocks Vercel IPs

**Fix:**
1. Go to MongoDB Atlas → Network Access
2. Add IP: `0.0.0.0/0` (Allow from anywhere)
3. Wait 2-3 minutes for Atlas to apply
4. Try again

---

### Error: "Could not connect to any servers"
**Cause:** Wrong cluster address in MONGODB_URI

**Fix:**
1. Go to MongoDB Atlas → Database → Connect
2. Copy the connection string
3. Replace `<password>` with your actual password
4. Update `MONGODB_URI` in Vercel
5. Redeploy

---

### Error: "Authentication failed for database 'kelebri_db'"
**Cause:** User doesn't have permission for this database

**Fix:**
1. Go to MongoDB Atlas → Database Access
2. Click "EDIT" on your user
3. Change privileges to: **"Read and write to any database"**
4. Click "Update User"
5. Try again

---

### Still not working after all fixes?
**Check Vercel Logs:**

1. Go to Vercel Dashboard
2. Click your project
3. Click "Deployments"
4. Click the latest deployment
5. Click "Functions" tab
6. Look for logs from `src/index.ts`

**Look for:**
```
✅ MongoDB connected: cluster0.xxxxx.mongodb.net/kelebri_db
```

**Or errors:**
```
❌ MongoDB connection error: [specific error message]
```

Share the specific error message for further help.

---

## 📊 What Changed in the Code

### Before (Old Code):
```typescript
// backend/src/lib/db.ts
export const connectDB = async (): Promise<void> => {
  if (isDbConnected()) return;
  
  // ... minimal connection logic
  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,  // ❌ Too short
    bufferCommands: false,
  })
};
```

**Problem:** 10-second timeout too short for Vercel cold starts

### After (Fixed Code):
```typescript
export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) return;
  
  // ... improved cache management
  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,  // ✅ 30 seconds
    socketTimeoutMS: 45000,            // ✅ Added
    connectTimeoutMS: 30000,           // ✅ Added
    bufferCommands: false,
    maxPoolSize: 10,                   // ✅ Connection pooling
    minPoolSize: 2,                    // ✅ Min connections
  })
};
```

**Improvements:**
- ✅ 3x longer timeout for cold starts
- ✅ Connection pooling for performance
- ✅ Better error handling
- ✅ Proper promise management

---

## ✅ Success Criteria

After deploying, you should see:

1. **Health Endpoint**
   - ✅ Status: 200
   - ✅ connected: true
   - ✅ database: "kelebri_db"

2. **Categories Endpoint**
   - ✅ Returns 10 categories
   - ✅ No timeout errors

3. **Products Endpoint**
   - ✅ Can list products
   - ✅ Can create products
   - ✅ Can edit products

4. **MongoDB Atlas**
   - ✅ See data in Collections
   - ✅ See connection activity

---

## 🎯 Summary

**Root Cause:** Mongoose connection timeouts in Vercel serverless cold starts

**Solution Applied:**
1. ✅ Increased connection timeouts (10s → 30s)
2. ✅ Added connection pooling
3. ✅ Improved promise handling
4. ✅ Better error reporting

**What You Need to Check:**
1. ✅ MongoDB Atlas Network Access: `0.0.0.0/0`
2. ✅ MongoDB Atlas User: Correct password & permissions
3. ✅ Vercel MONGODB_URI: Correct format with database name
4. ✅ Deploy the fixed code

---

**After following this checklist, your production MongoDB should work perfectly! 🎉**

**Questions? Check Vercel logs for specific error messages.**
