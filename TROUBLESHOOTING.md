# Image Upload Troubleshooting Guide

## Quick Checklist

1. ✅ **Backend Server Running**
   ```bash
   cd backend
   npm run dev
   ```
   Should see: `✨ Kelebri API running on http://localhost:5000`

2. ✅ **Frontend Server Running**
   ```bash
   cd frontend
   npm run dev
   ```
   Should see: `Local: http://localhost:5173`

3. ✅ **Cloudinary Configured**
   - Check `backend/.env` has real credentials (not placeholder values)
   - Run: `cd backend && node check-config.js`

4. ✅ **Logged In**
   - Make sure you're logged in to the admin panel
   - Email: `admin@kelebri.com`
   - Password: `Kelebri@Admin2024`

## Testing Methods

### Method 1: Use the Test Page (Easiest)

1. Make sure backend is running
2. Open `test-upload.html` in your browser
3. Click "Login" (password is pre-filled)
4. Select an image and click "Upload Image"
5. If successful, you'll see the uploaded image

### Method 2: Use Browser Dev Tools

1. Go to admin panel: http://localhost:5173/admin/products/new
2. Open browser console (F12)
3. Try uploading an image
4. Check console for messages starting with 📤, ✅, or ❌
5. Look for error messages

### Method 3: Check Backend Logs

1. Go to the terminal where backend is running
2. Try uploading an image
3. Look for messages starting with 📤, ✅, or ❌

## Common Issues

### Issue 1: "Cannot connect to server" or Network Error

**Cause:** Backend is not running

**Solution:**
```bash
cd backend
npm run dev
```

**Verify:** Open http://localhost:5000/api/health in browser
- Should see: `{"success":true,"message":"Kelebri API is running ✨"}`

---

### Issue 2: "Cloudinary not configured"

**Cause:** Missing or placeholder Cloudinary credentials

**Solution:**
1. Check `backend/.env` file
2. Make sure these lines have REAL values:
   ```env
   CLOUDINARY_CLOUD_NAME=chaixproject
   CLOUDINARY_API_KEY=914489459144653
   CLOUDINARY_API_SECRET=NberdmmJ-tFI0a4o14uELncPr7w
   ```
3. NOT placeholder values like `your_cloud_name`
4. Restart backend server after changes

**Verify:**
```bash
cd backend
node check-config.js
```
Should show ✅ for all Cloudinary fields

---

### Issue 3: "401 Unauthorized" or "Please login again"

**Cause:** JWT token expired or missing

**Solution:**
1. Logout from admin panel
2. Login again with:
   - Email: `admin@kelebri.com`
   - Password: `Kelebri@Admin2024`
3. Try uploading again

**Verify:** Check localStorage in browser dev tools
- Should have `kelebri_token` entry

---

### Issue 4: "Invalid signature" or "Invalid credentials" from Cloudinary

**Cause:** Wrong Cloudinary credentials

**Solution:**
1. Go to https://cloudinary.com
2. Login to your account
3. Go to Dashboard
4. Copy the EXACT values for:
   - Cloud Name
   - API Key
   - API Secret (click "Show" to reveal)
5. Update `backend/.env`
6. Restart backend

---

### Issue 5: Upload starts but never completes

**Cause:** Large file or slow connection to Cloudinary

**Solution:**
1. Try with a smaller image (< 1MB)
2. Check your internet connection
3. Make sure firewall isn't blocking Cloudinary
4. Check backend logs for errors

---

### Issue 6: CORS error in browser console

**Cause:** Frontend and backend URLs mismatch

**Solution:**
1. Check `backend/.env`:
   ```env
   FRONTEND_URL=http://localhost:5173
   ```
2. Check `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Restart both servers

---

## Debug Commands

### Check if backend is running:
```bash
curl http://localhost:5000/api/health
```

### Check if frontend is running:
```bash
curl http://localhost:5173
```

### Check Cloudinary config:
```bash
cd backend
node check-config.js
```

### View backend logs:
Look at the terminal where you ran `npm run dev` in the backend folder

### View frontend logs:
Open browser console (F12) and look for messages

---

## Still Not Working?

1. **Stop both servers** (Ctrl+C)
2. **Clear browser cache** and localStorage
3. **Restart backend:**
   ```bash
   cd backend
   npm run dev
   ```
4. **Restart frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
5. **Login fresh** to admin panel
6. **Try the test page** (`test-upload.html`)
7. **Check all logs** (browser console + backend terminal)

---

## Get Help

If still not working, provide these details:

1. Output of: `cd backend && node check-config.js`
2. Backend terminal logs when trying to upload
3. Browser console errors (F12)
4. Screenshots of the error messages

---

## Success!

If upload works, you should see:
- ✅ Toast notification "Images uploaded successfully"
- Image preview appears in the admin form
- Backend logs show: `✅ Cloudinary upload success: https://res.cloudinary.com/...`
