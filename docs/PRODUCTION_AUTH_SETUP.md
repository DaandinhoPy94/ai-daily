# Production OAuth & Profile Setup Guide

## Root Cause Analysis

The production authentication issue was caused by:
1. **Silent fallback to development Supabase project** when environment variables weren't set
2. **Missing production environment variables** in the build process
3. **No error reporting** when connecting to wrong project

## Fixed Issues

### 1. Supabase Client Configuration
- **Before**: Silent fallback to hardcoded dev values
- **After**: Explicit error in production when env vars missing
- **File**: `src/integrations/supabase/client.ts`

### 2. Auth Callback Error Handling
- **Before**: Generic error messages
- **After**: Detailed OAuth error detection and reporting
- **File**: `src/pages/AuthCallback.tsx`

## Production Setup Checklist

### 1. Environment Variables

Set these in your production build environment:

```bash
# Required
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key

# Optional
VITE_SITE_URL=https://your-production-domain.com
```

### 2. Supabase Dashboard - OAuth Configuration

In your **production** Supabase project:

1. Go to **Authentication** → **URL Configuration**
2. Add these **Redirect URLs** (exact match required):
   ```
   https://your-domain.com/auth/callback
   https://www.your-domain.com/auth/callback  # if using www
   ```

3. Go to **Authentication** → **Providers** → **Google**
4. Ensure:
   - Google OAuth is enabled
   - Client ID and Secret are configured
   - Authorized redirect URIs in Google Console match above

### 3. Database Setup

Verify these migrations are applied in production:
- `20250923100000_profiles_rls_fix.sql` - Sets up proper profiles table with:
  - `user_id` as PRIMARY KEY
  - RLS policies for self-access
  - Auto-create trigger for new users

### 4. Verification Steps (Production)

#### A. Check Environment Variables
```javascript
// In browser console on production:
console.log(window.location.origin + '/auth/callback');
// This URL must be in Supabase redirect URLs
```

#### B. Enable Debug Mode (temporary)
```javascript
// In browser console:
localStorage.setItem('__auth_debug', 'true');
// Or append ?debug=auth to URL
```

#### C. Monitor Network Tab
1. During OAuth flow, check:
   - `POST /auth/v1/token?grant_type=pkce` returns 200
   - `POST /rest/v1/profiles` includes `Authorization: Bearer <jwt>` header
   - Domain in requests matches your production Supabase URL

2. On `/auth/callback` flow order:
   - `exchangeCodeForSession` occurs BEFORE any profile ensure call
   - Profile ensure uses `UPSERT` without `.select()` followed by a separate `SELECT`

#### D. Check Session Storage
```javascript
// After successful login:
Object.keys(localStorage).filter(k => k.includes('supabase'))
// Should show: sb-<your-project-ref>-auth-token
```

### 5. Common Issues & Solutions

| Issue | Symptom | Solution |
|-------|---------|----------|
| Wrong project | Auth works but no profile | Check VITE_SUPABASE_URL in build |
| No env vars | Page crashes on load | Set environment variables |
| Redirect mismatch | OAuth error after Google | Add exact URL to Supabase |
| RLS blocking | 403 on profile creation | Check migration applied |
| No primary key | 409 "no matching constraint" | Apply profiles migration |

### 6. Testing Production Fix (Fresh Google account)

1. **Clear all data** for test account:
   ```sql
   -- In Supabase SQL editor
   DELETE FROM public.profiles WHERE user_id = 'test-user-id';
   DELETE FROM auth.users WHERE email = 'test@example.com';
   ```

2. **Test fresh signup**:
   - Use incognito/private window
   - Sign in with Google
   - Check Network tab for:
     - 200 on `/auth/v1/token?grant_type=pkce`
     - `Authorization: Bearer` present on `/rest/v1/profiles`
   - Verify a row exists in `public.profiles` with `user_id = auth.users.id`
   - In console (with `?debug=auth`), expect groups like:
     - `[auth:callback][trace:xxxxxxxx] exchangeCodeForSession`
     - `[auth:callback][trace:xxxxxxxx] ensureUserProfile`
     - `[auth:ensure][trace:xxxxxxxx] upsert:payload`
     - `[auth:ensure][trace:xxxxxxxx] upsert:success`

### 7. Rollback Plan

If issues persist:
1. Temporarily revert client changes
2. Add explicit production check:
   ```typescript
   if (import.meta.env.PROD && !import.meta.env.VITE_SUPABASE_URL) {
     window.location.href = '/maintenance';
   }
   ```

## Monitoring

Add this to track auth issues in production:

```sql
-- Query recent auth debug events
SELECT * FROM public.debug_profile_events 
WHERE created_at > now() - interval '1 hour'
ORDER BY created_at DESC;
```

## Summary

The core issue was **silent fallback to dev project** when production environment variables weren't set. The fix ensures:
1. **Fail-fast in production** when configuration is missing
2. **Clear error messages** for debugging
3. **Proper OAuth callback handling** with detailed logging

**Key Change**: Production builds now **require** explicit Supabase configuration and will error clearly if missing, preventing silent failures.
