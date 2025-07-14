# Twitter OAuth Setup for CreatorDNA

This guide will help you set up Twitter OAuth integration so users can connect their Twitter accounts and analyze their content.

## Prerequisites

1. A Twitter Developer Account
2. NextAuth.js already configured in your project
3. Environment variables setup capability

## Step 1: Create Twitter App

### 1.1 Apply for Twitter Developer Account
1. Go to [developer.twitter.com](https://developer.twitter.com)
2. Sign in with your Twitter account
3. Apply for a developer account (if you don't have one)
4. Wait for approval (can take a few hours to days)

### 1.2 Create a New App
1. Once approved, go to the [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Click "Create New App" or "New Project"
3. Fill in the required information:
   - **App Name**: CreatorDNA (or your preferred name)
   - **Description**: AI-powered content creator personality analysis
   - **Website URL**: Your domain (e.g., https://creatordna.com)
   - **Use Case**: Content analysis and creator tools

### 1.3 Configure OAuth 2.0 Settings
1. In your app settings, go to "Authentication settings"
2. Enable "OAuth 2.0"
3. Set the **Callback URL** to:
   ```
   http://localhost:3000/api/auth/callback/twitter
   ```
   For production, use your domain:
   ```
   https://yourdomain.com/api/auth/callback/twitter
   ```
4. Enable "Request email from users" (optional but recommended)

### 1.4 Get Your Credentials
1. Go to "Keys and Tokens" tab
2. Copy your:
   - **Client ID** (OAuth 2.0 Client ID)
   - **Client Secret** (OAuth 2.0 Client Secret)

## Step 2: Configure Environment Variables

Add these variables to your `.env.local` file:

```env
# Twitter OAuth 2.0 Credentials
TWITTER_CLIENT_ID=your_twitter_client_id_here
TWITTER_CLIENT_SECRET=your_twitter_client_secret_here

# Make sure you also have these NextAuth variables
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### Production Environment Variables
For production deployment (Vercel, Netlify, etc.), set these environment variables:

```env
TWITTER_CLIENT_ID=your_twitter_client_id_here
TWITTER_CLIENT_SECRET=your_twitter_client_secret_here
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_production_nextauth_secret
```

## Step 3: Update Callback URLs for Production

When deploying to production, update your Twitter app's callback URL:

1. Go to your Twitter App settings
2. Update the Callback URL to match your production domain:
   ```
   https://yourdomain.com/api/auth/callback/twitter
   ```

## Step 4: Test the Integration

### 4.1 Start Your Development Server
```bash
npm run dev
```

### 4.2 Test Twitter Connection
1. Navigate to `/dashboard`
2. Look for the "Twitter Analysis" section
3. Click "Connect Twitter"
4. You should be redirected to Twitter for authorization
5. After authorization, you should be redirected back to your dashboard

### 4.3 Test Twitter Analysis
1. Once connected, click "Analyze Content"
2. You should see mock analysis data (in production, this would be real Twitter data)

## Step 5: Implement Real Twitter API Integration (Optional)

The current implementation uses mock data. To implement real Twitter API integration:

### 5.1 Get Twitter API v2 Bearer Token
1. In your Twitter app, generate a **Bearer Token**
2. Add it to your environment variables:
   ```env
   TWITTER_BEARER_TOKEN=your_bearer_token_here
   ```

### 5.2 Update API Routes
Modify the following files to use real Twitter API calls:
- `src/app/api/twitter/analyze/route.ts`
- Add Twitter API client library (e.g., `twitter-api-v2`)

### 5.3 Install Twitter API Library
```bash
npm install twitter-api-v2
```

### 5.4 Example Real Implementation
```typescript
// In src/app/api/twitter/analyze/route.ts
import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN!);

// Fetch user's tweets and analyze them
const tweets = await client.v2.userTimeline(userId, {
  max_results: 100,
  'tweet.fields': ['public_metrics', 'created_at', 'text']
});
```

## Step 6: Database Integration (Recommended for Production)

For production use, implement proper database storage:

### 6.1 Store Twitter Tokens
- Store access tokens securely in your database
- Associate tokens with user accounts
- Implement token refresh logic

### 6.2 Cache Analysis Results
- Store analysis results in database
- Implement caching to avoid API rate limits
- Add analysis history tracking

## Troubleshooting

### Common Issues

1. **"Invalid callback URL" error**
   - Ensure callback URL in Twitter app matches your NextAuth configuration
   - Check for typos in the URL

2. **"Authentication failed" error**
   - Verify your Client ID and Secret are correct
   - Check that your app has OAuth 2.0 enabled

3. **"Access denied" error**
   - Ensure your Twitter app has the right permissions
   - Check that you're requesting appropriate scopes

4. **Rate limiting issues**
   - Implement proper caching
   - Add retry logic with exponential backoff
   - Consider upgrading to Twitter API Pro if needed

### Debug Mode

To debug Twitter OAuth issues:

1. Enable NextAuth debug mode:
   ```env
   NEXTAUTH_DEBUG=true
   ```

2. Check browser network tab for failed requests
3. Review server logs for detailed error messages

## Security Considerations

1. **Never expose credentials**: Keep Client Secret secure and never commit to version control
2. **Use HTTPS in production**: Always use HTTPS for production deployments
3. **Implement rate limiting**: Add rate limiting to prevent abuse
4. **Validate tokens**: Always validate and refresh tokens before API calls
5. **Store tokens securely**: Use encrypted database storage for tokens

## API Rate Limits

Twitter API v2 rate limits (per 15-minute window):
- **User lookup**: 300 requests
- **User tweets**: 300 requests
- **Tweet lookup**: 300 requests

Plan your analysis frequency accordingly.

## Testing Checklist

- [ ] Twitter app created and configured
- [ ] Environment variables set correctly
- [ ] OAuth callback URL matches configuration
- [ ] Can connect Twitter account successfully
- [ ] Can disconnect Twitter account
- [ ] Analysis displays mock data correctly
- [ ] Error handling works for failed connections
- [ ] Works in both development and production

## Next Steps

After successful setup:

1. Implement real Twitter API integration
2. Add database storage for user connections
3. Create analysis caching system
4. Add more detailed content analysis features
5. Implement scheduling for periodic analysis updates

## Support

If you encounter issues:

1. Check the [NextAuth.js Twitter Provider documentation](https://next-auth.js.org/providers/twitter)
2. Review [Twitter API v2 documentation](https://developer.twitter.com/en/docs/twitter-api)
3. Check the project's GitHub issues for similar problems 