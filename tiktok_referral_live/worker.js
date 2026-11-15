// TikTok Pro referral tracker: Cloudflare Worker + D1
const REFERRAL = 'https://pro.tiktok.com/t/ZT9fptbd4Y2Ue-ctssG/';
const CODE = '418863004';
const html = (body) => new Response(body, {headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'no-referrer'}});
const page = (title, content) => `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>body{font-family:system-ui,-apple-system,sans-serif;background:#101016;color:#fff;max-width:540px;margin:5vh auto;padding:20px}main{background:#20202a;border-radius:22px;padding:26px}a.btn,button{display:block;text-align:center;background:#fe2c55;color:white;padding:16px;border:0;border-radius:12px;font-size:17px;font-weight:bold;text-decoration:none;width:100%;box-sizing:border-box;cursor:pointer}.muted{color:#bcbcc7}code{word-break:break-all}.stat{padding:14px;background:#30303b;border-radius:12px;margin:12px 0}input{width:100%;box-sizing:border-box;padding:12px;margin:10px 0;border-radius:8px;border:1px solid #777;background:#17171d;color:white}</style><main>${content}</main></html>`;
const day = () => new Date().toISOString().slice(0,10);
export default {
 async fetch(request, env) {
  const url = new URL(request.url);
  if (url.pathname === '/') return html(page('TikTok Pro invitation', `<h1>Explore TikTok Pro ⭐</h1><p>Use invite code <strong>${CODE}</strong> to explore available activities and rewards. Eligibility and rewards are determined by TikTok.</p><a class="btn" href="/go" rel="nofollow">Open TikTok Pro invite</a><p class="muted">You will be redirected to TikTok Pro. This page counts link taps, not downloads or verified referrals.</p>`));
  if (url.pathname === '/go') {
   // Only log an actual visit to the redirect endpoint, not a fabricated referral.
   await env.DB.prepare('INSERT INTO daily_clicks (day, clicks) VALUES (?, 1) ON CONFLICT(day) DO UPDATE SET clicks = clicks + 1').bind(day()).run();
   return Response.redirect(REFERRAL, 302);
  }
  if (url.pathname === '/admin') {
   const auth = request.headers.get('Authorization') || '';
   const expected = 'Bearer ' + env.ADMIN_TOKEN;
   if (!env.ADMIN_TOKEN || auth !== expected) return new Response('Unauthorized. Open /admin with an Authorization: Bearer YOUR_ADMIN_TOKEN header. See README.', {status:401,headers:{'cache-control':'no-store'}});
   const rows = await env.DB.prepare('SELECT day, clicks FROM daily_clicks ORDER BY day DESC LIMIT 30').all();
   const total = await env.DB.prepare('SELECT COALESCE(SUM(clicks),0) AS total FROM daily_clicks').first();
   return new Response(JSON.stringify({total_link_taps:total.total,last_30_active_days:rows.results,note:'Not TikTok-confirmed referrals or Stars.'},null,2),{headers:{'content-type':'application/json','cache-control':'no-store'}});
  }
  return new Response('Not found',{status:404});
 }
};
