# Appwrite Setup Guide

This site uses [Appwrite Cloud](https://cloud.appwrite.io) for the blog backend, contact form, newsletter subscribers, and admin authentication. Follow this one-time setup before deploying.

## 1. Create an Appwrite project

1. Sign up at https://cloud.appwrite.io (free tier is enough).
2. Click **Create project** — name it `Blackline`.
3. Copy the **Project ID** (Settings → General).

## 2. Add your platform (allowed domains)

In the project, go to **Overview → Add platform → Web app** and add:

- `localhost` (for local development)
- `your-site.netlify.app` (your Netlify URL)
- Your custom domain if you have one (e.g., `blacklinestrategy.com`)

## 3. Create the database

1. Go to **Databases → Create database**.
2. Name: `blackline`
3. Copy the **Database ID**.

### 3a. Create the `posts` collection

1. Inside the database, click **Create collection**.
2. **Collection ID**: `posts` (must match exactly)
3. **Permissions** → click **Add role** → choose **Any** → enable **Read** only. (Writes happen via server API key.)
4. **Attributes** — add these in order:

| Key             | Type     | Size  | Required | Notes                       |
| --------------- | -------- | ----- | -------- | --------------------------- |
| `slug`          | String   | 200   | Yes      |                             |
| `title`         | String   | 300   | Yes      |                             |
| `excerpt`       | String   | 500   | Yes      |                             |
| `content`       | String   | 100000| Yes      | Large markdown body         |
| `featuredImageId` | String | 100   | No       |                             |
| `published`     | Boolean  | —     | Yes      | Default: `false`            |
| `publishedAt`   | DateTime | —     | No       |                             |
| `authorEmail`   | String   | 255   | No       |                             |

5. **Indexes** — add:
   - `slug_unique` — type **unique**, attribute `slug` (ASC)
   - `published_publishedAt` — type **key**, attributes `published` (ASC), `publishedAt` (DESC)

### 3b. Create the `contact_submissions` collection

1. **Collection ID**: `contact_submissions`
2. **Permissions** → **Any** → no checkboxes (writes happen via API key only — keep this collection private).
3. **Attributes**:

| Key       | Type    | Size  | Required |
| --------- | ------- | ----- | -------- |
| `name`    | String  | 200   | Yes      |
| `email`   | String  | 320   | Yes      |
| `service` | String  | 200   | No       |
| `message` | String  | 5000  | No       |
| `status`  | String  | 20    | Yes      |

### 3c. Create the `subscribers` collection

1. **Collection ID**: `subscribers`
2. **Permissions** → **Any** → no checkboxes.
3. **Attributes**:

| Key      | Type   | Size | Required |
| -------- | ------ | ---- | -------- |
| `email`  | String | 320  | Yes      |
| `status` | String | 20   | Yes      |

4. **Indexes**:
   - `email_unique` — type **unique**, attribute `email` (ASC)

## 4. Create the storage bucket

1. Go to **Storage → Create bucket**.
2. **Bucket ID**: `blog-images` (must match exactly)
3. **Permissions** → **Any** → enable **Read** only.
4. **File security**: leave defaults.
5. **Allowed file extensions**: `jpg, jpeg, png, webp, avif, gif`
6. **Maximum file size**: 10 MB (or whatever you want)

## 5. Create the admin user

1. Go to **Auth → Users → Create user**.
2. Enter the email and password you'll use to log in.
3. (Email/password authentication is enabled by default; if not, enable it under **Auth → Settings**.)

## 6. Create a server API key

1. Go to **Overview → Integrations → API keys → Create API key**.
2. Name it `blackline-server`.
3. **Expiration**: Never (or whatever you prefer).
4. **Scopes** — enable these:
   - `databases.read`
   - `databases.write`
   - `documents.read`
   - `documents.write`
   - `files.read`
   - `files.write`
   - `users.read`
5. Copy the API key secret — **you'll only see it once.**

## 7. Add environment variables to Netlify

In Netlify: **Site settings → Environment variables → Add a variable** and add:

| Key                                  | Value                                              |
| ------------------------------------ | -------------------------------------------------- |
| `NEXT_PUBLIC_APPWRITE_ENDPOINT`      | `https://cloud.appwrite.io/v1`                     |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID`    | (Project ID from step 1)                           |
| `NEXT_PUBLIC_APPWRITE_DATABASE_ID`   | (Database ID from step 3)                          |
| `APPWRITE_API_KEY`                   | (Server API key from step 6 — **server-only**)     |

After adding them, trigger a redeploy.

## 8. Verify

Once deployed:

- Visit `/blog` — should show "No posts published yet."
- Visit `/admin/login` and log in with the credentials from step 5.
- Create a draft post, publish it, and verify it shows on `/blog/[your-slug]`.
- Submit the contact form on `/contact` — verify it shows up in `/admin/contacts`.
- Subscribe via the footer — verify it shows up in `/admin/subscribers`.

## Local development

Create a file `.env.local` at the project root with the same four env vars and run `npm run dev`.
