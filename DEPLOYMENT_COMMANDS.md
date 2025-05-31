# 🚀 GitHub Deployment Commands

## Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `my-portfolio`
3. Description: `Modern, responsive portfolio built with Next.js 15, TypeScript, and Tailwind CSS. Features dark/light theme, i18n support, and enterprise-grade performance optimizations.`
4. Set to Public
5. Don't initialize with README
6. Click "Create repository"

## Step 2: Connect and Push to GitHub

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
# Add the remote origin
git remote add origin https://github.com/YOUR_USERNAME/my-portfolio.git

# Rename branch to main (GitHub standard)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 3: Verify Deployment
After pushing, your repository will be available at:
`https://github.com/YOUR_USERNAME/my-portfolio`

## Step 4: Set Up Automatic Deployment (Optional)

### Vercel Deployment:
1. Go to https://vercel.com
2. Import your GitHub repository
3. Deploy with zero configuration
4. Your site will be live at: `https://my-portfolio-YOUR_USERNAME.vercel.app`

### Netlify Deployment:
1. Go to https://netlify.com
2. Connect your GitHub repository
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Deploy automatically

## Repository Features:
✅ Production-ready codebase
✅ Professional README.md
✅ MIT License included
✅ Comprehensive documentation
✅ Clean commit history
✅ Optimized for deployment

## Next Steps:
1. Update README.md with your actual live demo URL
2. Add screenshots to `/public/screenshots/`
3. Customize the portfolio content
4. Set up continuous deployment
