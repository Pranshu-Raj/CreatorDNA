# X (Twitter) OAuth 2.0 Setup Guide

Based on the official [X OAuth 2.0 documentation](https://docs.x.com/resources/fundamentals/authentication/oauth-2-0/overview)

## Overview

This guide implements **OAuth 2.0 Authorization Code Flow with PKCE** for user authentication, which is the modern and recommended approach by X for authenticating users.

## Prerequisites

1. X Developer Account
2. X Developer App configured for OAuth 2.0
3. NextAuth.js setup in your project

## Step 1: Configure X App for OAuth 2.0

### 1.1 Access X Developer Portal
1. Go to [developer.x.com](https://developer.x.com)
2. Sign in with your X account
3. Navigate to your app dashboard

### 1.2 App Settings
1. Click on your app name
2. Go to **Settings** tab
3. Ensure **App Type** is set to **Web Application** (not Desktop)
4. Set **Website URL** to your domain (e.g., `http://localhost:3000`)

### 1.3 OAuth 2.0 Configuration
1. Go to **Authentication settings**
2. **Enable OAuth 2.0** 
3. Set **Callback URL** to: `http://localhost:3000/api/auth/callback/twitter`
4. For production: `https://yourdomain.com/api/auth/callback/twitter`

### 1.4 OAuth 2.0 Scopes
Configure the following scopes based on your needs:
- `tweet.read` - Read tweets
- `users.read` - Read user profile information
- `offline.access` - Refresh tokens (optional)

### 1.5 Get OAuth 2.0 Credentials
1. Go to **Keys and Tokens** tab
2. Copy your **OAuth 2.0 Client ID**
3. Copy your **OAuth 2.0 Client Secret**

## Step 2: Environment Configuration

Add these to your `.env.local` file:

```env
# X OAuth 2.0 Credentials
TWITTER_CLIENT_ID=your_oauth2_client_id
TWITTER_CLIENT_SECRET=your_oauth2_client_secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## Step 3: OAuth 2.0 Flow Implementation

### Authorization Flow
1. **Authorization Request** - User clicks "Connect X"
2. **Redirect to X** - User authorizes your app
3. **Authorization Code** - X returns code to callback URL
4. **Token Exchange** - Exchange code for access token
5. **User Info** - Fetch user profile using access token

### Technical Details
- **Authorization Endpoint**: `https://twitter.com/i/oauth2/authorize`
- **Token Endpoint**: `https://api.twitter.com/2/oauth2/token`
- **User Info Endpoint**: `https://api.twitter.com/2/users/me`
- **PKCE Method**: `S256` (SHA256)

## Step 4: NextAuth Configuration

The implementation uses NextAuth with OAuth 2.0 provider configuration:

```typescript
TwitterProvider({
  clientId: process.env.TWITTER_CLIENT_ID!,
  clientSecret: process.env.TWITTER_CLIENT_SECRET!,
  version: "2.0",
  authorization: {
    url: "https://twitter.com/i/oauth2/authorize",
    params: {
      scope: "tweet.read users.read offline.access",
      code_challenge_method: "S256",
    },
  },
  token: "https://api.twitter.com/2/oauth2/token",
  userinfo: "https://api.twitter.com/2/users/me",
})
```

## Step 5: Testing the Integration

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test Connection**
   - Navigate to `/dashboard`
   - Go to "Social Integration" tab
   - Click "Connect Twitter Account"
   - Authorize the app on X
   - You should be redirected back successfully

3. **Verify Connection**
   - Check that Twitter status shows "Connected"
   - Test the "Analyze Content" feature

## Step 6: API Usage

### Making API Calls
With OAuth 2.0, you can make authenticated API calls:

```javascript
// Example: Get user tweets
const response = await fetch('https://api.twitter.com/2/users/me/tweets', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
});
```

### Token Management
- **Access Token**: Use for API calls
- **Refresh Token**: Use to get new access tokens
- **Expires**: Tokens have expiration times

## Troubleshooting

### Common Issues

1. **"Invalid client_id"**
   - Verify your OAuth 2.0 Client ID is correct
   - Ensure you're using OAuth 2.0 credentials, not OAuth 1.0a

2. **"Invalid redirect_uri"**
   - Check callback URL matches exactly in X app settings
   - Ensure no trailing slashes or typos

3. **"Access denied"**
   - Verify your app has proper scopes configured
   - Check that OAuth 2.0 is enabled in X app settings

4. **"PKCE verification failed"**
   - This is handled automatically by NextAuth
   - Ensure `code_challenge_method` is set to `S256`

### Debug Mode
Enable NextAuth debug logging:
```env
NEXTAUTH_DEBUG=true
```

## Security Considerations

1. **PKCE**: Automatically implemented for security
2. **State Parameter**: Prevents CSRF attacks
3. **Token Storage**: Stored securely in JWT
4. **Scope Limitation**: Only request necessary scopes

## Rate Limits

OAuth 2.0 API calls are rate limited per endpoint:
- **User context**: 75 requests per 15 minutes
- **App context**: 300 requests per 15 minutes

## Production Deployment

1. Update callback URL in X app settings
2. Set production environment variables
3. Use HTTPS for all OAuth flows
4. Implement proper error handling

## Resources

- [X OAuth 2.0 Documentation](https://docs.x.com/resources/fundamentals/authentication/oauth-2-0/overview)
- [NextAuth Twitter Provider](https://next-auth.js.org/providers/twitter)
- [X API Reference](https://developer.x.com/en/docs/api-reference-index) 