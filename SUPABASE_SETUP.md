# Automatic Multi-Device Sync Guide (Supabase)

With Cloud Sync enabled, any change you make (adding products, updating stock, changing prices, ringing up sales) **automatically synchronizes in real-time across all your PCs, iPads, tablets, and phones**.

---

## ⚡ Quick 2-Minute Setup (100% Free)

### 1. Create a Free Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **New Project**, choose a project name (e.g., `Golden Blossom POS`), set a database password, and create it.

### 2. Run the Database Schema
1. In the Supabase dashboard sidebar, click **SQL Editor**.
2. Click **New query**, paste the entire contents of [`supabase-schema.sql`](supabase-schema.sql), and click **Run**.
3. This creates the `gbb_shared_data` table, enables real-time broadcast, and configures sync permissions.

### 3. Copy Your Credentials
In your Supabase project, go to **Project Settings > API**:
- **Project URL** (e.g. `https://your-id.supabase.co`)
- **anon / public key** (starts with `eyJ...`)

---

## 📱 Connecting Your Devices

You can connect your devices in two ways:

### Option A: Direct Connection in the POS App (No Coding / Works Locally)
1. Open [`index.html`](index.html) in your browser on PC 1.
2. Click **Cloud Sync** at the top right of the header.
3. Paste your **Supabase Project URL** and **Anon Key**.
4. Make sure **"Direct Store Sync"** is checked.
5. Click **Save & Connect Cloud**.
6. **On PC 2, iPad, or Phone**: Open the POS, click **Cloud Sync**, paste the exact same URL & Key, and click **Save & Connect Cloud**.

That's it! When you add or edit a product or make a sale on one device, all other devices receive the update in real-time!

---

### Option B: Deploy Online with Vercel (Recommended for Best Experience)
If you host your POS online on Vercel:
1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. In Vercel, go to **Settings > Environment Variables** and add:
   - `SUPABASE_URL`: Your Supabase Project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key
4. Deploy!
5. Now every phone, tablet, and PC can visit your Vercel link (e.g., `https://goldenblossom.vercel.app`) without typing credentials, and everyone shares the same live inventory and gets code updates automatically.