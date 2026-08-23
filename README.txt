WIN SHEARR SCRAPPERS — V3

1. Supabase setup
- Open your Supabase project.
- Go to SQL Editor -> New query.
- Open setup.sql from this folder and paste/run the whole script.
- It creates the parts table, security policies and part-images storage bucket.

2. Create your admin account
- Open admin.html after the site is hosted.
- Enter your email and a strong password.
- Click CREATE ACCOUNT.
- If Supabase requires email confirmation, confirm the email.
- Then log in.

3. Important
- config.js contains only the Supabase project URL and Publishable key.
- Never put a Supabase secret/service-role key in config.js or browser code.
- This V3 uses authenticated Supabase users for inventory changes.

4. Local testing
- Because ES modules are used, opening index.html directly as file:// may be blocked by the browser.
- Use a simple local web server (for example VS Code Live Server) or host the files on Vercel/Netlify/GitHub Pages.

5. Next upgrade
- Add real role-based admin permissions.
- Add individual product detail pages and multiple photos.
- Add car/model/year filters.
- Add sold/available controls.
- Add domain + hosting + SEO.
