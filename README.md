# CES website: Cloudflare Pages edition

This is the approved landing page with the new electrician hero image, revised headline, compact footer, mobile outlined enquiry button and corrected mobile energy heading.

## Put the files in GitHub

1. Extract the ZIP on your computer.
2. Upload the contents of the extracted folder to the root of your GitHub repository. The root should contain `public/`, `functions/`, `schema.sql`, `README.md` and `THIRD-PARTY-NOTICES.txt`.
3. Replace the old `public/` and `functions/` files with this version. Do not upload the ZIP itself or put everything inside an extra folder.
4. Commit your changes. An already connected Cloudflare Pages project will redeploy automatically.

## Cloudflare Pages settings

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | None |
| Build command | `exit 0` |
| Build output directory | `public` |
| Root directory | Leave blank |

No Node installation, npm dependencies or build pipeline is required. Choose Cloudflare Pages with Git integration. Keep `functions/` at repository root, alongside `public/`.

The output directory must be `public`, not the repository root. This also keeps the database schema and documentation outside the public website.

## Enable enquiry storage

The page itself displays immediately. The form needs a Cloudflare D1 database before it can save enquiries. It does not send email notifications.

1. In your Cloudflare account, open Workers & Pages > D1 SQL Database and create a database, for example `ces-enquiries`. If you already have one for CES, use it.
2. Open that database's SQL console and run the complete contents of `schema.sql`. It uses CREATE TABLE IF NOT EXISTS, so it does not erase existing enquiries.
3. Open your Pages project > Settings > Bindings > Add > D1 database.
4. Set the binding/variable name to exactly `DB` and select your CES database. Configure the production environment, and preview too if you want forms on preview deployments to save. Use a separate database for test data if desired.
5. Redeploy the Pages project after adding the binding.
6. Submit a test enquiry on the live website. A successful submission displays a CES reference.
7. In the D1 SQL console, check the saved record with:

```sql
SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 50;
```

If you already configured a D1 binding called `DB` and an `enquiries` table with these columns in your previous package, you can keep them. Database data is in your Cloudflare account; it is not included in this download and is not transferred from any review site.

Without a working DB binding, the form displays an error and keeps the entered details. It never claims a failed enquiry was saved. Email notifications and a lead-management dashboard are not configured.

## Editing

- `public/index.html`: all landing-page text, navigation and form markup.
- `public/styles.css`: desktop and mobile styles.
- `public/site.js`: mobile menu, service panels, enquiry preselection and form submission.
- `public/images/`: six local WebP images, each used once.
- `public/favicon.svg`: site icon.
- `functions/api/enquiries.js`: form validation and database insertion.
- `schema.sql`: database table creation.
- `public/_redirects`: old service URLs point to the appropriate homepage section.
- `public/_routes.json`: only `/api/*` requests invoke Pages Functions.
- `public/_headers`: basic response headers.

Electrical, Security, Renewables, Projects and About currently link to homepage sections. Dedicated pages are not included because they have not yet been approved.

The site has no chat-platform branding, preview links, analytics or external JavaScript dependencies. DM Sans is loaded from Google Fonts; photos and icons are local. The hero is an original generated illustration; stock-image credits are retained. No contact numbers, email addresses, accreditations or testimonials have been invented.

## Local preview

For a visual-only preview, serve the public folder with any static web server, for example:

```sh
python -m http.server 8080 --directory public
```

Visit http://localhost:8080. The form needs the Cloudflare runtime and DB binding to save; a simple local static server does not provide that endpoint.

## Cloudflare documentation

- https://developers.cloudflare.com/pages/configuration/build-configuration/
- https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
- https://developers.cloudflare.com/pages/functions/bindings/#d1-databases
