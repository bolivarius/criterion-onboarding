# Firebase Hosting Setup

This project is configured for static deployment to Firebase Hosting.

## Prerequisites

- [Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli) installed (`firebase --version`)
- Logged in: `firebase login`

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Add project** (or **Create a project**)
3. Name it (e.g. `criterion-onboarding`)
4. Disable Google Analytics if you don't need it (optional)
5. Click **Create project**

## Step 2: Link Your Local Project

From the project root:

```bash
firebase use --add
```

- Select your new project from the list
- When prompted for an alias, press Enter (uses `default`)

## Step 3: Deploy

```bash
npm run deploy
```

This builds the app and deploys the static output to Firebase Hosting.

Your site will be live at: `https://criterion-onboarding-<project-id>.web.app`  
(or the custom domain you configure in the Firebase Console)
