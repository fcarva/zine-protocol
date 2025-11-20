# 🚀 GitHub Deployment Guide

This guide will help you push your Zine Protocol project to GitHub.

## Prerequisites

- Git installed on your computer
- GitHub account created
- Project files ready (you're here!)

## Step 1: Initialize Git Repository

Open your terminal in the project directory and run:

```bash
git init
```

## Step 2: Add All Files

```bash
git add .
```

This will stage all files except those in `.gitignore` (like `.env.local`).

## Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: Zine Protocol with Juicebox V3 integration"
```

## Step 4: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click the **"+"** icon in the top right
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `zine-protocol` (or your preferred name)
   - **Description**: "A decentralized publishing protocol powered by Juicebox V3"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README (we already have one)
5. Click **"Create repository"**

## Step 5: Add Remote Origin

Copy the commands from GitHub (they'll look like this):

```bash
git remote add origin https://github.com/YOUR_USERNAME/zine-protocol.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 6: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files!
3. Check that `.env.local` is **NOT** in the repository (it should be gitignored)

## 🎉 Success!

Your project is now on GitHub! 

## Optional: Deploy to Vercel

### Quick Deploy

1. Go to [Vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure environment variables:
   - `NEXT_PUBLIC_CHAIN_ID` = `11155111`
   - `NEXT_PUBLIC_JB_PROJECT_ID` = `167`
   - `NEXT_PUBLIC_JB_ETH_TERMINAL_ADDRESS` = `0x55d4dfb578daA4d60380995ffF7a706471d7c719`
   - `NEXT_PUBLIC_SUBGRAPH_URL` = `https://api.studio.thegraph.com/query/50618/juicebox-v3-sepolia/version/latest`
5. Click **"Deploy"**
6. Wait 2-3 minutes
7. Your site is live! 🚀

## Troubleshooting

### "Permission denied" error
Make sure you're authenticated with GitHub. Run:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### ".env.local appears in repository"
If you accidentally committed it:
```bash
git rm --cached .env.local
git commit -m "Remove .env.local from repository"
git push
```

### "Repository not found"
Double-check the remote URL:
```bash
git remote -v
```

## Next Steps

- Add a LICENSE file
- Set up GitHub Actions for CI/CD
- Add more documentation
- Invite collaborators

---

Need help? Open an issue on GitHub or reach out in the JuiceboxDAO Discord!
