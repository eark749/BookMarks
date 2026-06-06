# BookMarks

A personal bookmark manager — save, organize, and share your favorite links. Built with Next.js 15, Supabase, and Resend.

## Running Locally

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Copy `.env.local` and fill in your keys:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Run the schema in your Supabase SQL editor — see `supabase-schema.sql` at the repo root.

4. In Supabase → Auth → Settings → disable "Enable email confirmations".

5. Start the dev server:

```bash
npm run dev
```

---

## AGENT GOT IT WRONG

### Problem 3:- Agent starts coding right away.
Agent directly starts coding right away sometimes without a proper ideation, propre instruction no guidelines which can cost us if code is wrong, security bug and of course context window getting flodded because of wrong steps taken by agent.
Fix:- so at the very start i enforced an alignment step before any code is written. 
Prompt:- dont code right now first explain me what u understood so i can verify our both vision matches.

### Problem 2: Middleware / Redirect
/ (root page) was never in authPaths. so when a logged-in user visited /:, middleware ran here no rules were matching so page rendered, user saw a landing page with "log-in" button, but the navigation was fresh user was asked again to enter details. 
Fix:- i read the actual code identified the exact missing case, explaiend the user flow that breaks and gave the exact fix. 
Prompt:- 
"see in lib/supabase/middleware.ts it only redirects logged-in users to /login and /signup but /root is not in the authPaths array so a logged in user who lands on / sees the landing page and clicks on log in which triggers a fresh navigation where session may or may not refresh — clearly add / to the redirect logic"


### Problem 3: Next.js 16 middleware.ts → proxy.ts rename
next.js 16 changed the file convention for middleware. in v15 the file was middlware.ts with export function middleware(). in v16 ut became proxy.ts with export function proxy(). i sent an exact terminal command but agent refused it. it said if it changes the middleware.ts it will break all auth guards. it was wrong. 
Fix:- gave it the exact bash command + file name + exact function name.
Prompt:- 
"mv middleware.ts proxy.ts — Then open proxy.ts and change one word — the function name: export async function proxy(request: NextRequest)"
---

## Improvements
1. Forgot password flow
2. handle change
3. OG preview image
4. Drag to reorder
5. import from browser bookmarks


