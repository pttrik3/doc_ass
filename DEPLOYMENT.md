# Deployment Guide

This guide explains how to deploy the Documentation Assistant to your own domain.

## Prerequisites

- A hosting platform account (Vercel, Railway, Render, etc.)
- A MySQL or TiDB database (can be provided by hosting platform)
- A DeepSeek API account ([Sign up here](https://platform.deepseek.com/))

## Environment Variables

Your hosting platform will need these environment variables configured:

### Required Variables

```
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your-secure-random-secret-key
VITE_APP_TITLE=Documentation Assistant
VITE_APP_LOGO=/logo.svg
```

### Optional OAuth Variables (if using Manus OAuth)

```
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im
VITE_APP_ID=your-app-id
OWNER_OPEN_ID=your-owner-open-id
OWNER_NAME=Your Name
```

**Important**: 
- Generate `JWT_SECRET` using: `openssl rand -base64 32`
- DeepSeek API keys are NOT stored in environment variables - users provide them through the UI

## Deployment Options

### Option 1: Vercel (Recommended for Beginners)

1. **Push to GitHub**: Upload your code to a private GitHub repository
2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
3. **Configure Environment Variables**:
   - Add all required variables in Vercel dashboard
   - Settings → Environment Variables
4. **Deploy**: Vercel will automatically build and deploy
5. **Database Setup**:
   - Use Vercel's MySQL addon or external database (PlanetScale, Railway)
   - Run migrations: `pnpm db:push`

### Option 2: Railway

1. **Push to GitHub**: Upload your code to a private GitHub repository
2. **Create New Project**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
3. **Add Database**:
   - Click "+ New" → "Database" → "MySQL"
   - Railway will automatically set `DATABASE_URL`
4. **Configure Environment Variables**:
   - Settings → Variables
   - Add `JWT_SECRET` and other required variables
5. **Deploy**: Railway will automatically build and deploy
6. **Run Migrations**:
   - Open Railway shell
   - Run: `pnpm db:push`

### Option 3: Render

1. **Push to GitHub**: Upload your code to a private GitHub repository
2. **Create Web Service**:
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
3. **Configure Build Settings**:
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `pnpm start`
4. **Add Database**:
   - Create a new MySQL database in Render
   - Copy `DATABASE_URL` to environment variables
5. **Configure Environment Variables**:
   - Environment → Add all required variables
6. **Deploy**: Render will build and deploy
7. **Run Migrations**: Use Render shell to run `pnpm db:push`

## Post-Deployment Steps

### 1. Verify Database Connection

Check that your application can connect to the database:
- Visit your deployed URL
- Try to register a new account
- If successful, database connection is working

### 2. Configure First Admin User

The first user to register will need admin privileges to manage templates:
- Register your account
- Manually update the database to set `role = 'admin'` for your user
- Or use the database UI provided by your hosting platform

### 3. Add Initial Templates

Log in as admin and add the 4 pre-loaded templates:
1. BPS Assessment
2. Weekly UR
3. Therapist Soap Note
4. Treatment Plan

Copy the template content from the original template files.

### 4. Configure DeepSeek API Key

Each user must add their own DeepSeek API key:
- Log in to the application
- Go to Settings
- Enter DeepSeek API key
- The key will be encrypted before storage

## Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel

### Railway
1. Go to Settings → Domains
2. Click "Generate Domain" or add custom domain
3. Update DNS records if using custom domain

### Render
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed

## Security Checklist

- [ ] `JWT_SECRET` is a strong random string (32+ characters)
- [ ] GitHub repository is set to **Private**
- [ ] Database has strong password
- [ ] Environment variables are configured on hosting platform (not in code)
- [ ] SSL/HTTPS is enabled (automatic on most platforms)
- [ ] Database backups are configured
- [ ] Only trusted users have admin access

## Monitoring & Maintenance

### Check Application Health
- Monitor error logs in your hosting platform dashboard
- Test document completion regularly
- Verify DeepSeek API is responding

### Database Backups
- Enable automatic backups on your hosting platform
- Test restore process periodically
- Keep backups for at least 30 days

### Updates
- Pull latest changes from GitHub
- Review changelog for breaking changes
- Test in staging environment before production
- Run database migrations if schema changed

## Troubleshooting

### Build Failures
- Check build logs in hosting platform
- Verify all dependencies are in `package.json`
- Ensure Node.js version is 18+

### Database Connection Errors
- Verify `DATABASE_URL` format is correct
- Check database server is running
- Ensure firewall allows connections from hosting platform

### DeepSeek API Errors
- Verify user's API key is valid
- Check API quota/credits at DeepSeek platform
- Review error messages in browser console

### Environment Variable Issues
- Ensure all required variables are set
- Check for typos in variable names
- Restart application after changing variables

## Cost Estimates

### Hosting
- **Vercel**: Free tier available, Pro starts at $20/month
- **Railway**: ~$5-20/month depending on usage
- **Render**: Free tier available, Starter at $7/month

### Database
- **PlanetScale**: Free tier available, Scaler at $29/month
- **Railway MySQL**: Included in hosting cost
- **Render MySQL**: ~$7/month

### DeepSeek API
- Pay-per-use pricing
- Approximately $0.14 per 1M input tokens
- Approximately $0.28 per 1M output tokens
- Typical document completion: $0.01-0.05

## Support

For deployment issues:
1. Check hosting platform documentation
2. Review application logs
3. Verify environment variables
4. Test database connection
5. Contact hosting platform support if needed

## Next Steps

After successful deployment:
- Test all features thoroughly
- Create user accounts for your team
- Upload custom templates
- Configure backup strategy
- Monitor usage and costs
