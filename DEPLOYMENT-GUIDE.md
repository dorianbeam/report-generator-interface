# 🚀 Vercel Deployment Guide

Deploy your Report Generator Interface to Vercel for free, secure, and always-available hosting.

## 📋 Prerequisites

- [Vercel Account](https://vercel.com) (free)
- [GitHub Account](https://github.com) (free)
- Your Airtable API credentials

## 🎯 Step-by-Step Deployment

### 1. **Setup GitHub Repository**

```bash
# Navigate to your project directory
cd "C:\Users\dsber\Code\Transcript Analysis\report-interface"

# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Vercel-optimized Report Interface"

# Add GitHub remote (replace with your repository URL)
git remote add origin https://github.com/yourusername/report-generator-interface.git

# Push to GitHub
git push -u origin main
```

### 2. **Connect to Vercel**

1. **Sign up/Login to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. **Import Project**:
   - Click "New Project"
   - Import your GitHub repository
   - Select the `report-interface` folder if it's a monorepo

3. **Deploy Settings**:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (or `./report-interface` if monorepo)
   - **Build Command**: Leave empty (static files)
   - **Output Directory**: Leave empty (static files)

### 3. **Configure Environment Variables**

In your Vercel dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `AIRTABLE_API_KEY` | Your Airtable Personal Access Token | Production, Preview, Development |
| `AIRTABLE_BASE_ID` | `appXAzaFQqHfzuJR6` | Production, Preview, Development |

**How to get Airtable API Key**:
1. Visit [Airtable Tokens](https://airtable.com/create/tokens)
2. Create new token with these permissions:
   - `data.records:read`
   - `data.records:write`
3. Add your base (`appXAzaFQqHfzuJR6`) to the token scope
4. Copy the generated token

### 4. **Deploy**

1. Click **Deploy** in Vercel
2. Wait for deployment to complete (~1-2 minutes)
3. Your app will be available at: `https://your-project-name.vercel.app`

## ✅ Verification

### Test Your Deployment

1. **Visit your deployed URL**
2. **Check API connectivity**:
   - The form should load category options
   - If categories don't load, check environment variables
3. **Test form submission**:
   - Fill out all required fields
   - Submit a test report
   - Check your Airtable base for the new record

### Common Issues & Solutions

**❌ Categories not loading**
```
Error: Missing Airtable configuration
```
**Solution**: Check environment variables are set correctly in Vercel dashboard

**❌ API Error: 401 Unauthorized**
```
API Error: 401 - Invalid API key
```
**Solution**: Verify your Airtable API key and permissions

**❌ CORS Errors**
```
Access to fetch has been blocked by CORS policy
```
**Solution**: The serverless proxy should handle this. Check if `/api/airtable-proxy` is working

## 🔧 Local Development

For local testing with Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Install project dependencies
npm install

# Create local environment file
# Copy your environment variables to .env.local

# Run locally
vercel dev
```

Your local app will be available at `http://localhost:3000`

## 🌐 Custom Domain (Optional)

### Free Subdomain
- Your app gets a free `.vercel.app` subdomain
- Example: `transcript-reports.vercel.app`

### Custom Domain
1. Go to **Settings** → **Domains** in Vercel
2. Add your domain name
3. Follow DNS configuration instructions
4. SSL certificate is automatically provided

## 🔒 Security Features

✅ **API Key Protection**: Server-side only, never exposed to client
✅ **HTTPS**: Automatic SSL certificates
✅ **CORS Handling**: Serverless function manages cross-origin requests
✅ **Environment Variables**: Secure credential management
✅ **Content Security**: Security headers configured in `vercel.json`

## 📈 Performance & Scaling

- **Global CDN**: Your static files served from edge locations worldwide
- **Serverless Functions**: Auto-scaling API proxy
- **Zero Configuration**: No server management required
- **Free Tier Limits**:
  - 100GB bandwidth/month
  - 1000 serverless function invocations/day
  - Unlimited static deployments

## 🔄 Continuous Deployment

Every push to your main branch automatically triggers a new deployment:

```bash
# Make changes to your code
git add .
git commit -m "Update report interface"
git push origin main
# → Vercel automatically deploys the changes
```

## 📱 Mobile Optimization

Your deployed app is fully responsive and optimized for:
- ✅ Desktop browsers
- ✅ Tablets
- ✅ Mobile devices
- ✅ Progressive Web App features

## 🎉 You're Done!

Your Report Generator Interface is now:
- 🌍 **Globally Available**: Accessible from anywhere
- 🔒 **Secure**: API credentials protected server-side
- ⚡ **Fast**: Global CDN and optimized delivery
- 💰 **Free**: No hosting costs on Vercel free tier
- 📈 **Scalable**: Handles traffic spikes automatically

**Next Steps**:
1. Share your Vercel URL with your team
2. Consider setting up a custom domain
3. Monitor usage in Vercel analytics
4. Set up N8N integration if desired

---

**🆘 Need Help?**
- Check Vercel's deployment logs in the dashboard
- Review the browser console for client-side errors
- Test the API proxy directly: `https://your-app.vercel.app/api/airtable-proxy?table=tblYNrzfMFhoDc7fJ`