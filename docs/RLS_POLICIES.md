# Row Level Security (RLS) Policies

This document explains the Row Level Security policies implemented in the Community Lounges application to ensure data security and proper access control.

## Overview

Row Level Security (RLS) is a PostgreSQL feature that restricts which rows users can access in a table. In our application, RLS ensures that users can only access and modify data they're authorized to see.

## Database Tables

### 1. `lounges` Table

- **Purpose**: Stores information about community lounges
- **RLS Status**: No RLS (public read access)
- **Reason**: Lounge information is public and should be discoverable by all users

### 2. `memberships` Table

- **Purpose**: Tracks user memberships in lounges
- **RLS Status**: Enabled with strict policies
- **Reason**: Contains sensitive user data that must be protected

## RLS Policies

### Membership Table Policies

#### 1. Insert Policy - "Allow user to join lounge"

```sql
CREATE POLICY "Allow user to join lounge" ON memberships
  FOR INSERT WITH CHECK (user_id = auth.uid());
```

**Purpose**: Allows users to join lounges
**Restrictions**:

- User can only create memberships for themselves
- `user_id` must match the authenticated user's ID
- Prevents users from joining lounges on behalf of others

#### 2. Delete Policy - "Allow user to leave lounge"

```sql
CREATE POLICY "Allow user to leave lounge" ON memberships
  FOR DELETE USING (user_id = auth.uid());
```

**Purpose**: Allows users to leave lounges
**Restrictions**:

- User can only delete their own memberships
- `user_id` must match the authenticated user's ID
- Prevents users from removing others from lounges

#### 3. Select Policy - "Allow user to read own memberships"

```sql
CREATE POLICY "Allow user to read own memberships" ON memberships
  FOR SELECT USING (user_id = auth.uid());
```

**Purpose**: Allows users to view their own memberships
**Restrictions**:

- User can only see memberships where they are the member
- Used for "My Lounges" page and membership status checks

#### 4. Select Policy - "Allow reading member counts"

```sql
CREATE POLICY "Allow reading member counts" ON memberships
  FOR SELECT USING (true);
```

**Purpose**: Allows public access to member counts
**Restrictions**: None (public data)
**Usage**:

- Display member counts on lounge cards
- Show lounge popularity publicly
- Aggregate data for statistics

## Security Considerations

### 1. Authentication Required

- All membership operations require authentication
- Unauthenticated users can only view public lounge data
- Magic link authentication via Supabase Auth

### 2. Data Isolation

- Users cannot access other users' membership data
- Each user's data is completely isolated
- No cross-user data leakage possible

### 3. Public vs. Private Data

- **Public**: Lounge information, member counts
- **Private**: Individual membership status, user preferences
- Clear separation maintained through policies

## Implementation Details

### Policy Enforcement

```typescript
// Example: Joining a lounge
const { error } = await supabase.from("memberships").insert({
  user_id: user.id, // Must match auth.uid()
  lounge_id: loungeId,
});
```

### Error Handling

```typescript
if (error) {
  // Policy violation or other error
  toast.error(`Failed to join lounge: ${error.message}`);
}
```

## Testing RLS Policies

### 1. Authenticated User Tests

```sql
-- Test joining a lounge (should succeed)
INSERT INTO memberships (user_id, lounge_id)
VALUES (auth.uid(), 'lounge-uuid');

-- Test joining for another user (should fail)
INSERT INTO memberships (user_id, lounge_id)
VALUES ('other-user-uuid', 'lounge-uuid');
```

### 2. Unauthenticated User Tests

```sql
-- Test joining without auth (should fail)
INSERT INTO memberships (user_id, lounge_id)
VALUES (NULL, 'lounge-uuid');
```

### 3. Member Count Tests

```sql
-- Test reading member counts (should succeed)
SELECT COUNT(*) FROM memberships WHERE lounge_id = 'lounge-uuid';
```

## Best Practices

### 1. Policy Naming

- Use descriptive policy names
- Include the operation type (INSERT, SELECT, DELETE)
- Make purpose clear from the name

### 2. Policy Granularity

- Create specific policies for each operation
- Avoid overly broad policies
- Test each policy independently

### 3. Error Handling

- Always handle policy violations gracefully
- Provide user-friendly error messages
- Log security events for monitoring

### 4. Regular Auditing

- Review policies periodically
- Test with different user roles
- Monitor for policy violations

## Troubleshooting

### Common Issues

#### 1. "Policy violation" errors

**Cause**: User trying to access unauthorized data
**Solution**: Check user authentication and policy conditions

#### 2. "Row not found" errors

**Cause**: Policy preventing access to existing data
**Solution**: Verify policy conditions match expected behavior

#### 3. Performance issues

**Cause**: Complex policy conditions
**Solution**: Optimize policy queries and add indexes

### Debugging Tips

1. **Enable RLS logging**:

```sql
SET log_statement = 'all';
```

2. **Test policies directly**:

```sql
-- Test as specific user
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'user-uuid';
```

3. **Check current user**:

```sql
SELECT auth.uid(), auth.role();
```

## Future Enhancements

### 1. Role-Based Access

- Add admin roles for lounge management
- Implement moderator permissions
- Create premium user features

### 2. Advanced Policies

- Time-based access restrictions
- Geographic access controls
- Rate limiting policies

### 3. Audit Logging

- Track policy violations
- Monitor access patterns
- Generate security reports
