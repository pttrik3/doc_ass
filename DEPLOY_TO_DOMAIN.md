# Deploy Documentation Assistant to itsmyrecovery.co

This guide walks you through deploying your Documentation Assistant to your custom domain **itsmyrecovery.co** using GitHub, Vercel, and Cloudflare.

---

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com with your GitHub account)
- Cloudflare account managing itsmyrecovery.co DNS
- DeepSeek API key

---

## Part 1: Upload to GitHub

### Step 1: Download Your Project Files

1. In the Manus interface, click **Management UI** (top-right)
2. Go to **Code** panel
3. Click **Download All Files**
4. Extract the ZIP file to a folder on your computer

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `documentation-assistant` (or any name you prefer)
3. Set to **Private** (recommended to protect your code)
4. Do NOT initialize with README, .gitignore, or license (your project already has these)
5. Click **Create repository**

### Step 3: Upload Files to GitHub

**Option A: Using GitHub Web Interface (Easier)**

1. On your new repository page, click **uploading an existing file**
2. Drag and drop ALL files from your extracted folder
3. Scroll down and click **Commit changes**

**Option B: Using Git Command Line**

```bash
cd /path/to/your/extracted/folder
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/documentation-assistant.git
git push -u origin main
```

---

## Part 2: Deploy to Vercel

### Step 1: Import Project to Vercel

1. Go to https://vercel.com/new
2. Click **Import** next to your GitHub repository
3. Vercel will detect it as a Node.js project

### Step 2: Configure Build Settings

Vercel should auto-detect these settings, but verify:

- **Framework Preset**: Other
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

### Step 3: Add Environment Variables

Click **Environment Variables** and add these (one at a time):

**Required Variables:**

```
DATABASE_URL=your_mysql_connection_string
DEEPSEEK_API_KEY=your_deepseek_api_key
JWT_SECRET=your_random_secret_string
VITE_APP_TITLE=Documentation Assistant
```

**How to get DATABASE_URL:**

You have several options:

1. **PlanetScale** (Recommended - Free tier available)
   - Sign up at https://planetscale.com
   - Create a new database
   - Get connection string from dashboard
   - Format: `mysql://user:password@host/database?ssl={"rejectUnauthorized":true}`

2. **Railway** (Easy setup)
   - Sign up at https://railway.app
   - Create MySQL database
   - Copy connection string

3. **Heroku ClearDB** (Free tier)
   - Add ClearDB MySQL add-on
   - Get connection string from config vars

**How to generate JWT_SECRET:**

Run this in your terminal or use an online generator:
```bash
openssl rand -base64 32
```

### Step 4: Deploy

1. Click **Deploy**
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `documentation-assistant-xyz.vercel.app`

### Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Try logging in
3. Test document generation (make sure DeepSeek API key is working)

---

## Part 3: Connect Custom Domain (itsmyrecovery.co)

### Step 1: Add Domain in Vercel

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Domains**
3. Add domain: `itsmyrecovery.co`
4. Vercel will show you DNS records to add

### Step 2: Configure Cloudflare DNS

1. Log in to Cloudflare
2. Select your domain: **itsmyrecovery.co**
3. Go to **DNS** → **Records**

**Add these records:**

**For Root Domain (itsmyrecovery.co):**
- Type: `A`
- Name: `@`
- Content: `76.76.21.21` (Vercel's IP)
- Proxy status: **DNS only** (gray cloud) initially
- TTL: Auto

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Content: `cname.vercel-dns.com`
- Proxy status: **DNS only** (gray cloud) initially
- TTL: Auto

### Step 3: Verify Domain in Vercel

1. Back in Vercel, click **Verify** next to your domain
2. Wait a few minutes for DNS propagation
3. Once verified, Vercel will automatically provision SSL certificate

### Step 4: Enable Cloudflare Proxy (Optional)

After domain is verified and SSL is working:

1. In Cloudflare DNS, change proxy status to **Proxied** (orange cloud)
2. This adds Cloudflare's CDN and DDoS protection

### Step 5: Set SSL Mode in Cloudflare

1. In Cloudflare, go to **SSL/TLS** → **Overview**
2. Set SSL mode to: **Full (strict)**
3. This ensures end-to-end encryption

---

## Part 4: Post-Deployment Configuration

### Update OAuth Redirect URLs

If you're using Manus OAuth, you may need to update redirect URLs:

1. Contact Manus support or update in your OAuth app settings
2. Add your custom domain as allowed redirect URL

### Test Everything

1. Visit https://itsmyrecovery.co
2. Test login/logout
3. Test all document types
4. Test Group Session DAP Notes with topics
5. Test admin features (View History, Manage Topics)

---

## Troubleshooting

### Build Fails on Vercel

- Check that all environment variables are set correctly
- Verify DATABASE_URL is accessible from Vercel's servers
- Check build logs for specific errors

### Domain Not Working

- Wait 24-48 hours for full DNS propagation
- Use https://dnschecker.org to verify DNS records
- Make sure Cloudflare proxy is OFF initially during setup

### Database Connection Errors

- Verify DATABASE_URL format is correct
- Check that database allows connections from Vercel's IP ranges
- For PlanetScale, make sure SSL is enabled in connection string

### DeepSeek API Not Working

- Verify DEEPSEEK_API_KEY is set correctly in Vercel
- Check API key has sufficient credits
- Test API key directly at DeepSeek's website

---

## Updating Your Site

When you make changes:

1. Update files in your GitHub repository
2. Vercel automatically detects changes and redeploys
3. Changes go live in 2-3 minutes

---

## Security Checklist

- ✅ GitHub repository is set to **Private**
- ✅ Environment variables are set in Vercel (not in code)
- ✅ DATABASE_URL uses SSL connection
- ✅ JWT_SECRET is a strong random string
- ✅ Cloudflare SSL is set to **Full (strict)**
- ✅ Admin features restricted to pmdcredit@gmail.com

---

## Cost Estimate

- **GitHub**: Free (private repo)
- **Vercel**: Free tier (should be sufficient for your use case)
- **Database**: Free tier available on PlanetScale/Railway
- **Cloudflare**: Free tier (includes SSL and basic DDoS protection)
- **DeepSeek API**: Pay per use (very affordable)

**Total monthly cost: $0-10** (mostly DeepSeek API usage)

---

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Test database connection separately

For Manus-specific issues, contact support at https://help.manus.im
