import { PrismaAdapter } from "@auth/prisma-adapter";
import type { PrismaClient } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import {
    getServerSession,
    type DefaultSession,
    type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";

import { loginRoute } from "@/config/auth";
import { db } from "@/lib/db";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    callbacks: {
        session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub!;
            }
            return session;
        },
    },
    adapter: PrismaAdapter(db) as Adapter,
    providers: [
        CredentialsProvider({
            credentials: {
                email: { type: "email" },
                password: { type: "password" },
            },
            authorize: authorize(db),
        }),
        CredentialsProvider({
            id: "signup",
            type: "credentials",
            credentials: {
                email: { type: "email" },
                password: { type: "password" },
            },
            authorize: signup(db),
        }),
    ],
    pages: {
        signIn: loginRoute,
    },
};

function signup(prisma: PrismaClient) {
    return async (
        credentials: Record<"email" | "password", string> | undefined
    ) => {
        if (!credentials) throw new Error("Missing credentials");
        if (!credentials.email)
            throw new Error('"email" is required in credentials');
        if (!credentials.password)
            throw new Error('"password" is required in credentials');

        const existingUser = await prisma.user.findFirst({
            where: { email: credentials.email },
        });

        if (existingUser) throw new Error("User already exists");

        const hashedPassword = await hash(credentials.password, 10);

        const user = await prisma.user.create({
            data: {
                email: credentials.email,
                password: hashedPassword,
            },
        });

        return { id: user.id, email: user.email };
    };
}

function authorize(prisma: PrismaClient) {
    return async (
        credentials: Record<"email" | "password", string> | undefined
    ) => {
        if (!credentials) throw new Error("Missing credentials");
        if (!credentials.email)
            throw new Error('"email" is required in credentials');
        if (!credentials.password)
            throw new Error('"password" is required in credentials');
        const maybeUser = await prisma.user.findFirst({
            where: { email: credentials.email },
            select: { id: true, email: true, password: true },
        });
        if (!maybeUser?.password) return null;
        // verify the input password with stored hash
        const isValid = await compare(credentials.password, maybeUser.password);
        if (!isValid) return null;
        return { id: maybeUser.id, email: maybeUser.email };
    };
}

export const getServerAuthSession = () => getServerSession(authOptions);
