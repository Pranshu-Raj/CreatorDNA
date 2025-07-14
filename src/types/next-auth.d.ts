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
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    twitterConnected?: boolean;
    twitterHandle?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub: string;
    twitterConnected?: boolean;
    twitterHandle?: string | null;
    twitterAccessToken?: string;
    twitterRefreshToken?: string;
  }
} 