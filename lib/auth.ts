import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";


export const authOptions: NextAuthOptions = {

  providers: [

    CredentialsProvider({

      name: "credentials",

      credentials: {

        email: {},

        password: {},

        rememberMe: {},

      },


      async authorize(credentials) {

        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          return null;
        }


        const user = await prisma.user.findUnique({

          where: {
            email: credentials.email,
          },

        });


        if (!user) {
          return null;
        }


        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );


        if (!passwordMatch) {
          return null;
        }


        if (!user.emailVerified) {
          return null;
        }


        return {

          id: user.id,

          name: user.name,

          email: user.email,

          role: user.role,

          rememberMe:
            credentials.rememberMe === "true",

        };

      },

    }),

  ],


  session: {

    strategy: "jwt",

  },


  callbacks: {


    async jwt({ token, user }) {


      if (user) {


        token.id = user.id;

        token.role = user.role;


        const extendedUser = user as typeof user & {
          rememberMe?: boolean;
        };


        token.rememberMe =
          extendedUser.rememberMe ?? false;


        token.maxAge =
          extendedUser.rememberMe
            ? 30 * 24 * 60 * 60
            : 15 * 60;

      }


      return token;

    },



    async session({ session, token }) {


      if (session.user) {


        session.user.id =
          token.id as string;


        session.user.role =
          token.role as string;


      }


      return session;

    },

  },


  pages: {

    signIn: "/login",

  },

};