# Cloudinary Setup Guide

Image uploads are not working because Cloudinary needs to be configured. Follow these steps:

## Step 1: Get Cloudinary Account (Free)

1. Go to https://cloudinary.com
2. Click "Sign Up for Free"
3. Create a free account (no credit card required)
4. After signing up, you'll be redirected to your Dashboard

## Step 2: Get Your Credentials

On your Cloudinary Dashboard, you'll see:
- **Cloud Name** (e.g., `dxxxxx123`)
- **API Key** (e.g., `123456789012345`)
- **API Secret** (click "Show" to reveal it, e.g., `abcdefghijklmnopqrstuvwxyz`)

## Step 3: Update Backend .env File

Open `backend/.env` and replace these lines:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

With your actual credentials:

```env
CLOUDINARY_CLOUD_NAME=dxxxxx123
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

## Step 4: Restart Backend Server

1. Stop the backend server if it's running (Ctrl+C)
2. Start it again:
   ```bash
   cd backend
   npm run dev
   ```

## Step 5: Test Image Upload

1. Go to your admin panel
2. Try adding a product
3. Upload an image
4. It should work now! 🎉

## Troubleshooting

**Error: "Cloudinary not configured"**
- Make sure you've added the credentials to `backend/.env`
- Make sure you restarted the backend server
- Check that the .env file is in the `backend` folder (not the root)

**Error: "Invalid credentials"**
- Double-check your credentials from the Cloudinary dashboard
- Make sure there are no spaces before or after the values
- Make sure you copied the API Secret correctly (it's hidden by default)

**Error: "401 Unauthorized"**
- Make sure you're logged in to the admin panel
- Try logging out and logging back in

## Free Plan Limits

Cloudinary's free plan includes:
- ✅ 25 GB storage
- ✅ 25 GB bandwidth per month
- ✅ Up to 25,000 transformations per month

This is more than enough for a jewelry store!

---

Need help? Check the Cloudinary documentation: https://cloudinary.com/documentation
