# TikTok Pro live referral tracker (Cloudflare Worker + D1)

Tracks genuine clicks on your own landing page's referral button, by day. Does **not** simulate visits, installs, referrals, or Stars. Does not collect IP addresses or personal identifiers. Public visitors see your landing page; admin stats require a secret token.

## Deploy

1. Create a free Cloudflare account, install Node.js, then run `npm install -g wrangler` and `wrangler login`.
2. In this folder run `wrangler d1 create tiktok-referral-clicks`.
3. Copy the returned `database_id` into `wrangler.toml`, replacing the placeholder.
4. Run `wrangler d1 execute tiktok-referral-clicks --remote --file=schema.sql`.
5. Run `wrangler secret put ADMIN_TOKEN` and enter a long, random, private token. Do not share it.
6. Run `wrangler deploy`. Cloudflare prints your public `*.workers.dev` URL.
7. Share the public homepage URL with genuine potential users. When they tap the button, `/go` increments the click counter and redirects to your TikTok Pro invite link.

## See stats

Run `curl -H 'Authorization: Bearer YOUR_ADMIN_TOKEN' https://YOUR_WORKER.workers.dev/admin` on your computer. Never put the token into a public webpage or share it with others. The stats count referral-button requests, which may include repeat taps; they are not unique users, installs, or verified TikTok referrals. The `/go` endpoint is publicly accessible and could be called directly, so totals are indicative only.

## Limitations

Cloudflare hosting and D1 are subject to provider terms and pricing. The app cannot know TikTok-confirmed referrals or earned Stars without an authorized TikTok integration. Use TikTok's app to check actual rewards. The landing page is not affiliated with TikTok.
