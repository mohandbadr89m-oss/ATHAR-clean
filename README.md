# ATHAR — أثر

**أثر · كلمات تبقى.**

ATHAR is an Arabic quote-sharing platform built with Laravel, Blade, Tailwind CSS, Vite, and MySQL/SQLite.

## Requirements

- PHP 8.3 or newer with the Laravel-required extensions (including `dom`, `mbstring`, `fileinfo`, `pdo`, and the selected database driver).
- Composer.
- Node.js and npm.
- MySQL for hosted deployments, or SQLite for a lightweight local setup.

## Local setup

1. Install PHP dependencies:

   ```bash
   composer install
   ```

2. Create your local environment file and application key:

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

   On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

3. For SQLite, create the database file if it does not exist:

   ```bash
   # macOS / Linux
   touch database/database.sqlite
   ```

   On Windows PowerShell:

   ```powershell
   New-Item -ItemType File -Force database/database.sqlite
   ```

   The `.env.example` file is configured for SQLite by default. For MySQL, update the `DB_*` values in your private `.env` file.

4. Run database migrations:

   ```bash
   php artisan migrate
   ```

5. Install frontend dependencies and build assets:

   ```bash
   npm ci
   npm run build
   ```

6. Create the public storage link for profile avatars:

   ```bash
   php artisan storage:link
   ```

7. Start the local server:

   ```bash
   php artisan serve
   ```

Open `http://127.0.0.1:8000`.

## Main features

- Public landing page, quote library, museum, and Eternal Legacy Hall.
- User registration, login, profiles, and avatar uploads.
- Quote publishing, editing, deletion, likes, and favorites.
- Admin and owner roles with server-side authorization.
- Admin-curated legacy quotes.

## Roles

- `user`: manages their own quotes.
- `admin`: manages legacy quotes and can delete community quotes.
- `owner`: full administrative access, including creating and revoking admins.

New accounts receive the `user` role from the database default. The `role` column is intentionally excluded from mass assignment.

## Production notes

- Never commit `.env`, credentials, database dumps, or uploaded user files.
- Set `APP_ENV=production`, `APP_DEBUG=false`, a secure `APP_KEY`, and the correct `APP_URL`.
- Configure a persistent MySQL database and persistent/object storage for uploaded avatars.
- Run `php artisan migrate --force` during deployment after taking a database backup.
- Build frontend assets with `npm ci && npm run build`.
- Ensure the web server document root points to Laravel's `public` directory.
- Do not use `migrate:fresh` on a database containing real user data.

## Useful commands

```bash
php artisan route:list
php artisan test
php artisan optimize:clear
npm run build
```
