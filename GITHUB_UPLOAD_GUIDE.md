# How to Upload to GitHub (No More "Yowza" Error!)

## The Problem
GitHub's **web interface** shows "Yowza, that's a big file" warning for files over 1MB.
This is just a WARNING - files will still upload, but it's annoying.

## The Solution: Use Git Command Line

### Step 1: Open Command Prompt
```bash
cd "d:\Real web"
```

### Step 2: Initialize Git (if not already done)
```bash
git init
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

### Step 3: Add All Files
```bash
git add .
```

### Step 4: Commit
```bash
git commit -m "Split Punjab board files - all under 1MB"
```

### Step 5: Push to GitHub
```bash
git push -u origin main
```

## Why This Works
- Git command line handles files up to **100MB** without warnings
- No "Yowza" message
- Faster upload
- Professional workflow

## Current File Sizes (All Safe!)
✅ punjab_class9_part1.json - 437KB
✅ punjab_class9_part2.json - 592KB
✅ punjab_class10_part1.json - 643KB
✅ punjab_class10_part2.json - 788KB
✅ All other files under 50KB

**Total: All files well under GitHub's 100MB limit!**

## Alternative: Ignore the Warning
If you prefer web upload, just click past the "Yowza" message.
It's only a warning - your files WILL upload successfully.

## For Railway Deployment
Once on GitHub, connect to Railway:
1. Go to railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Add environment variables (SESSION_SECRET, PAYMENT_SECRET, etc.)
6. Deploy!

Railway pulls from Git, so file size doesn't matter at all.
