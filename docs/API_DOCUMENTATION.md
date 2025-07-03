# API Documentation

This document describes the API endpoints, server actions, and data structures used in the Community Lounges application.

## Overview

The application uses a combination of:

- **Server Actions**: For form submissions and data mutations
- **API Routes**: For data fetching and external integrations
- **Supabase Client**: For direct database operations

## Server Actions

### Membership Actions

#### Join Lounge

```typescript
// File: src/app/actions/membership.ts
export async function joinLounge(loungeId: string): Promise<{ error?: string }>;
```

**Purpose**: Add a user to a lounge membership
**Authentication**: Required
**RLS Policy**: "Allow user to join lounge"

**Usage**:

```typescript
const result = await joinLounge("lounge-uuid");
if (result.error) {
  toast.error(result.error);
}
```

#### Leave Lounge

```typescript
// File: src/app/actions/membership.ts
export async function leaveLounge(
  loungeId: string
): Promise<{ error?: string }>;
```

**Purpose**: Remove a user from a lounge membership
**Authentication**: Required
**RLS Policy**: "Allow user to leave lounge"

**Usage**:

```typescript
const result = await leaveLounge("lounge-uuid");
if (result.error) {
  toast.error(result.error);
}
```

## Database Functions

### Stored Procedures

#### get_lounges_with_user_membership

```sql
CREATE OR REPLACE FUNCTION get_lounges_with_user_membership(user_id UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  image_url TEXT,
  slug TEXT,
  is_member BOOLEAN,
  member_count INTEGER
)
```

**Purpose**: Get all lounges with user membership status and member counts
**Parameters**:

- `user_id`: Optional user ID for membership check
  **Returns**: Lounge data with membership status and member count

**Usage**:

```typescript
const { data } = await supabase.rpc("get_lounges_with_user_membership");
```

#### get_my_lounges

```sql
CREATE OR REPLACE FUNCTION get_my_lounges()
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  image_url TEXT,
  slug TEXT,
  is_member BOOLEAN,
  member_count INTEGER
)
```

**Purpose**: Get lounges that the current user is a member of
**Authentication**: Required
**Returns**: User's lounges with member counts

**Usage**:

```typescript
const { data } = await supabase.rpc("get_my_lounges");
```

#### get_lounge_by_slug

```sql
CREATE OR REPLACE FUNCTION get_lounge_by_slug(slug TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  image_url TEXT,
  slug TEXT,
  is_member BOOLEAN,
  member_count INTEGER
)
```

**Purpose**: Get a specific lounge by its slug
**Parameters**:

- `slug`: Lounge slug identifier
  **Returns**: Lounge data with membership status and member count

**Usage**:

```typescript
const { data } = await supabase.rpc("get_lounge_by_slug", {
  slug: "tech-talk",
});
```

#### get_lounge_member_counts

```sql
CREATE OR REPLACE FUNCTION get_lounge_member_counts()
RETURNS TABLE(lounge_id UUID, count BIGINT)
```

**Purpose**: Get member counts for all lounges
**Returns**: Lounge ID and member count pairs

**Usage**:

```typescript
const { data } = await supabase.rpc("get_lounge_member_counts");
```

## Data Types

### Lounge

```typescript
type Lounge = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  slug: string;
  is_member: boolean;
  member_count: number;
};
```

### LoungeWithMembership

```typescript
type LoungeWithMembership = {
  id: string;
  image_url: string;
  title: string;
  slug: string;
  description: string;
  is_member: boolean;
  member_count: number;
};
```

### Membership

```typescript
type Membership = {
  id: string;
  user_id: string;
  lounge_id: string;
};
```

## Error Handling

### Standard Error Response

```typescript
type ErrorResponse = {
  error: string;
};
```

### Common Error Codes

- `401`: Unauthorized (authentication required)
- `403`: Forbidden (RLS policy violation)
- `404`: Not found (lounge doesn't exist)
- `409`: Conflict (already a member)
- `500`: Internal server error

## Authentication

### Magic Link Authentication

```typescript
// Sign in with email
const { error } = await supabase.auth.signInWithOtp({
  email: "user@example.com",
});

// Sign out
const { error } = await supabase.auth.signOut();
```

### User Context

```typescript
// Get current user
const {
  data: { user },
} = await supabase.auth.getUser();

// Listen to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  // Handle auth state changes
});
```

## Performance Optimizations

### Caching Strategy

- **ISR**: Home page revalidates every 10 minutes
- **Static Generation**: Lounge cards pre-rendered
- **Client-side Hydration**: Interactive features after initial load

### Image Optimization

```typescript
// Next.js Image with responsive sizes
<Image
  src={imageUrl}
  alt={title}
  fill
  sizes="(max-width: 768px) 100vw, 400px"
  priority={variant === "default"}
/>
```

### Prefetching

```typescript
// Prefetch detail pages on hover
<Link href={`/lounges/${slug}`} prefetch={true}>
  <LoungeCard />
</Link>
```

## Rate Limiting

### Supabase Limits

- **API Requests**: 1000 requests per minute per user
- **Database Connections**: 100 concurrent connections
- **Storage**: 1GB free tier

### Application Limits

- **Join/Leave**: No rate limiting (user-controlled)
- **Image Uploads**: Not implemented (external URLs)
- **Authentication**: Supabase Auth limits apply

## Security Considerations

### Input Validation

```typescript
// Validate lounge ID format
const isValidUUID = (id: string) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    id
  );
};
```

### SQL Injection Prevention

- Use Supabase client (parameterized queries)
- Avoid raw SQL strings
- Validate all inputs

### XSS Prevention

- Sanitize user inputs
- Use React's built-in XSS protection
- Validate image URLs

## Monitoring and Logging

### Error Logging

```typescript
// Log errors for monitoring
console.error("Membership error:", error);
// In production: Use proper logging service
```

### Performance Monitoring

- Lighthouse scores
- Core Web Vitals
- Supabase dashboard metrics

## Testing

### Unit Tests

```typescript
// Test membership functions
describe("joinLounge", () => {
  it("should join a lounge successfully", async () => {
    const result = await joinLounge("test-lounge-id");
    expect(result.error).toBeUndefined();
  });
});
```

### Integration Tests

```typescript
// Test RLS policies
describe("RLS Policies", () => {
  it("should prevent unauthorized access", async () => {
    // Test policy violations
  });
});
```

## Deployment

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Build Process

```bash
npm run build
npm start
```

### Vercel Deployment

- Automatic deployment on push to main
- Environment variables configured in dashboard
- Edge functions for server actions
