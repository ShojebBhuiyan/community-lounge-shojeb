# Deployment Guide

This guide covers deploying the Community Lounges application to production environments.

## Prerequisites

- **Supabase Account**: For database and authentication
- **Vercel Account**: For hosting (recommended)
- **GitHub Account**: For version control
- **Domain Name**: Optional, for custom domain

## Environment Setup

### 1. Supabase Configuration

#### Create New Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and API keys

#### Database Setup

1. Open SQL Editor in Supabase Dashboard
2. Run the SQL commands from `supabase.sql`:

   ```sql
   -- Tables
   CREATE TABLE lounges (...);
   CREATE TABLE memberships (...);

   -- RLS Policies
   ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Allow user to join lounge" ON memberships...;

   -- Functions
   CREATE OR REPLACE FUNCTION get_lounges_with_user_membership(...);

   -- Seed Data
   INSERT INTO lounges (slug, title, image_url, description) VALUES (...);
   ```

#### Authentication Setup

1. Go to Authentication > Settings
2. Configure your site URL (e.g., `https://your-app.vercel.app`)
3. Add redirect URLs for authentication
4. Configure email templates if needed

### 2. Environment Variables

Create `.env.local` for development:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Deployment Options

### Option 1: Vercel (Recommended)

#### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

#### 2. Environment Variables

Add these in Vercel Dashboard > Settings > Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### 3. Deploy

1. Push to main branch
2. Vercel automatically deploys
3. Check deployment status in dashboard

#### 4. Custom Domain (Optional)

1. Go to Settings > Domains
2. Add your custom domain
3. Configure DNS records
4. Update Supabase site URL

### Option 2: Netlify

#### 1. Connect Repository

1. Go to [netlify.com](https://netlify.com)
2. Import from Git
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `.next`

#### 2. Environment Variables

Add in Site Settings > Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Option 3: Self-Hosted

#### 1. Server Requirements

- Node.js 18+
- npm or yarn
- PM2 (for process management)
- Nginx (for reverse proxy)

#### 2. Build and Deploy

```bash
# Clone repository
git clone <repository-url>
cd community-lounges

# Install dependencies
npm install

# Build application
npm run build

# Start production server
npm start
```

#### 3. PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: "community-lounges",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        NEXT_PUBLIC_SUPABASE_URL: "your_supabase_url",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "your_anon_key",
        SUPABASE_SERVICE_ROLE_KEY: "your_service_role_key",
      },
    },
  ],
};
```

#### 4. Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Post-Deployment Checklist

### 1. Functionality Testing

- [ ] Home page loads correctly
- [ ] Authentication works (sign in/out)
- [ ] Lounge cards display properly
- [ ] Join/leave functionality works
- [ ] Detail pages load
- [ ] Navigation works
- [ ] Images load correctly

### 2. Performance Testing

- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Test on mobile devices
- [ ] Verify image optimization
- [ ] Check loading times

### 3. Security Verification

- [ ] Environment variables are set
- [ ] RLS policies are working
- [ ] Authentication redirects work
- [ ] No sensitive data in client bundle
- [ ] HTTPS is enabled

### 4. Monitoring Setup

- [ ] Set up error tracking (Sentry)
- [ ] Configure performance monitoring
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation

## Performance Optimization

### 1. Image Optimization

- Use Next.js Image component
- Configure proper `sizes` attributes
- Optimize image formats (WebP/AVIF)
- Use CDN for image delivery

### 2. Caching Strategy

- Leverage ISR for static pages
- Configure CDN caching headers
- Use browser caching for assets
- Implement service worker if needed

### 3. Bundle Optimization

- Analyze bundle size with `@next/bundle-analyzer`
- Remove unused dependencies
- Optimize imports
- Use dynamic imports for large components

## Monitoring and Maintenance

### 1. Error Tracking

```typescript
// Add to _app.tsx or layout.tsx
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
});
```

### 2. Performance Monitoring

- Use Vercel Analytics
- Monitor Core Web Vitals
- Track user interactions
- Monitor API response times

### 3. Database Monitoring

- Monitor Supabase usage
- Track query performance
- Set up alerts for rate limits
- Monitor storage usage

### 4. Regular Maintenance

- Update dependencies monthly
- Review security advisories
- Monitor for breaking changes
- Backup database regularly

## Troubleshooting

### Common Issues

#### 1. Build Failures

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

#### 2. Environment Variables

- Check variable names (case-sensitive)
- Verify values are correct
- Ensure no trailing spaces
- Check for special characters

#### 3. Database Connection

- Verify Supabase URL and keys
- Check RLS policies
- Test authentication flow
- Monitor API rate limits

#### 4. Image Loading

- Check image URLs are accessible
- Verify Next.js Image configuration
- Check domain allowlist in `next.config.js`
- Test with different image formats

### Debug Commands

```bash
# Check build output
npm run build

# Analyze bundle
npm run analyze

# Run type checking
npm run type-check

# Test production build locally
npm run build && npm start
```

## Scaling Considerations

### 1. Database Scaling

- Monitor Supabase usage
- Consider upgrading plan
- Implement connection pooling
- Optimize queries

### 2. Application Scaling

- Use edge functions for global deployment
- Implement caching strategies
- Consider microservices for complex features
- Monitor resource usage

### 3. Traffic Management

- Set up CDN for global distribution
- Implement rate limiting
- Monitor bandwidth usage
- Plan for traffic spikes

## Security Best Practices

### 1. Environment Variables

- Never commit secrets to Git
- Use different keys for dev/staging/prod
- Rotate keys regularly
- Use secure key management

### 2. Database Security

- Enable RLS on all tables
- Use least privilege principle
- Monitor for suspicious activity
- Regular security audits

### 3. Application Security

- Keep dependencies updated
- Implement input validation
- Use HTTPS everywhere
- Regular security scans

## Support and Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

### Community

- [Next.js Discord](https://discord.gg/nextjs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/your-repo/issues)

### Monitoring Tools

- [Sentry](https://sentry.io) - Error tracking
- [Vercel Analytics](https://vercel.com/analytics) - Performance
- [Supabase Dashboard](https://supabase.com/dashboard) - Database
