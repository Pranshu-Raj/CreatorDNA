# Fix Twitter OAuth Configuration

## Problem
Your Twitter app is configured as a "Desktop Application" which doesn't support web OAuth callbacks. This causes the error:
```
Desktop applications only support the oauth_callback value 'oob'
```

## Solution: Reconfigure Twitter App

### Step 1: Access Twitter Developer Portal
1. Go to [developer.twitter.com](https://developer.twitter.com)
2. Sign in with your Twitter account
3. Navigate to your app dashboard

### Step 2: Update App Type
1. Find your app in the dashboard
2. Click on your app name
3. Go to "Settings" tab
4. Look for "App Type" or "Application Type"
5. **Change from "Desktop Application" to "Web Application"**

### Step 3: Configure OAuth Settings
1. Go to "Authentication settings" or "OAuth" section
2. Enable "OAuth 1.0a" (recommended for stability)
3. Set callback URL to: `http://localhost:3000/api/auth/callback/twitter`
4. For production, also add: `https://yourdomain.com/api/auth/callback/twitter`

### Step 4: Update App Permissions
1. Go to "Permissions" tab
2. Set to "Read and write" (or "Read" if you only need basic info)
3. Enable "Request email from users" if needed

### Step 5: Regenerate Keys (if needed)
1. Go to "Keys and Tokens" tab
2. If you changed the app type, regenerate your:
   - API Key (Client ID)
   - API Secret Key (Client Secret)
3. Update your `.env` file with new credentials

## Alternative: Create New Web App

If you can't change the app type:

1. Create a new Twitter app
2. Select "Web Application" during setup
3. Configure with these settings:
   - **App Type**: Web Application
   - **Callback URL**: `http://localhost:3000/api/auth/callback/twitter`
   - **Website URL**: `http://localhost:3000`
   - **Permissions**: Read (minimum)

## Testing

After making changes:
1. Restart your development server
2. Try connecting Twitter from the dashboard
3. You should be redirected to Twitter for authorization
4. After approval, you'll be redirected back to your app

## Common Issues

- **Still getting errors?** Wait 5-10 minutes after making changes
- **App not found?** Make sure you're using the correct Client ID/Secret
- **Callback mismatch?** Ensure callback URL exactly matches what's configured
- **Rate limits?** Twitter may rate limit failed attempts

## Environment Variables

Make sure your `.env` file has:
```env
TWITTER_CLIENT_ID=your_actual_client_id
TWITTER_CLIENT_SECRET=your_actual_client_secret
```

## Need Help?

If you're still having issues:
1. Check Twitter's app dashboard for any error messages
2. Verify your app has the correct permissions
3. Ensure your app is approved (not in pending state)
4. Try creating a completely new Twitter app as a web application 