import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_CLIENT_URL as string);
const db = client.db('bazar-dor');

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL ? process.env.BETTER_AUTH_URL.replace(/\/$/, "") : undefined,
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: [
        "http://localhost:3000",
        "https://bazardor-lemon.vercel.app",
        "https://*.vercel.app",
        ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL.replace(/\/$/, "")] : []),
        ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ],
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },
    database: mongodbAdapter(db, {
        client,
    }),
});