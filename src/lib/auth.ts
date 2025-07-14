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
      version: "2.0", // Use Twitter API v2
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
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
      }
      
      // Handle Twitter connection
      if (account?.provider === 'twitter') {
        token.twitterConnected = true;
        token.twitterHandle = account.username || null;
        token.twitterAccessToken = account.access_token;
        token.twitterRefreshToken = account.refresh_token;
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