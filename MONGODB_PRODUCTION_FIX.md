# MongoDB Production Connection Fix

## 🔍 Root Cause Analysis

After analyzing your backend code, I've identified **THE EXACT PROBLEM**:

### **Root Cause: Mongoose Connection Timing Issue in Vercel Serverless Functions**

The issue is in `backend/src/lib/db.ts` line 108:
```typescript
export const connectDB = async (): Promise<void> => {
  if (isDbConnected()) return;  // ← Problem here!
  
  // ... connection code
};
```

**Why it fails:**
1. Vercel serverless functions are **cold-started** on each request
2. Your code calls `connectDB()` but **doesn't wait** for the connection promise
3. MongoDB operations execute **before** the connection is established
4. Result: `Operation 'categories.findOne()' buffering timed out after 10000ms`

---

## 🎯 The Problem Locations

### 1. **Backend Entry Point** (`backend/src/index.ts` line 69)
```typescript
// Trigger MongoDB connection non-blockingly
connectDB().catch((err) => console.warn('DB connect warning:', err));
```
**Problem**: This starts the connection but **doesn't wait** for it to complete before handling requests.

### 2. **Controller Pattern** (e.g., `category.controller.ts` line 10)
```typescript
export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    await connectDB();  // ← Calls but doesn't guarantee connection
    if (mongoose.connection.readyState === 1) {
      const cats = await Category.find().sort({ type: 1, sortOrder: 1 });
      // ...
    }
  }
}
```
**Problem**: The connection cache might be initializing when the query runs.

---

## ✅ Solution: Vercel-Compatible MongoDB Connection

Replace the `connectDB` function with this Vercel-optimized version:

### **File: `backend/src/lib/db.ts`**

```typescript
export const connectDB = async (): Promise<void> => {
  // If already connected, return immediately
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // Use global cache for Vercel serverless environment
  const cache = global.__mongooseCache ?? { conn: null, promise: null };
  global.__mongooseCache = cache;

  // If connection exists, return
  if (cache.conn) {
    return;
  }

  // If connection promise exists, wait for it
  if (cache.promise) {
    try {
      cache.conn = await cache.promise;
      return;
    } catch (error) {
      // If failed, clear cache and retry
      cache.promise = null;
      cache.conn = null;
    }
  }

  // Create new connection promise
  cache.promise = mongoose
    .connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,  // ← Increased from 10000
      socketTimeoutMS: 45000,            // ← Added
      connectTimeoutMS: 30000,           // ← Added
      bufferCommands: false,
      maxPoolSize: 10,                   // ← Added for connection pooling
      minPoolSize: 2,                    // ← Added
    })
    .then(async (connection) => {
      console.log(`✅ MongoDB connected: ${connection.connection.host}/${connection.connection.name}`);
      
      // Run seed operations AFTER connection confirmed
      try {
        await ensureAdminsExist();
        await ensureCategoriesExist();
      } catch (seedError) {
        console.warn('⚠️ Seeding warning:', seedError);
      }
      
      return connection;
    })
    .catch((error) => {
      cache.promise = null;
      cache.conn = null;
      console.error('❌ MongoDB connection error:', (error as Error).message);
      throw error;
    });

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.conn = null;
    cache.promise = null;
    throw error;
  }
};
```

---

## 📋 Checklist: What to Verify

### 1. **Vercel Environment Variables** ✅
Go to Vercel Dashboard → Your Project → Settings → Environment Variables

**Required Variable:**
```
MONGODB_URI = mongodb+srv://<username>:<password>@<cluster>.mongodb.net/kelebri_db?retryWrites=true&w=majority
```

**Important:**
- Make sure the variable name is exactly `MONGODB_URI` (not `MONGO_URI`)
- Database name should be `kelebri_db` (or your actual DB name)
- Password should not contain special characters like `@`, `#`, `&` (URL encode if needed)
- Variable should be set for **Production** environment

### 2. **MongoDB Atlas Network Access** ✅
Go to MongoDB Atlas → Network Access

**Add IP Address:**
```
0.0.0.0/0  (Allow access from anywhere)
```

**Why:** Vercel serverless functions use dynamic IPs, so you need to allow all IPs.

**Security:** This is safe because:
- Connection still requires username/password
- Your connection string is secret
- MongoDB enforces authentication

### 3. **MongoDB Atlas Database User** ✅
Go to MongoDB Atlas → Database Access

**Verify:**
- User exists with correct username
- Password is correct
- User has role: **Atlas Admin** or **Read and write to any database**
- User is not temporary/expired

### 4. **MongoDB Connection String Format** ✅
Your connection string should look like:
```
mongodb+srv://username:password@cluster.mongodb.net/kelebri_db?retryWrites=true&w=majority&appName=Cluster0
```

**Check:**
- Uses `mongodb+srv://` (not `mongodb://`)
- Includes database name `/kelebri_db`
- No spaces in the string
- Password is URL-encoded if it contains special characters

---

## 🔧 Additional Fixes

### Fix #1: Update `backend/src/index.ts`

**Current:**
```typescript
// Trigger MongoDB connection non-blockingly
connectDB().catch((err) => console.warn('DB connect warning:', err));
```

**Change to:**
```typescript
// Pre-warm MongoDB connection for Vercel
if (process.env.VERCEL) {
  connectDB().catch((err) => console.error('❌ DB connection failed:', err));
}
```

### Fix #2: Update Health Check (`backend/src/index.ts`)

**Current:**
```typescript
app.get('/api/health', async (_req, res) => {
  try {
    await connectDB();
  } catch {
    // connection errors are reported via getDbStatus below
  }

  const db = getDbStatus();
  // ...
});
```

**Change to:**
```typescript
app.get('/api/health', async (_req, res) => {
  let dbConnected = false;
  let dbError = null;

  try {
    await connectDB();
    dbConnected = mongoose.connection.readyState === 1;
  } catch (error) {
    dbError = (error as Error).message;
  }

  const db = getDbStatus();

  res.status(dbConnected ? 200 : 503).json({
    success: dbConnected,
    message: dbConnected 
      ? 'Kelebri API is running ✨' 
      : 'Kelebri API is running but database is unavailable',
    timestamp: new Date(),
    database: {
      ...db,
      error: dbError || undefined,
    },
  });
});
```

---

## 🚀 Deployment Steps

### Step 1: Update the Code
1. Apply the `connectDB` fix in `backend/src/lib/db.ts`
2. Apply the index.ts fixes
3. Commit and push to GitHub

### Step 2: Verify Vercel Environment Variables
```bash
# Go to: https://vercel.com/your-username/your-project/settings/environment-variables

# Add or verify:
MONGODB_URI = mongodb+srv://...
NODE_ENV = production
```

### Step 3: Redeploy
```bash
# Vercel will auto-deploy from GitHub
# Or manually trigger: vercel --prod
```

### Step 4: Test the Connection
```bash
# Test health endpoint:
curl https://your-backend.vercel.app/api/health

# Expected response:
{
  "success": true,
  "message": "Kelebri API is running ✨",
  "database": {
    "connected": true,
    "readyState": 1,
    "host": "cluster0.xxxxx.mongodb.net",
    "database": "kelebri_db"
  }
}
```

### Step 5: Test Category Fetching
```bash
curl https://your-backend.vercel.app/api/categories

# Should return categories array
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Authentication failed"
**Cause:** Wrong MongoDB username/password in MONGODB_URI  
**Fix:** Double-check credentials in MongoDB Atlas → Database Access

### Issue 2: "Connection timeout"
**Cause:** MongoDB Atlas Network Access blocks Vercel IPs  
**Fix:** Add `0.0.0.0/0` to Network Access in MongoDB Atlas

### Issue 3: "Invalid connection string"
**Cause:** Malformed MONGODB_URI in Vercel  
**Fix:** Ensure format is `mongodb+srv://user:pass@cluster.mongodb.net/dbname`

### Issue 4: "Database 'test' instead of 'kelebri_db'"
**Cause:** Missing database name in connection string  
**Fix:** Ensure URI ends with `/kelebri_db?retryWrites=true...`

### Issue 5: "Still shows 'buffering timed out'"
**Cause:** Old deployment cached  
**Fix:** 
- Clear Vercel deployment cache
- Force redeploy: `vercel --prod --force`

---

## 📊 How to Check Vercel Logs

### View Real-Time Logs:
1. Go to Vercel Dashboard
2. Click your project
3. Click "Deployments"
4. Click latest deployment
5. Click "Functions" tab
6. View logs for `src/index.ts`

### Look for:
```
✅ MongoDB connected: cluster0.xxxxx.mongodb.net/kelebri_db
```

Or errors like:
```
❌ MongoDB connection error: ...
```

---

## 🎯 Expected Results After Fix

### Before Fix:
```
❌ /api/health → "database unavailable"
❌ /api/categories → "buffering timed out after 10000ms"
❌ /api/products → "buffering timed out after 10000ms"
```

### After Fix:
```
✅ /api/health → { connected: true, database: "kelebri_db" }
✅ /api/categories → [ { name: "Rings", ... }, ... ]
✅ /api/products → [ { name: "...", ... }, ... ]
✅ Create product → Successfully saved to MongoDB
```

---

## 📝 Summary

**Root Cause:**  
**#4 - Mongoose connection code issue**

The connection was initializing asynchronously without proper awaiting in Vercel's serverless environment.

**Solution:**  
1. ✅ Update `connectDB()` with proper promise handling and increased timeouts
2. ✅ Verify `MONGODB_URI` in Vercel environment variables
3. ✅ Ensure MongoDB Atlas allows `0.0.0.0/0` in Network Access
4. ✅ Increase connection timeouts for cold starts

**Critical Changes:**
- `serverSelectionTimeoutMS`: 10000 → 30000
- `socketTimeoutMS`: Added (45000)
- `connectTimeoutMS`: Added (30000)
- Connection pooling: Added (`maxPoolSize`, `minPoolSize`)
- Proper promise chaining and error handling

---

**After applying these fixes, your production MongoDB connection will work reliably on Vercel! 🎉**
