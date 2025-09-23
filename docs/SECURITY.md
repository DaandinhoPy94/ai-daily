## Security model overview

### Roles

- User: default role for authenticated users.
- Editor: content editors (no elevated DB superpowers beyond content tables).
- Admin: elevated application role. Assignment lives in `public.profiles.role = 'admin'` and is enforced via `public.is_admin()`.

Admin assignment:

- Set `profiles.role = 'admin'` for the target `user_id` directly in the database (via admin console or SQL). Users cannot self-escalate due to trigger `public.profiles_block_role_change()`.

### RLS per table (public schema)

- profiles
  - SELECT: authenticated only.
  - INSERT: self only (`user_id = auth.uid()`).
  - UPDATE: self or admin; role changes blocked by trigger for non-admins.
  - DELETE: admin only.
  - Public view: `public_profiles(user_id, display_name, avatar_url)` for whitelisted fields.

- article_comments
  - SELECT: authenticated only by default (optional anon read for published articles is available but disabled).
  - INSERT/UPDATE/DELETE: owner; admins can moderate all.

- comment_reactions
  - SELECT: authenticated only.
  - INSERT/UPDATE/DELETE: owner; admins can moderate all.

- articles_sitemap (if present)
  - SELECT: public (read-only).
  - INSERT/UPDATE/DELETE: admin or service role only.

- job_listings (if present)
  - SELECT: public (read-only site section).
  - INSERT/UPDATE/DELETE: admin or service role only.

- newsletters (if present)
  - SELECT: authenticated only.
  - INSERT/UPDATE/DELETE: admin or service role only.

- lm_arena_leaderboard_snapshots (if present)
  - SELECT: public (leaderboard).
  - INSERT/UPDATE/DELETE: admin or service role only.

### Functions and search_path conventions

- All user-defined functions specify `SET search_path = public, pg_temp`.
- Prefer `SECURITY INVOKER`. Only keep `SECURITY DEFINER` where strictly required (e.g., `handle_new_auth_user()` trigger on `auth.users`).
- Guard DEFINER functions: check trusted context, use minimal logic, and respect RLS for data reads/writes where possible.

## Supabase Auth hardening checklist

Follow these steps in the Supabase dashboard (Project Settings → Authentication):

- OTP/Magic Link expiry: set to 5–10 minutes.
- Leaked password protection: enable (Auth → Password settings → Check against Pwned Passwords).
- OAuth redirect URLs: restrict to exact production URLs only (e.g., https://aidagelijks.nl/auth/callback and https://www.aidagelijks.nl/auth/callback). Remove wildcards and non-prod hosts.
- Email link redirect: ensure only production origins are allowed.
- Disable anonymous signups if not used.

Operational notes:

- Keep service role keys secret; never expose in browser.
- Rotate keys periodically.
- Monitor auth logs for suspicious activity.

Verification (acceptance):

- Attempt to use an OTP older than 10 minutes → rejected.
- Use an OAuth redirect URL not in the allowlist → rejected.
- Password change to a known leaked password → rejected.

## Policy linting in CI

Add a CI step that fails on unknown public SELECT policies. Two options:

1) Supabase CLI:
   - `supabase db lint` to validate migrations (add as a CI step if the CLI is available).

2) SQL policy linter (recommended):
   - Provide `DATABASE_URL` to CI and run `npm run policy:lint`.
   - The linter fails if any public table has an unconditional public SELECT policy outside the allowlist: `articles_sitemap`, `job_listings`, `lm_arena_leaderboard_snapshots`, `public_profiles`.

Example GitHub Actions step (requires `DATABASE_URL` secret):

```yaml
- name: Policy lint
  run: npm run policy:lint
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```


