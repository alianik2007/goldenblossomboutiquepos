# Golden Blossom Boutique - Cloud Sync & GitHub Guide

This POS system supports two easy ways to keep your boutique data synchronized across multiple devices and backed up safely.

---

## Option 1: GitHub Cloud Auto-Sync (Recommended & Easiest)

With GitHub Auto-Sync, every sale and product change is automatically committed and pushed to your GitHub repository. Any other computer or iPad opening the POS will automatically pull the newest data.

### 30-Second Setup:
1. Open the POS and click the **GitHub: Connect** button in the top header.
2. Enter your repository (e.g. `your-username/goldenblossomboutique-pos` or paste your full GitHub URL).
3. Click the link **"Generate Token (1 Click)"** (or go to [GitHub Tokens](https://github.com/settings/tokens/new?scopes=repo&description=Golden-Blossom-POS-Sync)).
4. Click **Generate token** on GitHub, copy the token (`ghp_...`), and paste it into the POS.
5. Click **Save & Connect GitHub**.

### What Happens Automatically:
- **Auto-Save**: Whenever you add a caftan, update prices, or ring up a sale, the POS commits and saves both `data.json` and `data.js` to GitHub in the background.
- **Auto-Pull**: When you open the POS on any computer, it automatically pulls the latest inventory from GitHub so you're always up to date.
- **Manual Buttons**: You can click **Pull from GitHub** or **Push to GitHub** at any time.

---

## Option 2: Supabase Cloud Database (Live Multi-PC Sync)

If you have multiple registers open at the same time and want changes to reflect on all screens in real-time without refreshing:

### 1-Minute Setup:
1. Go to [Supabase](https://supabase.com) and create a free project.
2. In Supabase, open the **SQL Editor**, paste the contents of `supabase-schema.sql`, and click **Run**:
   ```sql
   create table if not exists public.gbb_shared_data (
     id smallint primary key default 1 check (id = 1),
     payload jsonb not null,
     updated_at timestamptz not null default now()
   );
   alter table public.gbb_shared_data enable row level security;
   grant select, insert, update on public.gbb_shared_data to anon, authenticated;
   create policy "Allow POS read access" on public.gbb_shared_data for select using (true);
   create policy "Allow POS upsert access" on public.gbb_shared_data for all using (true) with check (true);
   ```
3. In Supabase, go to **Project Settings > API** and copy:
   - **Project URL** (e.g. `https://xxxx.supabase.co`)
   - **Project API Key (anon / public)**
4. In the POS header, click **Cloud DB**, switch to the **Supabase Cloud DB** tab, paste your URL and Anon Key, and click **Connect & Sync Supabase**.

That's it! No complex user metadata or Vercel environment variables required.

---

## Option 3: Local Desktop App (Electron)

If running the desktop application with `npm start`:
- Changes are automatically written directly to `data.js` and `data.json` inside this folder.
- If a local Git repository is initialized, you can also push to GitHub directly from the terminal or using the desktop sync button.
