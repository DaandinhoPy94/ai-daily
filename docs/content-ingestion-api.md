## Auth profiles

On every successful sign-in (including session restore and OAuth callback), the app ensures a row exists in `public.profiles` keyed by `auth.users.id` as `user_id`. The logic lives in `src/lib/ensureProfile.ts` and is wired in `src/contexts/AuthContext.tsx` (auth listener and session restore) and `src/pages/AuthCallback.tsx` (post-exchange).

The database enforces RLS such that a logged-in user can select/insert/update only their own row. The ensure step performs an idempotent `upsert` by `user_id`, updating basic fields (display name, avatar) without overwriting elevated roles.

# Content Ingestion API Documentation

This API endpoint allows you to create and update content programmatically from automation tools like Make.com and n8n.

## Endpoint
```
POST https://ykfiubiogxetbgdkavep.supabase.co/functions/v1/ingest-content
```

## Authentication
All requests must include an HMAC-SHA256 signature in the `X-Signature` header:
```
X-Signature: sha256=<hex_encoded_signature>
```

## Request Format
```json
{
  "action": "upsert_article" | "upsert_topic" | "upsert_tag" | "upload_media",
  "payload": { ... },
  "publish_now": boolean,
  "scheduled_at": "ISO8601_date_string",
  "allow_create": boolean
}
```

## Actions

### 1. Create/Update Article
```json
{
  "action": "upsert_article",
  "payload": {
    "slug": "my-article-slug",
    "title": "Article Title",
    "summary": "Brief summary of the article",
    "body": "<p>Full HTML content of the article</p>",
    "topic_slug": "ai-technology",
    "author_id": "uuid-of-author",
    "author_name": "Author Name",
    "seo_title": "SEO optimized title",
    "seo_description": "SEO meta description",
    "hero_image_url": "https://example.com/image.jpg",
    "is_featured": false,
    "tags": ["machine-learning", "artificial-intelligence"]
  },
  "publish_now": true,
  "allow_create": true
}
```

### 2. Create/Update Topic
```json
{
  "action": "upsert_topic",
  "payload": {
    "slug": "artificial-intelligence",
    "name": "Artificial Intelligence",
    "description": "Articles about AI and machine learning",
    "display_order": 10
  }
}
```

### 3. Create/Update Tag
```json
{
  "action": "upsert_tag",
  "payload": {
    "slug": "deep-learning",
    "name": "Deep Learning"
  }
}
```

### 4. Upload Media
```json
{
  "action": "upload_media",
  "payload": {
    "url": "https://example.com/image.jpg",
    "alt": "Description of the image",
    "title": "Image title",
    "credit": "Photo credit"
  }
}
```

## HMAC Signature Generation

### Node.js Example
```javascript
const crypto = require('crypto');

function generateSignature(body, secret) {
  return 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
}

const body = JSON.stringify(requestData);
const signature = generateSignature(body, 'your-secret-key');
```

### Python Example
```python
import hmac
import hashlib
import json

def generate_signature(body, secret):
    return 'sha256=' + hmac.new(
        secret.encode(),
        body.encode(),
        hashlib.sha256
    ).hexdigest()

body = json.dumps(request_data)
signature = generate_signature(body, 'your-secret-key')
```

## Make.com Integration

### HTTP Module Configuration
1. **URL**: `https://ykfiubiogxetbgdkavep.supabase.co/functions/v1/ingest-content`
2. **Method**: POST
3. **Headers**:
   - `Content-Type`: `application/json`
   - `X-Signature`: `{{generateHMAC(body, "your-secret-key")}}`
4. **Body**:
```json
{
  "action": "upsert_article",
  "payload": {
    "title": "{{1.title}}",
    "summary": "{{1.summary}}",
    "body": "{{1.content}}",
    "topic_slug": "{{1.category}}",
    "author_name": "{{1.author}}",
    "hero_image_url": "{{1.featured_image}}"
  },
  "publish_now": true
}
```

### Make.com HMAC Function
Add this function to your Make.com scenario:
```javascript
const crypto = require('crypto');

function generateHMAC(data, secret) {
  const body = typeof data === 'string' ? data : JSON.stringify(data);
  return 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
}

// Usage in Make.com
generateHMAC({{1.requestBody}}, "your-secret-key")
```

## n8n Integration

### HTTP Request Node
1. **Method**: POST
2. **URL**: `https://ykfiubiogxetbgdkavep.supabase.co/functions/v1/ingest-content`
3. **Headers**:
   ```json
   {
     "Content-Type": "application/json",
     "X-Signature": "={{$node['Generate Signature'].json.signature}}"
   }
   ```
4. **Body**:
   ```json
   {
     "action": "upsert_article",
     "payload": {
       "title": "={{$node['Source'].json.title}}",
       "summary": "={{$node['Source'].json.summary}}",
       "body": "={{$node['Source'].json.content}}",
       "topic_slug": "={{$node['Source'].json.category}}",
       "hero_image_url": "={{$node['Source'].json.image_url}}"
     },
     "publish_now": true
   }
   ```

### n8n HMAC Signature Node (Function)
```javascript
const crypto = require('crypto');

const body = JSON.stringify(items[0].json);
const secret = 'your-secret-key';
const signature = 'sha256=' + crypto
  .createHmac('sha256', secret)
  .update(body)
  .digest('hex');

return [{ json: { signature } }];
```

## cURL Examples

### Publish Article with Image
```bash
#!/bin/bash
SECRET="your-secret-key"
BODY='{
  "action": "upsert_article",
  "payload": {
    "title": "Latest AI Breakthrough",
    "summary": "Scientists achieve new milestone in artificial intelligence",
    "body": "<p>Detailed article content here...</p>",
    "topic_slug": "artificial-intelligence",
    "author_name": "Dr. Jane Smith",
    "hero_image_url": "https://example.com/ai-image.jpg",
    "tags": ["ai", "research", "technology"]
  },
  "publish_now": true
}'

SIGNATURE="sha256=$(echo -n "$BODY" | openssl dgst -sha256 -hmac "$SECRET" -binary | xxd -p -c 256)"

curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Signature: $SIGNATURE" \
  -d "$BODY" \
  "https://ykfiubiogxetbgdkavep.supabase.co/functions/v1/ingest-content"
```

### Schedule Article
```bash
#!/bin/bash
SECRET="your-secret-key"
BODY='{
  "action": "upsert_article",
  "payload": {
    "title": "Future Tech Trends",
    "summary": "What to expect in technology next year",
    "body": "<p>Content about future trends...</p>",
    "topic_slug": "technology",
    "author_name": "Tech Analyst"
  },
  "scheduled_at": "2024-12-31T09:00:00Z"
}'

SIGNATURE="sha256=$(echo -n "$BODY" | openssl dgst -sha256 -hmac "$SECRET" -binary | xxd -p -c 256)"

curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Signature: $SIGNATURE" \
  -d "$BODY" \
  "https://ykfiubiogxetbgdkavep.supabase.co/functions/v1/ingest-content"
```

### Create Topic
```bash
#!/bin/bash
SECRET="your-secret-key"
BODY='{
  "action": "upsert_topic",
  "payload": {
    "slug": "quantum-computing",
    "name": "Quantum Computing",
    "description": "Articles about quantum computing technology"
  }
}'

SIGNATURE="sha256=$(echo -n "$BODY" | openssl dgst -sha256 -hmac "$SECRET" -binary | xxd -p -c 256)"

curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Signature: $SIGNATURE" \
  -d "$BODY" \
  "https://ykfiubiogxetbgdkavep.supabase.co/functions/v1/ingest-content"
```

## Response Format

### Success Response
```json
{
  "success": true,
  "action": "upsert_article",
  "result": {
    "id": "article-uuid",
    "slug": "article-slug",
    "title": "Article Title",
    "status": "published",
    "published_at": "2024-01-15T10:00:00Z",
    "hero_image_path": "articles/image-uuid.jpg",
    "tags_count": 2
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Missing required fields: title, summary, body, topic_slug"
}
```

## Performance Notes
- Articles with hero images typically process in <2 seconds
- HMAC verification adds minimal overhead (~10ms)
- All operations are logged in the jobs table for monitoring
- Topics and tags are auto-created when `allow_create: true`

## Security Features
- HMAC-SHA256 signature verification prevents unauthorized access
- Service role authentication bypasses RLS for reliable automation
- All operations are logged for audit trails
- Invalid signatures return 401 Unauthorized

## Monitoring
Check job logs in the Supabase dashboard:
```sql
SELECT * FROM jobs 
WHERE kind = 'ingest_content' 
ORDER BY created_at DESC 
LIMIT 50;
```