# Quick Deployment Guide 🚀

## Step-by-Step Vercel Deployment

### 1️⃣ Prepare Your Code

```bash
# Ensure all changes are committed
git status
git add .
git commit -m "feat: ready for vercel deployment"
git push origin main
```

### 2️⃣ Connect to Vercel

**Option A: Via Vercel Dashboard (Easiest)**

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Select your repository: `Precision-Agriculture-Website`
5. Vercel will auto-detect the framework (Vite)

**Option B: Via Vercel CLI**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login
vercel login

# Deploy
cd Precision-Agriculture-Website
vercel
```

### 3️⃣ Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

**Required:**
```
VITE_API_URL = https://your-backend-api.com/api
```

**Optional:**
```
VITE_APP_NAME = Precision Agriculture Platform
VITE_NODE_ENV = production
VITE_ENABLE_AI_INSIGHTS = true
VITE_ENABLE_EXPORT = true
```

### 4️⃣ Deploy

Click "Deploy" button in Vercel dashboard.

Build process will:
- ✅ Install dependencies
- ✅ Run `npm run build`
- ✅ Deploy to CDN
- ✅ Assign a URL (e.g., `your-project.vercel.app`)

### 5️⃣ Verify Deployment

Once deployed, test:
- [ ] Homepage loads
- [ ] Login works
- [ ] Dashboard accessible
- [ ] All routes working
- [ ] Dark mode works
- [ ] API connections working

### 6️⃣ Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your domain: `agriweb.yourdomain.com`
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

---

## Automatic Deployments

After initial setup, Vercel automatically deploys:

- **Production:** Every push to `main` branch
- **Preview:** Every pull request
- **Rollback:** Available in deployment history

---

## Environment-Specific URLs

After deployment, you'll have:

- **Production:** `https://your-project.vercel.app`
- **Preview:** `https://your-project-git-branch.vercel.app`
- **Custom:** `https://yourdomain.com` (if configured)

---

## Troubleshooting Common Issues

### Build Failed

```bash
# Check Node version in package.json
"engines": {
  "node": ">=18.0.0"
}

# Clear cache and retry
# In Vercel: Settings → General → Clear Build Cache
```

### Routes Return 404

✅ Already configured in `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Environment Variables Not Working

⚠️ Remember:
- Must start with `VITE_`
- Set in Vercel Dashboard
- Redeploy after adding variables

---

## Monitoring Your Deployment

### Vercel Dashboard
- View build logs
- Monitor performance
- Check analytics
- Review deployments

### Commands
```bash
# View deployment logs
vercel logs

# List deployments
vercel ls

# Promote deployment to production
vercel promote [deployment-url]
```

---

## Rollback if Needed

1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." → "Promote to Production"

---

## Next Steps After Deployment

- [ ] Share production URL with team
- [ ] Configure monitoring (optional)
- [ ] Set up custom domain (optional)
- [ ] Enable Vercel Analytics (optional)
- [ ] Configure automated backups

---

## Support

- Vercel Docs: https://vercel.com/docs
- Vite Docs: https://vitejs.dev/guide/
- React Router: https://reactrouter.com/

**Need help?** Check deployment logs in Vercel dashboard or contact the dev team.
