import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },

  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        captcha_token: { label: "Captcha Token", type: "text" },
        captcha_code: { label: "Captcha Code", type: "text" }
      },

      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password, captcha_token, captcha_code } = credentials;

        const response = await fetch(`${process.env.SITE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${process.env.BASIC_AUTH_TOKEN}`
          },
          body: JSON.stringify({
            email,
            password,
            captcha_token,
            captcha_code
          })
        });

        const result = await response.json();
        console.log(result, '>>>>>');
        if (!response.ok) {
          throw new Error(result?.message || result?.data);
        }

        return {
          id: result.data.profile.id,
          status: result.statusCode,
          accessToken: result.data.access_token,
          profile: result.data.profile
        };
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.accessToken;
        token.profile = user.profile;
      }

      return token;
    },

    async session({ session, token }: any) {
      session.accessToken = token.accessToken as string;
      session.profile = token.profile;

      return session;
    }
  },

  pages: {
    signIn: "/auth/login"
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
