import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0", // Use OAuth 2.0 as per X documentation
      authorization: {
        url: "https://twitter.com/i/oauth2/authorize",
        params: {
          scope: "tweet.read users.read offline.access",
          code_challenge_method: "S256",
        },
      },
      token: "https://api.twitter.com/2/oauth2/token",
      userinfo: "https://api.twitter.com/2/users/me",
      profile(profile: any) {
        return {
          id: profile.data?.id || profile.id,
          name: profile.data?.name || profile.name,
          email: profile.data?.email || profile.email || null,
          image: profile.data?.profile_image_url || profile.profile_image_url || null,
          username: profile.data?.username || profile.username,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.twitterConnected = token.twitterConnected || false;
        session.user.twitterHandle = token.twitterHandle || null;
        
        // Add access token to session for API calls
        if (token.twitterAccessToken) {
          (session as any).accessToken = token.twitterAccessToken;
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
      }
      
      // Handle Twitter OAuth 2.0 connection
      if (account?.provider === 'twitter') {
        token.twitterConnected = true;
        token.twitterHandle = (user as any)?.username || user?.name || null;
        token.twitterAccessToken = account.access_token;
        token.twitterRefreshToken = account.refresh_token;
        token.twitterTokenType = account.token_type;
        token.twitterScope = account.scope;
        token.twitterUserId = user.id;
      }
      
      return token;
    },
    async signIn({ user, account, profile }) {
      // Allow sign in for all providers
      return true;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 