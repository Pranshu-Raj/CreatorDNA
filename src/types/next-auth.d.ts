declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      twitterConnected?: boolean;
      twitterHandle?: string | null;
    };
    accessToken?: string; // OAuth 2.0 access token
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string;
    twitterConnected?: boolean;
    twitterHandle?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub: string;
    twitterConnected?: boolean;
    twitterHandle?: string | null;
    twitterUserId?: string;
    // OAuth 2.0 tokens
    twitterAccessToken?: string;
    twitterRefreshToken?: string;
    twitterTokenType?: string;
    twitterScope?: string;
  }
} 