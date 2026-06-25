# Ink Mania - Vercel Deployment Guide

## Step 1: Push Code to Your GitHub Repo

Run these commands on your computer (you need Git installed):

```bash
# 1. Go to the project folder
cd ink-mania

# 2. Make sure your GitHub repo is set as origin
git remote remove origin 2>/dev/null
git remote add origin https://github.com/Qompet/Inkmania.git

# 3. Push everything (will ask for your GitHub username + password/token)
git push -u origin main --force
```

> **If git push asks for a password:** Use a **GitHub Personal Access Token** instead of your password. Get one at: https://github.com/settings/tokens (select "repo" scope)

---

## Step 2: Connect to Vercel (2 minutes)

### Option A: Vercel Dashboard (Easiest)
1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Select `Qompet/Inkmania`
4. Vercel will auto-detect Vite framework
5. Click **Deploy**
6. After deployment, go to **Project Settings > Environment Variables**
7. Add ALL 8 variables from the table below (one by one)
8. Click **Redeploy** after adding all env vars

### Option B: Vercel CLI
```bash
npm i -g vercel
vercel --prod
# Follow prompts, set framework to Vite
# Then add env vars in dashboard
```

---

## Step 3: Add Environment Variables

After the first deploy, you MUST add these 8 environment variables:

| # | Name | Value |
|---|------|-------|
| 1 | `DATABASE_URL` | `mysql://AzPGNniPP9tw8RX.root:Ng3XrsXOJpHW0GL9hHm2bbXD2LpeDMYh@ep-t4ni387b5e83b7519dc8.epsrv-t4n281l4mrmemi4zls9a.ap-southeast-1.privatelink.aliyuncs.com:4000/19ef7f55-07f2-834f-8000-090dbeb9154d` |
| 2 | `APP_ID` | `19ef7f9e-1752-8062-8000-0000fa1fd088` |
| 3 | `APP_SECRET` | `VzSERIzA0xQmk8moFqsYi5iSxBg2kipJ` |
| 4 | `VITE_APP_ID` | `19ef7f9e-1752-8062-8000-0000fa1fd088` |
| 5 | `VITE_KIMI_AUTH_URL` | `https://auth.kimi.com` |
| 6 | `KIMI_AUTH_URL` | `https://auth.kimi.com` |
| 7 | `KIMI_OPEN_URL` | `https://open.kimi.com` |
| 8 | `OWNER_UNION_ID` | `d3gg9tf60ra85iflbhq0` |

**How to add:** Go to your Vercel project > Settings > Environment Variables > Add each one as "Plaintext"

---

## Step 4: Update Kimi Auth Callback URL

After Vercel gives you a URL (e.g., `https://inkmania.vercel.app`):

1. Go to your Kimi app settings
2. Find the **OAuth Callback URL** field
3. Set it to: `https://YOUR_VERCEL_URL/api/oauth/callback`
   - Example: `https://inkmania.vercel.app/api/oauth/callback`

---

## Your Live URLs After Deployment

| URL | What You See |
|-----|-------------|
| `https://inkmania.vercel.app` | Your live store |
| `https://inkmania.vercel.app/admin` | Admin Dashboard |
| `https://inkmania.vercel.app/api/health` | API health check |

---

## Troubleshooting

**Images not showing?** The product images are in the `public/products/` folder and are included in the build. If they're broken after deploy, check that the `outputDirectory` in vercel.json is set to `dist/public`.

**Database connection failed?** Make sure the `DATABASE_URL` env var is set exactly as shown above. TiDB requires SSL.

**Login not working?** Check that the Kimi OAuth callback URL matches your Vercel deployment URL exactly.

**Need help?** The `OWNER_UNION_ID` env var will set your account as admin automatically.
