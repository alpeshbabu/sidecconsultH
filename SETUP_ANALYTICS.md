# Analytics Setup Instructions

Quick guide to get Google Analytics 4 running on your SIDEC Consulting website.

## Prerequisites

- Google account
- Access to Google Analytics

## Step 1: Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon in bottom left)
3. In the **Account** column, click **Create Account**
   - Account name: "SIDEC Consulting"
   - Check data sharing settings as desired
4. In the **Property** column, click **Create Property**
   - Property name: "SIDEC Consulting Website"
   - Reporting time zone: Your timezone
   - Currency: USD (or your preference)
5. Complete business information
   - Industry: Healthcare/Medical Devices
   - Business size: Select appropriate size
6. Complete business objectives
7. Click **Create** and accept terms

## Step 2: Get Your Measurement ID

1. In your new property, go to **Admin** > **Data Streams**
2. Click **Add stream** > **Web**
3. Enter:
   - Website URL: `https://sidecconsult.com` (or your domain)
   - Stream name: "Production Website"
4. Click **Create stream**
5. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

## Step 3: Add to Environment Variables

Create `.env.local` in your project root (if it doesn't exist):

```bash
# Copy from .env.local.example or create manually
cp .env.local.example .env.local
```

Edit `.env.local`:

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"  # Replace with your ID

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # For local dev
# NEXT_PUBLIC_APP_URL="https://sidecconsult.com"  # For production
```

## Step 4: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Start it again
npm run dev
```

## Step 5: Verify Installation

### Check Console (Development)

1. Open your website: `http://localhost:3000`
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. Look for:
   ```
   [Analytics] Google Analytics initialized
   ```

### Check Network Requests

1. Go to **Network** tab in DevTools
2. Filter by "google-analytics.com" or "gtag"
3. Navigate around the site
4. You should see requests to Google Analytics

### Check Real-time Reports

1. Go to Google Analytics
2. Click **Reports** > **Realtime**
3. Navigate your website
4. You should see your activity in real-time

## Step 6: Test Cookie Consent

1. Open website in **Incognito/Private** mode
2. You should see the cookie consent banner
3. Click **Customize** to see preferences
4. Test **Accept All** and **Reject All**
5. Check localStorage in DevTools:
   - Application > Local Storage
   - Look for `cookie_consent` key

## Step 7: Test Event Tracking

### Test Contact Form

1. Go to `/contact`
2. Click on any form field
3. Check console for: `[Analytics] contact_form_start`
4. Fill out and submit form
5. Check console for: `[Analytics] contact_form_complete`

### Test CTA Buttons

1. Click any button/link on homepage
2. Check console for analytics events
3. Or use `TrackedButton` component (see ANALYTICS.md)

## Configuration Options

### Custom Events

Add custom events in `lib/analytics.ts`:

```typescript
export const trackCustomEvent = (name: string, params?: EventParams) => {
  event(name, params);
};
```

### Debug Mode

Enable detailed logging:

```typescript
// In components/shared/GoogleAnalytics.tsx
gtag('config', GA_MEASUREMENT_ID, {
  debug_mode: true  // Add this line
});
```

### Enhanced Measurement

Enable in GA4:
1. **Admin** > **Data Streams** > Your stream
2. Click **Enhanced measurement**
3. Toggle on:
   - Page views (auto-tracked)
   - Scrolls
   - Outbound clicks
   - Site search
   - Video engagement
   - File downloads

## Troubleshooting

### No Events Showing

**Check:**
- ✅ Measurement ID is correct in `.env.local`
- ✅ Server restarted after adding env variable
- ✅ Cookie consent accepted (or test without consent mode)
- ✅ No ad blockers blocking Google Analytics
- ✅ Browser DevTools Network tab shows gtag requests

### Events in Console but Not GA

**Possible causes:**
- Analytics needs 24-48 hours for historical reports
- Use Real-time reports for immediate data
- Check GA4 DebugView for more detail

### Cookie Banner Not Showing

**Check:**
- ✅ Clear browser localStorage
- ✅ Check console for errors
- ✅ Try incognito/private mode
- ✅ Banner auto-shows after 1 second delay

### TypeScript Errors

**Solution:**
```bash
npm run typecheck  # Check for errors
```

If gtag types are missing:
```bash
npm install --save-dev @types/gtag.js
```

## Production Deployment

### Environment Variables

Set in your hosting platform (Vercel, Netlify, etc.):

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_APP_URL=https://sidecconsult.com
```

### Verify Production

1. Deploy to production
2. Visit your live site
3. Check GA Real-time reports
4. Verify events are tracking

### Multiple Environments

Use different GA properties:
- Development: `G-DEV1234567`
- Staging: `G-STG1234567`
- Production: `G-PRD1234567`

## Next Steps

1. **Set up Goals/Conversions** in GA4
   - Contact form submissions
   - Service inquiries
   - Resource downloads

2. **Create Custom Reports** in GA4
   - Service interest analysis
   - User journey tracking
   - Conversion funnels

3. **Set up Alerts**
   - Traffic anomalies
   - Conversion drops
   - Error spikes

4. **Enable BigQuery Export** (optional)
   - For advanced analysis
   - Data warehousing
   - Custom reporting

## Additional Resources

- [Complete Analytics Guide](./ANALYTICS.md)
- [GA4 Setup Documentation](https://support.google.com/analytics/answer/9304153)
- [Event Tracking Reference](https://support.google.com/analytics/answer/9267735)
- [Cookie Consent Guide](https://support.google.com/analytics/answer/9976101)

## Support

If you encounter issues:
1. Check browser console for errors
2. Review the [ANALYTICS.md](./ANALYTICS.md) guide
3. Use GA4 DebugView for detailed event inspection
4. Check Google Analytics Community forums
