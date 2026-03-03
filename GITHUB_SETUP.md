# GitHub Repository Setup

Follow these steps to push this project to GitHub.

## Step 1: Create the repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Set the repository name (e.g. `criterion-onboarding`)
3. Choose **Public** or **Private**
4. **Do not** add a README, .gitignore, or license (they already exist in this project)
5. Click **Create repository**

## Step 2: Run these commands in your terminal

From the `criterion-onboarding` directory, run:

```bash
cd /Users/bolivarnunes/Bolden/Criterion/Onboarding/criterion-onboarding

# Create initial commit (if you haven't already)
git add .
git commit -m "Initial commit: Criterion onboarding app"

# Add your GitHub repo as remote (replace YOUR_USERNAME and YOUR_REPO with your actual values)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## If Git prompts for Xcode license

If you see: *"You have not agreed to the Xcode license agreements"*:

```bash
sudo xcodebuild -license
```

Accept the license, then retry the git commands above.
